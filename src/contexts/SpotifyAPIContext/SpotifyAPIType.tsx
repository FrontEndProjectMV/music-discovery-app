export type SpotifyAPIContextType = {
	loggedIn: boolean;
	login: () => void;
	logout: () => void;
	userData: {
		profile: SpotifyApi.CurrentUsersProfileResponse,
		playbackstate: SpotifyApi.CurrentPlaybackResponse,
		queue: SpotifyApi.UsersQueueResponse,
	};
	loading: boolean;
	getUserProfile: () => void;
	getPlaybackState: () => void;
	skipToNext: () => Promise<object>;
	skipToPrevious: () => Promise<object>;
	getRecentlyPlayed: () => void;
	getQueue: () => Promise<object>;
	searchTracks: (query: string, limit?: number) => Promise<SpotifyApi.TrackSearchResponse | null>;
	play: () => Promise<boolean>;
	pause: () => Promise<boolean>;
	getUserPlaylists: () => Promise<SpotifyApi.ListOfCurrentUsersPlaylistsResponse | null>;
    getPlaylistTracks: (playlistId: string) => Promise<SpotifyApi.PlaylistTrackResponse | null>;
    addTracksToPlaylist: (playlistId: string, trackUris: string[]) => Promise<boolean>;
    removeTracksFromPlaylist: (playlistId: string, trackUris: string[]) => Promise<boolean>;
    createUserPlaylist: (name: string, description?: string) => Promise<SpotifyApi.CreatePlaylistResponse | null>;
	deleteUserPlaylist: (playlistId: string) => Promise<boolean>;
}
