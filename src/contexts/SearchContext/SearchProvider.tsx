import React, { useState, useCallback } from 'react';
import { SearchContext } from './SearchContext';
import { type SearchContextType, type SearchResults } from './SearchType';
import { useSpotifyAPIContext } from '../SpotifyAPIContext/SpotifyAPIContext';

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResults>({ tracks: [] });
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState<boolean>(false);
  
  const spotifyAPI = useSpotifyAPIContext();

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim() || !spotifyAPI.loggedIn) return;
    
    setIsSearching(true);
    try {
      const searchResults = await spotifyAPI.searchTracks(query, 20);
      if (searchResults?.tracks?.items) {
        setSearchResults({
          tracks: searchResults.tracks.items,
          // Can add artists, albums, playlists later
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ tracks: [] });
    } finally {
      setIsSearching(false);
    }
  }, [spotifyAPI]);

  const openSearchPopup = useCallback(() => {
    setIsSearchPopupOpen(true);
  }, []);

  const closeSearchPopup = useCallback(() => {
    setIsSearchPopupOpen(false);
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults({ tracks: [] });
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults({ tracks: [] });
    setIsSearchPopupOpen(false);
  }, []);

  const contextValue: SearchContextType = {
    searchQuery,
    searchResults,
    isSearching,
    isSearchPopupOpen,
    setSearchQuery,
    performSearch,
    openSearchPopup,
    closeSearchPopup,
    clearResults,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};
