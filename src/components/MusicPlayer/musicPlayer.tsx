import { type FC, type Ref } from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

// custom components
import { PlayerControls } from "./playerControls";
import { PlayBar } from "./playBar";
import { AlbumArt } from "./albumArt";
import { QueueRing } from "./queueRing";

// contexts
import { useSpotifyAPIContext } from "../../contexts/SpotifyAPIContext/SpotifyAPIContext";
import { useColorSchemeContext } from "../../contexts/ColorSchemeContext/ColorSchemeContext";
import { usePlayerContext } from "../../contexts/PlayerContext/playerContext";

interface MusicPlayerProps {
  size: number;
}

export const MusicPlayer: FC<MusicPlayerProps> = ({ size }) => {
  const spotifyAPI = useSpotifyAPIContext();
	const playerData = usePlayerContext();
  const colorScheme = useColorSchemeContext();

	const msToTimeStr = (ms: number) => {
		const msToDate = new Date(Date.UTC(0,0,0,0,0,0,ms));
		const parts = [
			msToDate.getUTCMinutes(),
			msToDate.getUTCSeconds(),
		];

		let output = "";
		parts.forEach((part, index) => {
			output += String(part).padStart(index !== 0 ? 2 : 1, '0');
			if (index !== parts.length - 1) {
				output += ":";
			}
		});

		return output;
	}

  return !spotifyAPI.loading ? (
    <Box
      width={size * 2.0}
      height={size * 2.0}
      sx={{
        position: "relative",
      }}
    >
      <PlayBar size={size * 2.0} thickness={size * 0.04} />
			<Box>
      <AlbumArt
        art={(() => {
          if (spotifyAPI.loggedIn && spotifyAPI.userData.playbackstate) {
            return spotifyAPI.userData.playbackstate.item!.album.images[0].url;
          }
        })()}
        size={size}
        ref={colorScheme.artRef}
        rounded={size / 6}
        sx={{
          height: "fit-content",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          cornerRadius: "30px",
          zIndex: 9,
        }}
      />
			<Typography sx={{
				position: "absolute",
				width: "100%",
				top: `76%`,
				fontSize: `${size/11}px`,
				fontWeight: "bold",
			}}>
				{spotifyAPI.userData.playbackstate.item.name}
			</Typography>
			<Typography sx={{
				position: "absolute",
				width: "100%",
				top: `82%`,
				fontSize: `${size/13}px`,
			}}>
				{spotifyAPI.userData.playbackstate.item.album.artists.map(obj => obj.name).join(", ")}
			</Typography>
			<Typography sx={{
				position: "absolute",
				width: "100%",
				top: `16%`,
				fontSize: `${size/12}px`,
			}}>
				{`${msToTimeStr(playerData.trackPosition)} / ${msToTimeStr(playerData.trackDuration)}`}
			</Typography>
			</Box>
      <QueueRing size={size} />
      <PlayerControls size={size * 0.18} />
    </Box>
  ) : (
		<CircularProgress sx={{ color: colorScheme.textColor }}/>
  );
};
