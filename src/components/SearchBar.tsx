import React, { useState } from 'react';
import { Box, TextField, IconButton, InputAdornment } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useSearchContext } from '../contexts/SearchContext/SearchContext';
import { useSpotifyAPIContext } from '../contexts/SpotifyAPIContext/SpotifyAPIContext';

const SearchBar: React.FC = () => {
  const [localQuery, setLocalQuery] = useState<string>('');
  const { setSearchQuery, performSearch, openSearchPopup, clearSearch } = useSearchContext();
  const spotifyAPI = useSpotifyAPIContext();

  const handleSearch = async () => {
    if (!localQuery.trim()) return;
    
    if (!spotifyAPI.loggedIn) {
      alert('Please log in to Spotify to search for music');
      return;
    }
    
    setSearchQuery(localQuery);
    await performSearch(localQuery);
    openSearchPopup();
		console.log("SERA");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    clearSearch();
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      minWidth: '300px',
      maxWidth: '500px',
      width: '100%'
    }}>
      <TextField
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search for songs, artists, albums..."
        variant="outlined"
        size="small"
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '25px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1db954',
            },
          },
          '& .MuiInputBase-input': {
            color: 'white',
            '&::placeholder': {
              color: 'rgba(255, 255, 255, 0.7)',
              opacity: 1,
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                onClick={handleSearch}
                disabled={!localQuery.trim() || !spotifyAPI.loggedIn}
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    color: '#1db954',
                  },
                  '&.Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                <Search />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: localQuery && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
