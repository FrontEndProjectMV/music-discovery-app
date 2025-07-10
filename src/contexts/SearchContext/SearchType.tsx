export interface SpotifyTrack {
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

export interface SearchResults {
  tracks: SpotifyTrack[];
  artists?: any[];
  albums?: any[];
  playlists?: any[];
}

export type SearchContextType = {
  searchQuery: string;
  searchResults: SearchResults;
  isSearching: boolean;
  isSearchPopupOpen: boolean;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  openSearchPopup: () => void;
  closeSearchPopup: () => void;
  clearResults: () => void;
  clearSearch: () => void;
}
