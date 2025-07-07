import { createContext, useContext } from "react";
import { type SpotifyAPIContextType } from "./SpotifyAPIType";

export const SpotifyAPIContext = createContext<SpotifyAPIContextType | undefined>(undefined);

export const useSpotifyAPIContext = () => {
	const context = useContext(SpotifyAPIContext);
	if (!context) {
		throw new Error("useSpotifyAPIContext must be used within a SpotifyAPIProvider!");
	}

	return context;
}
