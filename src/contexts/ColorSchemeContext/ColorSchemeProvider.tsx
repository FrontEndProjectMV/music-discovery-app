import { useState, useRef, useEffect, type ReactNode } from "react";

import { ColorSchemeContext } from "./ColorSchemeContext";
import { type ColorSchemeContextType } from "./ColorSchemeType";

// Import custom utilities here
import { findColorScheme } from "../../utils/GradientFinder/gradientFinder";
import { useSpotifyAPIContext } from "../SpotifyAPIContext/SpotifyAPIContext";

export const ColorSchemeProvider = ({ children }: { children: ReactNode }) => {
	const spotifyAPI = useSpotifyAPIContext();
  const artRef = useRef<HTMLImageElement | null>(null);
  const [colorScheme, setColorScheme] = useState<ColorSchemeContextType>({
    textColor: "white",
    backgroundColor: "black",
    hoverColor: "brown",
    gradientColorA: "#025252",
    gradientColorB: "#296969",
		playBarForegroundColor: "rgba(0, 0, 0, 0)",
		playBarBackgroundColor: "rgba(0, 0, 0, 0)",
    setColorScheme: () => {},
		artRef,
  });

  const data: ColorSchemeContextType = {
    textColor: colorScheme.textColor,
    backgroundColor: colorScheme.backgroundColor,
    hoverColor: colorScheme.hoverColor,
    gradientColorA: colorScheme.gradientColorA,
    gradientColorB: colorScheme.gradientColorB,
		playBarForegroundColor: colorScheme.playBarForegroundColor,
		playBarBackgroundColor: colorScheme.playBarBackgroundColor,
    setColorScheme: setColorScheme,
    artRef: artRef,
  };

	useEffect(() => {
		if (!spotifyAPI.loading && artRef.current) {
			artRef.current.onload = () => {
				console.log("art loaded");
				const UIColors = findColorScheme(artRef.current!);
				setColorScheme({...colorScheme, ...UIColors});
			}
		}
	}, [spotifyAPI.loading, artRef]);

	useEffect(() => {
    document.body.style.background = `linear-gradient(${colorScheme.gradientColorA}, ${colorScheme.gradientColorB})`;
	}, [colorScheme]);

  return (
    <ColorSchemeContext.Provider value={data}>
      {children}
    </ColorSchemeContext.Provider>
  );
};
