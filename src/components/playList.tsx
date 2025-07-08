import React, { useState } from 'react';
import PlaylistItem from './playListItem';
import { usePlaylistContext } from '../contexts/PlaylistContext/PlaylistContext';

const Playlist: React.FC = () => {
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  
  const playlistContext = usePlaylistContext();

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      playlistContext.createPlaylist(newPlaylistName.trim());
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
    <div style={{ padding: '20px' }}>
      {/* Playlist Management Section */}
      <div style={{ marginBottom: '30px' }}>
        <h2>My Playlists</h2>
        
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
              gap: '10px', 
              alignItems: 'center',
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
                  flex: 1,
                  outline: 'none'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                autoFocus
              />
              <button
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim()}
                style={{
                  padding: '8px 15px',
                  backgroundColor: newPlaylistName.trim() ? '#1db954' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: newPlaylistName.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
              >
                Create
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
                onClick={() => playlistContext.setCurrentPlaylist(playlist)}
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
                  backgroundColor: playlistContext.currentPlaylist?.id === playlist.id ? '#1db954' : '#6c757d',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  color: 'white',
                  transition: 'background-color 0.2s ease'
                }}>
                  🎵
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
                    {playlist.tracks.length} song{playlist.tracks.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Delete button */}
                <div style={{ 
                  flexShrink: 0 
                }}>
                  <button 
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation(); 
                      handleDeletePlaylist(playlist.id);
                    }}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#c82333';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc3545';
                    }}
                  >
                    Delete
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
            </h3>
          </div>

          {playlistContext.currentPlaylist.tracks.length === 0 ? (
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
              <div style={{ 
                marginBottom: '12px', 
                fontSize: '14px', 
                color: '#666',
                borderBottom: '1px solid #e0e0e0',
                paddingBottom: '8px'
              }}>
                {playlistContext.currentPlaylist.tracks.length} song{playlistContext.currentPlaylist.tracks.length !== 1 ? 's' : ''}
              </div>
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
          )}
        </div>
      )}
    </div>
  );
};

export default Playlist;