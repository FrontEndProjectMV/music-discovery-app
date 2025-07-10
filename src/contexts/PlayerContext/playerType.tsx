export type PlayerContextType = {
	queue: string[];
	addToQueue: (track: string) => void;
	setQueue: React.Dispatch<React.SetStateAction<string[]>>;
	history: string[];
	addToHistory: (track: string) => void;
	trackPosition: number;
	setTrackPosition: React.Dispatch<React.SetStateAction<number>>;
	skipToNext: () => Promise<boolean>;
	skipToPrevious: () => Promise<boolean>;
	bottomTrackIndex: number;
	trackDuration: number;
	setTrackDuration: React.Dispatch<React.SetStateAction<number>>;
	paused: boolean;
	play: () => Promise<boolean>;
	pause: () => Promise<boolean>;
	playTrack: (trackUri: string) => Promise<boolean>;
	playPlaylist: (trackUris: string[], startIndex?: number) => Promise<boolean>;
	rotation: number;
	setRotation: React.Dispatch<React.SetStateAction<number>>;
}
