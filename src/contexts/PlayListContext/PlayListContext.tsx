import { createContext, useContext } from "react";
import { type PlaylistContextType } from "./PlaylistType";

export const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const usePlaylistContext = () => {
    const context = useContext(PlaylistContext);
    if (!context) {
        throw new Error("usePlaylistContext must be used within a PlaylistProvider!");
    }

    return context;
}