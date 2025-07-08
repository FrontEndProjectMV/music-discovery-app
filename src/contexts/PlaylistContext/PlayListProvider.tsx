import { useState, type ReactNode } from "react";
import { PlaylistContext } from "./PlaylistContext";
import { type PlaylistContextType, type Playlist, type PlaylistTrack } from "./PlaylistType";

export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

    const createPlaylist = (name: string) => {
        const newPlaylist: Playlist = {
            id: Date.now().toString(),
            name,
            tracks: [],
            createdAt: new Date(),
        };
        setPlaylists(prev => [...prev, newPlaylist]);
        setCurrentPlaylist(newPlaylist);
    };

    const deletePlaylist = (playlistId: string) => {
        setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
        if (currentPlaylist?.id === playlistId) {
            setCurrentPlaylist(null);
        }
    };

    const addTrackToPlaylist = (playlistId: string, track: PlaylistTrack) => {
        setPlaylists(prev => {
            const updated = prev.map(playlist => {
                if (playlist.id === playlistId) {
                    // Check if track already exists
                    const trackExists = playlist.tracks.some(t => t.id === track.id);
                    if (!trackExists) {
                        const updatedPlaylist = { ...playlist, tracks: [...playlist.tracks, track] };
                        // Update current playlist if it's the one being modified
                        if (currentPlaylist?.id === playlistId) {
                            setCurrentPlaylist(updatedPlaylist);
                        }
                        return updatedPlaylist;
                    }
                }
                return playlist;
            });
            return updated;
        });
    };

    const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
        setPlaylists(prev => {
            const updated = prev.map(playlist => {
                if (playlist.id === playlistId) {
                    const updatedPlaylist = { 
                        ...playlist, 
                        tracks: playlist.tracks.filter(track => track.id !== trackId) 
                    };
                    // Update current playlist if it's the one being modified
                    if (currentPlaylist?.id === playlistId) {
                        setCurrentPlaylist(updatedPlaylist);
                    }
                    return updatedPlaylist;
                }
                return playlist;
            });
            return updated;
        });
    };

    // Update the setCurrentPlaylist to find from the latest playlists state
    const handleSetCurrentPlaylist = (playlist: Playlist | null) => {
        if (playlist) {
            // Find the most up-to-date version of the playlist
            const updatedPlaylist = playlists.find(p => p.id === playlist.id);
            setCurrentPlaylist(updatedPlaylist || playlist);
        } else {
            setCurrentPlaylist(null);
        }
    };

    const data: PlaylistContextType = {
        playlists,
        currentPlaylist,
        createPlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        setCurrentPlaylist: handleSetCurrentPlaylist,
    };

    return (
        <PlaylistContext.Provider value={data}>
            {children}
        </PlaylistContext.Provider>
    );
};
