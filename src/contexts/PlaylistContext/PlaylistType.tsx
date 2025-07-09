export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverImageUrl?: string;
  spotifyUri?: string;
  albumName?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: PlaylistTrack[];
  createdAt: Date;
  isSpotifyPlaylist?: boolean;
  spotifyId?: string;
  description?: string;
  owner?: string;
  trackCount?: number;
}

export type PlaylistContextType = {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  createPlaylist: (name: string) => void;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, track: PlaylistTrack) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  loadUserPlaylists: () => Promise<void>;
  loadPlaylistTracks: (playlist: Playlist) => Promise<void>;
}
