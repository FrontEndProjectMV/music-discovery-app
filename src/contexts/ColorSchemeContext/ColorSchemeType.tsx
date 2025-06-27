export type ColorSchemeContextType = {
	textColor: string;
	backgroundColor: string;
	hoverColor: string;
	gradientColorA: string;
	gradientColorB: string;
	setColorScheme: React.Dispatch<React.SetStateAction<ColorSchemeContextType>>;
}
