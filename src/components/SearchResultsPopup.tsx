import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { Close, PlayArrow, Add, MoreVert } from '@mui/icons-material';
import { useSearchContext } from '../contexts/SearchContext/SearchContext';
import { usePlaylistContext } from '../contexts/PlaylistContext/PlaylistContext';
import { usePlayerContext } from '../contexts/PlayerContext/playerContext';
import { useSpotifyAPIContext } from '../contexts/SpotifyAPIContext/SpotifyAPIContext';
import { type SpotifyTrack } from '../contexts/SearchContext/SearchType';
import { type PlaylistTrack } from '../contexts/PlaylistContext/PlaylistType';

const SearchResultsPopup: React.FC = () => {
  const { searchQuery, searchResults, isSearching, isSearchPopupOpen, closeSearchPopup } = useSearchContext();
  const playlistContext = usePlaylistContext();
  const playerContext = usePlayerContext();
  const spotifyAPI = useSpotifyAPIContext();
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  // Ensure playlists are loaded when popup opens
  useEffect(() => {
    if (isSearchPopupOpen && spotifyAPI.loggedIn && playlistContext.playlists.length === 0) {
      playlistContext.loadUserPlaylists();
    }
  }, [isSearchPopupOpen, spotifyAPI.loggedIn, playlistContext]);

  const formatDuration = (duration_ms: number): string => {
    const minutes = Math.floor(duration_ms / 60000);
    const seconds = Math.floor((duration_ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = async (track: SpotifyTrack) => {
    try {
      await playerContext.playTrack(track.uri);
    } catch (error) {
      console.error('Error playing track:', error);
      alert('Error playing track. Please try again.');
    }
  };

  const handleAddToPlaylist = async (track: SpotifyTrack, playlistId: string) => {
    const playlist = playlistContext.playlists.find(p => p.id === playlistId);
    
    if (!playlist) {
      alert('Playlist not found!');
      return;
    }

    try {
      if (playlist.isSpotifyPlaylist && playlist.spotifyId) {
        // Add to Spotify playlist
        await spotifyAPI.addTracksToPlaylist(playlist.spotifyId, [track.uri]);
        alert(`Added "${track.name}" to Spotify playlist "${playlist.name}"!`);
      } else {
        // Add to local playlist
        const playlistTrack: PlaylistTrack = {
          id: track.id,
          title: track.name,
          artist: track.artists.map(artist => artist.name).join(', '),
          duration: formatDuration(track.duration_ms),
          coverImageUrl: track.album.images[0]?.url,
          albumName: track.album.name,
          spotifyUri: track.uri,
        };

        playlistContext.addTrackToPlaylist(playlistId, playlistTrack);
        alert(`Added "${track.name}" to local playlist "${playlist.name}"!`);
      }
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      alert('Error adding track to playlist. Please try again.');
    }
    
    // Close the menu
    setAnchorEl(prev => ({ ...prev, [track.id]: null }));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, trackId: string) => {
    setAnchorEl(prev => ({ ...prev, [trackId]: event.currentTarget }));
  };

  const handleMenuClose = (trackId: string) => {
    setAnchorEl(prev => ({ ...prev, [trackId]: null }));
  };

  return (
    <Dialog
      open={isSearchPopupOpen}
      onClose={closeSearchPopup}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(18, 18, 18, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
          color: 'white',
          maxHeight: '80vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        pb: 2
      }}>
        <Typography variant="h6" component="div">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Search Results'}
        </Typography>
        <IconButton onClick={closeSearchPopup} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {isSearching ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px' 
          }}>
            <CircularProgress sx={{ color: '#1db954' }} />
            <Typography sx={{ ml: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
              Searching...
            </Typography>
          </Box>
        ) : searchResults.tracks.length > 0 ? (
          <Box>
            <Typography variant="h6" sx={{ p: 2, color: '#1db954' }}>
              🎵 Tracks ({searchResults.tracks.length})
            </Typography>
            <List sx={{ pt: 0 }}>
              {searchResults.tracks.map((track) => (
                <ListItem
                  key={track.id}
                  sx={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => handlePlayTrack(track)}
                        sx={{ 
                          color: '#1db954',
                          '&:hover': {
                            backgroundColor: 'rgba(29, 185, 84, 0.1)',
                          }
                        }}
                        title="Play track"
                      >
                        <PlayArrow />
                      </IconButton>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, track.id)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        title="Add to playlist"
                      >
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl[track.id]}
                        open={Boolean(anchorEl[track.id])}
                        onClose={() => handleMenuClose(track.id)}
                        PaperProps={{
                          sx: {
                            bgcolor: 'rgba(40, 40, 40, 0.95)',
                            backdropFilter: 'blur(10px)',
                            color: 'white',
                          }
                        }}
                      >
                        {/* Local Playlists */}
                        {playlistContext.playlists
                          .filter(playlist => !playlist.isSpotifyPlaylist)
                          .map((playlist) => (
                          <MenuItem
                            key={playlist.id}
                            onClick={() => handleAddToPlaylist(track, playlist.id)}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(29, 185, 84, 0.1)',
                              }
                            }}
                          >
                            <Add sx={{ mr: 1, fontSize: '18px' }} />
                            📁 {playlist.name}
                          </MenuItem>
                        ))}
                        
                        {/* Divider if both local and Spotify playlists exist */}
                        {playlistContext.playlists.some(p => !p.isSpotifyPlaylist) && 
                         playlistContext.playlists.some(p => p.isSpotifyPlaylist) && (
                          <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                        )}
                        
                        {/* Spotify Playlists */}
                        {playlistContext.playlists
                          .filter(playlist => playlist.isSpotifyPlaylist)
                          .map((playlist) => (
                          <MenuItem
                            key={playlist.id}
                            onClick={() => handleAddToPlaylist(track, playlist.id)}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(29, 185, 84, 0.1)',
                              }
                            }}
                          >
                            <Add sx={{ mr: 1, fontSize: '18px' }} />
                            🎧 {playlist.name}
                            {playlist.owner && (
                              <Typography 
                                variant="caption" 
                                sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.5)' }}
                              >
                                by {playlist.owner}
                              </Typography>
                            )}
                          </MenuItem>
                        ))}
                        
                        {/* No playlists message */}
                        {playlistContext.playlists.length === 0 && (
                          <MenuItem disabled>
                            No playlists available
                          </MenuItem>
                        )}
                      </Menu>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={track.album.images[0]?.url}
                      alt={track.album.name}
                      sx={{ 
                        width: 50, 
                        height: 50,
                        borderRadius: '4px'
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                        {track.name}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {track.artists.map(artist => artist.name).join(', ')}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          {track.album.name} • {formatDuration(track.duration_ms)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ) : searchQuery ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px',
            textAlign: 'center',
            p: 3
          }}>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              No results found
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Try searching with different keywords
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px',
            textAlign: 'center',
            p: 3
          }}>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              Start searching for music
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Use the search bar above to find songs, artists, and albums
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchResultsPopup;
