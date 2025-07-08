import { useState, useEffect } from 'react';
import { useSpotifyAPIContext } from '../contexts/SpotifyAPIContext/SpotifyAPIContext';
import { usePlaylistContext } from '../contexts/PlaylistContext/PlaylistContext';
import { type PlaylistTrack } from '../contexts/PlaylistContext/PlaylistType';

interface SpotifyTrack {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    duration_ms: number;
    album: {
        name: string;
        images: Array<{ url: string }>;
    };
    uri: string;
}

function MusicSearch() {
    const [searchMusic, setSearchMusic] = useState<string>('');
    const [results, setResults] = useState<SpotifyTrack[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPlaylistSelector, setShowPlaylistSelector] = useState<string | null>(null);
    
    const spotifyAPI = useSpotifyAPIContext();
    const playlistContext = usePlaylistContext();

    const handleSearch = async () => {
        if (!searchMusic.trim() || !spotifyAPI.loggedIn) return;
        
        setLoading(true);
        try {
            const searchResults = await spotifyAPI.searchTracks(searchMusic, 20);
            if (searchResults?.tracks?.items) {
                setResults(searchResults.tracks.items);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Clear search results and input
    const handleClearSearch = () => {
        setSearchMusic('');
        setResults([]);
        setShowPlaylistSelector(null);
    };

    const formatDuration = (duration_ms: number): string => {
        const minutes = Math.floor(duration_ms / 60000);
        const seconds = Math.floor((duration_ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const convertToPlaylistTrack = (spotifyTrack: SpotifyTrack): PlaylistTrack => {
        return {
            id: spotifyTrack.id,
            title: spotifyTrack.name,
            artist: spotifyTrack.artists.map(artist => artist.name).join(', '),
            duration: formatDuration(spotifyTrack.duration_ms),
            coverImageUrl: spotifyTrack.album.images[0]?.url,
            spotifyUri: spotifyTrack.uri,
            albumName: spotifyTrack.album.name,
        };
    };

    const addToPlaylist = (playlistId: string, track: SpotifyTrack) => {
        const playlistTrack = convertToPlaylistTrack(track);
        playlistContext.addTrackToPlaylist(playlistId, playlistTrack);
        setShowPlaylistSelector(null);
    };

    // Search when Enter is pressed
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
        // Clear search when Escape is pressed
        if (e.key === 'Escape') {
            handleClearSearch();
        }
    };

    if (!spotifyAPI.loggedIn) {
        return (
            <div>
                <p>Please log in to Spotify to search for music.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={searchMusic}
                    onChange={e => setSearchMusic(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search for songs, artists, or albums... (Press Escape to clear)"
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        width: '300px',
                        marginRight: '10px'
                    }}
                />
                <button 
                    onClick={handleSearch}
                    disabled={loading || !searchMusic.trim()}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginRight: '10px'
                    }}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
                
                {/* Clear/Cancel button - only show when there are results or search text */}
                {(results.length > 0 || searchMusic.trim()) && (
                    <button 
                        onClick={handleClearSearch}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px'
                        }}
                    >
                        Clear Search
                    </button>
                )}
            </div>

            {results.length > 0 && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3>Search Results ({results.length})</h3>
                        <button 
                            onClick={handleClearSearch}
                            style={{
                                padding: '5px 10px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px'
                            }}
                        >
                            ✕ Close Results
                        </button>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {results.map(track => (
                            <li key={track.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px',
                                border: '1px solid #ddd',
                                marginBottom: '10px',
                                borderRadius: '5px'
                            }}>
                                {track.album.images[0] && (
                                    <img
                                        src={track.album.images[0].url}
                                        alt={`${track.name} cover`}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            marginRight: '15px',
                                            borderRadius: '5px'
                                        }}
                                    />
                                )}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold' }}>{track.name}</div>
                                    <div style={{ color: '#666' }}>
                                        {track.artists.map(artist => artist.name).join(', ')}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#999' }}>
                                        {track.album.name} • {formatDuration(track.duration_ms)}
                                    </div>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setShowPlaylistSelector(
                                            showPlaylistSelector === track.id ? null : track.id
                                        )}
                                        style={{
                                            padding: '5px 10px',
                                            cursor: 'pointer',
                                            backgroundColor: '#1db954',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '3px'
                                        }}
                                    >
                                        Add to Playlist
                                    </button>
                                    
                                    {showPlaylistSelector === track.id && (
                                        <div style={{
                                            position: 'absolute',
                                            backgroundColor: 'white',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            padding: '10px',
                                            marginTop: '5px',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                            zIndex: 1000,
                                            right: 0,
                                            minWidth: '200px'
                                        }}>
                                            <div style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '12px' }}>
                                                Select Playlist:
                                            </div>
                                            {playlistContext.playlists.length === 0 ? (
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    No playlists available. Create one first!
                                                </div>
                                            ) : (
                                                <>
                                                    {playlistContext.playlists.map(playlist => (
                                                        <button
                                                            key={playlist.id}
                                                            onClick={() => addToPlaylist(playlist.id, track)}
                                                            style={{
                                                                display: 'block',
                                                                width: '100%',
                                                                padding: '5px',
                                                                margin: '2px 0',
                                                                cursor: 'pointer',
                                                                border: '1px solid #ddd',
                                                                backgroundColor: 'white',
                                                                borderRadius: '2px',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            {playlist.name}
                                                        </button>
                                                    ))}
                                                    <button
                                                        onClick={() => setShowPlaylistSelector(null)}
                                                        style={{
                                                            display: 'block',
                                                            width: '100%',
                                                            padding: '5px',
                                                            margin: '5px 0 0 0',
                                                            cursor: 'pointer',
                                                            border: '1px solid #ccc',
                                                            backgroundColor: '#f8f9fa',
                                                            borderRadius: '2px',
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default MusicSearch;
