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
}
