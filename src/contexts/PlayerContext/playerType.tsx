export type PlayerContextType = {
	queue: string[];
	addToQueue: (track: string) => void;
	history: string[];
	addToHistory: (track: string) => void;
	trackPosition: number;
	setTrackPosition: React.Dispatch<React.SetStateAction<number>>;
}
