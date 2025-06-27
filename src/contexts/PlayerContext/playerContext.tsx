import { createContext, useContext } from "react";
import { type PlayerContextType } from "./playerType";

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayerContext = () => {
	const context = useContext(PlayerContext);
	if (!context) {
		throw new Error("usePlayerContext must be used within a PlayerProvider!");
	}

	return context;
}
