import { useState, useRef, useEffect, type ReactNode } from "react";

import { ColorSchemeContext } from "./ColorSchemeContext";
import { type ColorSchemeContextType } from "./ColorSchemeType";

// Import custom utilities here
import { findColorScheme } from "../../utils/GradientFinder/gradientFinder";

export const ColorSchemeProvider = ({ children }: { children: ReactNode }) => {
  const artRef = useRef<HTMLImageElement | null>(null);
  const [colorScheme, setColorScheme] = useState<ColorSchemeContextType>({
    textColor: "white",
    backgroundColor: "black",
    hoverColor: "brown",
    gradientColorA: "blue",
    gradientColorB: "white",
		playBarForegroundColor: "white",
		playBarBackgroundColor: "black",
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
		if (artRef.current) {
			artRef.current.onload = () => {
				const UIColors = findColorScheme(artRef.current!);
				setColorScheme({...colorScheme, ...UIColors});
			}
		}
	}, [artRef]);

	useEffect(() => {
    document.body.style.background = `linear-gradient(${colorScheme.gradientColorA}, ${colorScheme.gradientColorB})`;
	}, [colorScheme]);

  return (
    <ColorSchemeContext.Provider value={data}>
      {children}
    </ColorSchemeContext.Provider>
  );
};
