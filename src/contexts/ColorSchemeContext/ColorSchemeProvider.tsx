import { useState, type ReactNode } from "react";

import { ColorSchemeContext } from "./ColorSchemeContext";
import { type ColorSchemeContextType } from "./ColorSchemeType";

export const ColorSchemeProvider = ({ children }: { children: ReactNode }) => {
	const [colorScheme, setColorScheme] = useState<ColorSchemeContextType>({
    textColor: "white",
    backgroundColor: "black",
    hoverColor: "brown",
    gradientColorA: "pink",
    gradientColorB: "purple",
		setColorScheme: ()=>{},
	});

	const data: ColorSchemeContextType = {
    textColor: colorScheme.textColor,
    backgroundColor: colorScheme.backgroundColor,
    hoverColor: colorScheme.hoverColor,
    gradientColorA: colorScheme.gradientColorA,
    gradientColorB: colorScheme.gradientColorB,
		setColorScheme: setColorScheme,
	}

  return (
    <ColorSchemeContext.Provider value={data}>
      {children}
    </ColorSchemeContext.Provider>
  );
};
