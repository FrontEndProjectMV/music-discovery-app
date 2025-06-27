import { useState, type ReactNode } from "react";
import { PlayerContext } from "./playerContext";
import { type PlayerContextType } from "./playerType";

// import all the album art for now
// this will need to be changed from string to Song
import art1 from "../../assets/albumArt/art1.png";
import art2 from "../../assets/albumArt/art2.png";
import art3 from "../../assets/albumArt/art3.png";
import art4 from "../../assets/albumArt/art4.png";
import art5 from "../../assets/albumArt/art5.png";
import art6 from "../../assets/albumArt/art6.png";
import art7 from "../../assets/albumArt/art7.png";
import art8 from "../../assets/albumArt/art8.png";

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
	const [history, setHistory] = useState<string[]>([
		art1, art2, art3, art4, art5, art6, art7, art8,
		art1, art2, art3, art4, art5, art6, art7, art8
	]);
	const [queue, setQueue] = useState<string[]>([
		art1, art2, art3, art4, art5, art6, art7, art8,
		art1, art2, art3, art4, art5, art6, art7, art8
	]);

	const addToQueue = (track: string) => {
		setQueue([...queue, track]);
	}
	
	const addToHistory = (track: string) => {
		setHistory([...history, track]);
	}

	const [trackPosition, setTrackPosition] = useState<number>(0.90);

	const data: PlayerContextType = {
		queue,
		addToQueue,
		history,
		addToHistory,
		trackPosition,
		setTrackPosition
	}

	const incrementer = window.setInterval(()=>{
		setTrackPosition(trackPosition + 0.01);
		if (trackPosition >= 1.0) {
			setTrackPosition(1.0);
			window.clearInterval(incrementer);
		}
	}, 1000);

	return <PlayerContext.Provider value={data}>{children}</PlayerContext.Provider>;
};

