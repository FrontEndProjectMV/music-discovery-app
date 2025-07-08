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
}
