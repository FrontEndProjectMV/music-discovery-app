import { type FC } from "react";
import { SkipPrevious, Pause, SkipNext } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useColorSchemeContext } from "../../contexts/ColorSchemeContext/ColorSchemeContext";
import { usePlayerContext } from "../../contexts/PlayerContext/playerContext";

// Import custom utilities here
import { findGradient } from "../../utils/GradientFinder/gradientFinder";
import { useSpotifyAPIContext } from "../../contexts/SpotifyAPIContext/SpotifyAPIContext";

interface PlayerControlsProps {
  size: number;
  selectedArt: number;
  setSelectedArt: React.Dispatch<React.SetStateAction<number>>;
	rotation: number;
	setRotation: React.Dispatch<React.SetStateAction<number>>;
}

export const PlayerControls: FC<PlayerControlsProps> = ({
  size,
  selectedArt,
  setSelectedArt,
	rotation,
	setRotation,
}) => {
  const colorScheme = useColorSchemeContext();
	const playerData = usePlayerContext();
	const spotifyAPI = useSpotifyAPIContext();

  return (
    <Box
      id="controlsBox"
      sx={{
				width: "100%",
        position: "absolute",
        left: "50%",
        top: "100%",
        transform: "translate(-50%, -100%)",
      }}
    >
      <IconButton
        aria-label="back"
        onClick={() => {
					setSelectedArt(selectedArt - 1);
					setRotation(rotation - 360 / playerData.queue.length);
					playerData.skipToPrevious();
				}}
				sx={{
					padding: `${size/10}px`,
				}}
      >
        <SkipPrevious
          width={`${size}px`}
          height={`${size}px`}
          sx={{
            color: colorScheme.textColor,
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      </IconButton>
      <IconButton
				aria-label="playpause"
				onClick={() => {
					spotifyAPI.getRecentlyPlayed();
				}}
				sx={{
					padding: `${size/10}px`,
				}}
			>
        <Pause
          width={`${size}px`}
          height={`${size}px`}
          sx={{
            color: colorScheme.textColor,
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      </IconButton>
      <IconButton
        aria-label="forward"
        onClick={async () => {
					playerData.skipToNext().then(() => {
						setSelectedArt(selectedArt + 1);
						setRotation(rotation + 360 / playerData.queue.length);
					});
				}}
				sx={{
					padding: `${size/10}px`,
				}}
      >
        <SkipNext
          width={`${size}px`}
          height={`${size}px`}
          sx={{
            color: colorScheme.textColor,
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      </IconButton>
    </Box>
  );
};
