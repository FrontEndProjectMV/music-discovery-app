import { useState, useCallback, type ReactNode } from "react";
import { PlaylistContext } from "./PlaylistContext";
import { type PlaylistContextType, type Playlist, type PlaylistTrack } from "./PlaylistType";
import { useSpotifyAPIContext } from "../SpotifyAPIContext/SpotifyAPIContext";

export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const spotifyAPI = useSpotifyAPIContext();

    const formatDuration = (duration_ms: number): string => {
        const minutes = Math.floor(duration_ms / 60000);
        const seconds = Math.floor((duration_ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const loadUserPlaylists = useCallback(async () => {
        if (!spotifyAPI.loggedIn) return;
        
        setLoading(true);
        try {
            const playlistData = await spotifyAPI.getUserPlaylists();
            if (playlistData?.items) {
                const spotifyPlaylists: Playlist[] = playlistData.items.map(playlist => ({
                    id: `spotify_${playlist.id}`,
                    spotifyId: playlist.id,
                    name: playlist.name,
                    description: playlist.description || "",
                    owner: playlist.owner.display_name || playlist.owner.id,
                    tracks: [],
                    trackCount: playlist.tracks.total,
                    createdAt: new Date(),
                    isSpotifyPlaylist: true,
                }));

                // Merge with local playlists
                setPlaylists(prev => {
                    const localPlaylists = prev.filter(p => !p.isSpotifyPlaylist);
                    return [...localPlaylists, ...spotifyPlaylists];
                });
            }
        } catch (error) {
            console.error("Error loading user playlists:", error);
        } finally {
            setLoading(false);
        }
    }, [spotifyAPI]);

    const loadPlaylistTracks = useCallback(async (playlist: Playlist) => {
        if (!playlist.isSpotifyPlaylist || !playlist.spotifyId) return;

        setLoading(true);
        try {
            const tracksData = await spotifyAPI.getPlaylistTracks(playlist.spotifyId);
            if (tracksData?.items) {
                const tracks: PlaylistTrack[] = tracksData.items
                    .filter(item => item.track && item.track.type === 'track')
                    .map(item => {
                        const track = item.track as SpotifyApi.TrackObjectFull;
                        return {
                            id: track.id,
                            title: track.name,
                            artist: track.artists.map(artist => artist.name).join(', '),
                            duration: formatDuration(track.duration_ms),
                            coverImageUrl: track.album.images[0]?.url,
                            spotifyUri: track.uri,
                            albumName: track.album.name,
                        };
                    });

                // Update the playlist with tracks
                const updatedPlaylist = { ...playlist, tracks };
                setCurrentPlaylist(updatedPlaylist);
                
                // Update in playlists array
                setPlaylists(prev => prev.map(p => 
                    p.id === playlist.id ? updatedPlaylist : p
                ));
            }
        } catch (error) {
            console.error("Error loading playlist tracks:", error);
        } finally {
            setLoading(false);
        }
    }, [spotifyAPI]);

    const createPlaylist = (name: string) => {
        const newPlaylist: Playlist = {
            id: `local_${Date.now()}`,
            name,
            tracks: [],
            createdAt: new Date(),
            isSpotifyPlaylist: false,
        };
        setPlaylists(prev => [...prev, newPlaylist]);
        setCurrentPlaylist(newPlaylist);
    };

    const createSpotifyPlaylist = useCallback(async (name: string, description: string = "") => {
        if (!spotifyAPI.loggedIn) return;

        setLoading(true);
        try {
            const newPlaylist = await spotifyAPI.createUserPlaylist(name, description);
            if (newPlaylist) {
                // Reload playlists to include the new one
                await loadUserPlaylists();
            }
        } catch (error) {
            console.error("Error creating Spotify playlist:", error);
        } finally {
            setLoading(false);
        }
    }, [spotifyAPI, loadUserPlaylists]);

    const deletePlaylist = (playlistId: string) => {
        const playlist = playlists.find(p => p.id === playlistId);
        
        // Only allow deletion of local playlists
        if (playlist?.isSpotifyPlaylist) {
            alert("Cannot delete Spotify playlists. You can only remove individual songs from them.");
            return;
        }

        // Delete local playlist
        setPlaylists(prev => prev.filter(p => p.id !== playlistId));
        if (currentPlaylist?.id === playlistId) {
            setCurrentPlaylist(null);
        }
    };

    const addTrackToPlaylist = async (playlistId: string, track: PlaylistTrack) => {
        const playlist = playlists.find(p => p.id === playlistId);
        
        if (playlist?.isSpotifyPlaylist && playlist.spotifyId && track.spotifyUri) {
            // Add to Spotify playlist
            const success = await spotifyAPI.addTracksToPlaylist(playlist.spotifyId, [track.spotifyUri]);
            if (success) {
                // Update local state
                setPlaylists(prev => prev.map(p => {
                    if (p.id === playlistId) {
                        const updatedTracks = p.tracks.filter(t => t.id !== trackId);
                        const updated = { 
                            ...p, 
                            tracks: updatedTracks,
                            trackCount: p.isSpotifyPlaylist ? Math.max(0, (p.trackCount || p.tracks.length) - 1) : updatedTracks.length
                        };
                        if (currentPlaylist?.id === playlistId) {
                            setCurrentPlaylist(updated);
                        }
                        return updated;
                    }
                    return p;
                }));
            }
        } else {
            // Add to local playlist
            setPlaylists(prev => prev.map(playlist => {
                if (playlist.id === playlistId) {
                    const trackExists = playlist.tracks.some(t => t.id === track.id);
                    if (!trackExists) {
                        const updated = { ...playlist, tracks: [...playlist.tracks, track] };
                        if (currentPlaylist?.id === playlistId) {
                            setCurrentPlaylist(updated);
                        }
                        return updated;
                    }
                }
                return playlist;
            }));
        }
    };

    const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
        const playlist = playlists.find(p => p.id === playlistId);
        const track = playlist?.tracks.find(t => t.id === trackId);
        
        if (playlist?.isSpotifyPlaylist && playlist.spotifyId && track?.spotifyUri) {
            // Remove from Spotify playlist
            setLoading(true);
            try {
                const success = await spotifyAPI.removeTracksFromPlaylist(playlist.spotifyId, [track.spotifyUri]);
                if (success) {
                    // Update local state
                    setPlaylists(prev => prev.map(p => {
                        if (p.id === playlistId) {
                            const updated = { ...p, tracks: p.tracks.filter(t => t.id !== trackId) };
                            if (currentPlaylist?.id === playlistId) {
                                setCurrentPlaylist(updated);
                            }
                            return updated;
                        }
                        return p;
                    }));
                } else {
                    alert("Failed to remove track from Spotify playlist. You might not have permission to modify this playlist.");
                }
            } catch (error) {
                console.error("Error removing track from Spotify playlist:", error);
                alert("An error occurred while removing the track.");
            } finally {
                setLoading(false);
            }
        } else {
            // Remove from local playlist
            setPlaylists(prev => prev.map(p => {
                if (p.id === playlistId) {
                    const updatedTracks = p.tracks.filter(t => t.id !== trackId);
                    const updated = { 
                        ...p, 
                        tracks: updatedTracks,
                        trackCount: updatedTracks.length
                    };
                    if (currentPlaylist?.id === playlistId) {
                        setCurrentPlaylist(updated);
                    }
                    return updated;
                }
                return p;
            }));
        }
    };

    const handleSetCurrentPlaylist = async (playlist: Playlist | null) => {
        if (playlist) {
            setCurrentPlaylist(playlist);
            // Load tracks if it's a Spotify playlist and tracks aren't loaded
            if (playlist.isSpotifyPlaylist && playlist.tracks.length === 0) {
                await loadPlaylistTracks(playlist);
            }
        } else {
            setCurrentPlaylist(null);
        }
    };

    const data: PlaylistContextType = {
        playlists,
        currentPlaylist,
        loading,
        createPlaylist,
        createSpotifyPlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        setCurrentPlaylist: handleSetCurrentPlaylist,
        loadUserPlaylists,
        loadPlaylistTracks,
    };

    return (
        <PlaylistContext.Provider value={data}>
            {children}
        </PlaylistContext.Provider>
    );
};
