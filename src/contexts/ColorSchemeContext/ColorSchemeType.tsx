import { type RefObject } from "react";

export type ColorSchemeContextType = {
  textColor: string;
  backgroundColor: string;
  hoverColor: string;
  gradientColorA: string;
  gradientColorB: string;
  playBarForegroundColor: string;
  playBarBackgroundColor: string;
  setColorScheme: React.Dispatch<React.SetStateAction<ColorSchemeContextType>>;
  artRef: RefObject<HTMLImageElement | null>;
};
