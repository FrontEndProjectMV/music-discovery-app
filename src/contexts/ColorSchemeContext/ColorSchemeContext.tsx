import { createContext, useContext } from "react";
import { type ColorSchemeContextType } from "./ColorSchemeType";

export const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined);

export const useColorSchemeContext = () => {
	const context = useContext(ColorSchemeContext);
	if (!context) {
		throw new Error("useColorSchemeContext must be used within a ColorSchemeProvider!");
	}

	return context;
}
