import { type FC, type Ref } from "react";

import { Box, CircularProgress } from "@mui/material";

// custom components
import { PlayerControls } from "./playerControls";
import { PlayBar } from "./playBar";
import { AlbumArt } from "./albumArt";
import { QueueRing } from "./queueRing";

// contexts
import { useSpotifyAPIContext } from "../../contexts/SpotifyAPIContext/SpotifyAPIContext";
import { useColorSchemeContext } from "../../contexts/ColorSchemeContext/ColorSchemeContext";

interface MusicPlayerProps {
  size: number;
}

export const MusicPlayer: FC<MusicPlayerProps> = ({ size }) => {
  const spotifyAPI = useSpotifyAPIContext();
  const colorScheme = useColorSchemeContext();

  return !spotifyAPI.loading ? (
    <Box
      width={size * 1.75}
      height={size * 1.75}
      sx={{
        position: "relative",
      }}
    >
      <PlayBar size={size * 1.75} thickness={size * 0.04} />
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
      <QueueRing size={size} />
      <PlayerControls size={size * 0.18} />
    </Box>
  ) : (
		<CircularProgress sx={{ color: colorScheme.textColor }}/>
  );
};
