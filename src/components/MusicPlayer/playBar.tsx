import { type FC, useEffect, useState, useContext, useRef } from "react";

import { Box } from "@mui/material";

import { useColorSchemeContext } from "../../contexts/ColorSchemeContext/ColorSchemeContext";
import { usePlayerContext } from "../../contexts/PlayerContext/playerContext";

interface PlayBarProps {
  size: number;
  thickness: number;
}

export const PlayBar: FC<PlayBarProps> = ({ size, thickness }) => {
  const [isResizing, setIsResizing] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const colorScheme = useColorSchemeContext();
  const playerData = usePlayerContext();

  let resizeTimeout: number;
  window.addEventListener("resize", () => {
    // restart the timer
    clearTimeout(resizeTimeout);

    setIsResizing(true);

    resizeTimeout = setTimeout(() => {
      setIsResizing(false);
    }, 100); // reset every 100ms
  });

  useEffect(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    const svgElement = svgRef.current!;
    if (svgElement) {
      svgElement.style.setProperty("--fgcolor", colorScheme.playBarForegroundColor);
      svgElement.style.setProperty("--bgcolor", colorScheme.playBarBackgroundColor);
    }
    setIsResizing(false);
  }, [colorScheme.gradientColorA, colorScheme.gradientColorB]);

  useEffect(() => {
    const svgElement = svgRef.current!;
    if (svgElement) {
      const progressPercentage = playerData.currentTrack?.duration_ms 
        ? (playerData.trackPosition / playerData.currentTrack.duration_ms) * 100
        : 0;
      
      svgElement.style.setProperty(
        "--progress",
        `${Math.min(progressPercentage * 0.75, 75)}`,
      );
    }
  }, [playerData.trackPosition]);

  useEffect(() => {
    const svgElement = svgRef.current!;
    if (svgElement) {
      svgElement.style.setProperty("--size", `${size}px`);
      svgElement.style.setProperty(
        "--animation-speed",
        isResizing ? "0s" : "1s",
      );
      svgElement.style.setProperty("--stroke-width", `${thickness}px`);
    }
  }, [isResizing, size, thickness]);

  return (
    <Box height={size} width={size}>
      <svg
        height={size}
        width={size}
        className={"playbar-progress"}
        ref={svgRef}
      >
        <circle className={"bg"} shape-rendering="geometricPrecision"></circle>
        <circle className={"fg"} shape-rendering="geometricPrecision"></circle>
      </svg>
    </Box>
  );
};
