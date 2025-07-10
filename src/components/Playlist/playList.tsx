import React, { useState, useEffect } from 'react';
import PlaylistItem from './playListItem';
import { usePlaylistContext } from '../../contexts/PlaylistContext/PlaylistContext';
import { useSpotifyAPIContext } from '../../contexts/SpotifyAPIContext/SpotifyAPIContext';

const Playlist: React.FC = () => {
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [createOnSpotify, setCreateOnSpotify] = useState<boolean>(true);
  
  const playlistContext = usePlaylistContext();
  const spotifyAPI = useSpotifyAPIContext();

  // Load user playlists when logged in
  useEffect(() => {
    if (spotifyAPI.loggedIn) {
      playlistContext.loadUserPlaylists();
    }
  }, [spotifyAPI.loggedIn]);

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim()) {
      if (createOnSpotify && spotifyAPI.loggedIn) {
        await playlistContext.createSpotifyPlaylist(newPlaylistName.trim());
      } else {
        playlistContext.createPlaylist(newPlaylistName.trim());
      }
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const handleDeleteTrack = (trackId: string) => {
    if (playlistContext.currentPlaylist) {
      playlistContext.removeTrackFromPlaylist(playlistContext.currentPlaylist.id, trackId);
    }
  };

  const handleDeletePlaylist = (playlistId: string) => {
    playlistContext.deletePlaylist(playlistId);
  };

  return (
    <div style={{ padding: '20px', overflow: "hidden" }}>
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>My Playlists</h2>
          {playlistContext.loading && (
            <span style={{ color: '#666', fontSize: '14px' }}>Loading...</span>
          )}
        </div>
        
        {/* Create New Playlist */}
        <div style={{ marginBottom: '20px' }}>
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#1db954',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              + Create New Playlist
            </button>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '10px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist name"
                style={{ 
                  padding: '8px 12px', 
                  fontSize: '14px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  outline: 'none'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                autoFocus
              />
              
              {spotifyAPI.loggedIn && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={createOnSpotify}
                    onChange={(e) => setCreateOnSpotify(e.target.checked)}
                  />
                  Create on Spotify (sync across devices)
                </label>
              )}
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim() || playlistContext.loading}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: newPlaylistName.trim() && !playlistContext.loading ? '#1db954' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: newPlaylistName.trim() && !playlistContext.loading ? 'pointer' : 'not-allowed',
                    fontSize: '14px'
                  }}
                >
                  {playlistContext.loading ? 'Creating...' : 'Create'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewPlaylistName('');
                  }}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Playlist List */}
        {playlistContext.playlists.length > 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ 
              padding: '12px 16px', 
              borderBottom: '1px solid #e0e0e0',
              fontSize: '14px', 
              color: '#666',
              fontWeight: 'bold'
            }}>
              {playlistContext.playlists.length} playlist{playlistContext.playlists.length !== 1 ? 's' : ''}
            </div>
            {playlistContext.playlists.map((playlist) => (
              <div
                key={playlist.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: playlist.id === playlistContext.playlists[playlistContext.playlists.length - 1].id ? 'none' : '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  backgroundColor: playlistContext.currentPlaylist?.id === playlist.id ? '#e8f5e8' : 'transparent',
                  borderLeft: playlistContext.currentPlaylist?.id === playlist.id ? '4px solid #1db954' : '4px solid transparent'
                }}
                onClick={() => {
                  if (playlistContext.currentPlaylist?.id === playlist.id) {
                    playlistContext.setCurrentPlaylist(null);
                  } else {
                    playlistContext.setCurrentPlaylist(playlist);
                  }
                }}
                onMouseEnter={(e) => {
                  if (playlistContext.currentPlaylist?.id !== playlist.id) {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (playlistContext.currentPlaylist?.id !== playlist.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {/* Playlist Icon */}
                <div style={{ 
                  marginRight: '15px', 
                  flexShrink: 0,
                  width: '40px',
                  height: '40px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  color: 'white',
                  transition: 'background-color 0.2s ease',
                  overflow: 'hidden'
                }}>
                  {playlist.imageUrl ? (
                    <img 
                      src={playlist.imageUrl} 
                      alt={`${playlist.name} cover`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: playlistContext.currentPlaylist?.id === playlist.id ? '#1db954' : (playlist.isSpotifyPlaylist ? '#1ed760' : '#6c757d'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px'
                    }}>
                      {playlist.isSpotifyPlaylist ? '🎧' : '🎵'}
                    </div>
                  )}
                </div>
                {/* Playlist Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontWeight: playlistContext.currentPlaylist?.id === playlist.id ? 'bold' : 'normal',
                    fontSize: '16px',
                    marginBottom: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: playlistContext.currentPlaylist?.id === playlist.id ? '#1db954' : 'inherit'
                  }}>
                    {playlist.name}
                  </div>
                  <div style={{ 
                    color: '#666', 
                    fontSize: '14px'
                  }}>
                    {playlist.isSpotifyPlaylist && playlist.tracks.length === 0 
                      ? (playlist.trackCount || 0) 
                      : playlist.tracks.length
                    } song{(playlist.isSpotifyPlaylist && playlist.tracks.length === 0 
                      ? (playlist.trackCount || 0) 
                      : playlist.tracks.length) !== 1 ? 's' : ''}
                    {playlist.isSpotifyPlaylist && playlist.owner && (
                      <span> • by {playlist.owner}</span>
                    )}
                  </div>
                </div>
                {/* Delete button - Disabled for Spotify playlists, enabled for local */}
                <div style={{ 
                  flexShrink: 0 
                }}>
                  <button 
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation(); 
                      
                      if (!playlist.isSpotifyPlaylist) {
                        const confirmed = window.confirm(`Are you sure you want to delete "${playlist.name}"?`);
                        if (confirmed) {
                          handleDeletePlaylist(playlist.id);
                        }
                      }
                    }}
                    disabled={playlist.isSpotifyPlaylist}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: playlist.isSpotifyPlaylist ? '#6c757d' : '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: playlist.isSpotifyPlaylist ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'background-color 0.2s ease',
                      opacity: playlist.isSpotifyPlaylist ? 0.6 : 1
                    }}
                    title={playlist.isSpotifyPlaylist ? "Cannot delete Spotify playlists" : "Delete playlist"}
                    onMouseEnter={(e) => {
                      if (!playlist.isSpotifyPlaylist) {
                        e.currentTarget.style.backgroundColor = '#c82333';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!playlist.isSpotifyPlaylist) {
                        e.currentTarget.style.backgroundColor = '#dc3545';
                      }
                    }}
                  >
                    {playlist.isSpotifyPlaylist ? 'Spotify' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '2px dashed #dee2e6'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>No playlists yet</div>
            <div style={{ fontSize: '14px' }}>Create your first playlist to get started!</div>
          </div>
        )}
      </div>

      {/* Current Playlist Display - Only show when a playlist is selected */}
      {playlistContext.currentPlaylist && (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '15px',
            paddingBottom: '10px',
            borderBottom: '2px solid #e0e0e0'
          }}>
            <h3 style={{ margin: 0 }}>
              {playlistContext.currentPlaylist.name} 
              <span style={{ color: '#666', fontSize: '14px', fontWeight: 'normal' }}>
                ({playlistContext.currentPlaylist.tracks.length} tracks)
              </span>
              {playlistContext.currentPlaylist.isSpotifyPlaylist && (
                <span style={{ 
                  marginLeft: '10px',
                  padding: '2px 6px',
                  backgroundColor: '#1ed760',
                  color: 'white',
                  fontSize: '12px',
                  borderRadius: '12px'
                }}>
                  Spotify
                </span>
              )}
            </h3>
          </div>

          {playlistContext.loading ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              padding: '40px'
            }}>
              Loading tracks...
            </div>
          ) : playlistContext.currentPlaylist.tracks.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              padding: '40px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '2px dashed #dee2e6'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎵</div>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>This playlist is empty</div>
              <div style={{ fontSize: '14px' }}>Search for songs above to add them to this playlist!</div>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #e0e0e0'
            }}>
              {/* Song count and scroll indicator */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                fontSize: '14px',
                color: '#666',
                borderBottom: '1px solid #e0e0e0',
                paddingBottom: '8px'
              }}>
                <span>{playlistContext.currentPlaylist.tracks.length} song{playlistContext.currentPlaylist.tracks.length !== 1 ? 's' : ''}</span>
                {playlistContext.currentPlaylist.tracks.length > 5 && (
                  <span style={{ fontSize: '12px' }}>Scroll to see more</span>
                )}
              </div>
              
              {/* Scrollable songs container */}
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                overflowX: 'hidden',
                border: '1px solid #f0f0f0',
                borderRadius: '6px',
                padding: '8px',
                backgroundColor: '#fafafa'
              }}>
                {playlistContext.currentPlaylist.tracks.map((track) => (
                  <PlaylistItem
                    key={track.id}
                    title={track.title}
                    artist={track.artist}
                    duration={track.duration}
                    coverImageUrl={track.coverImageUrl}
                    albumName={track.albumName}
                    onDelete={() => handleDeleteTrack(track.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Playlist;
