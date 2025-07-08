import { type FC, type Ref } from "react";

import { Box } from "@mui/material";

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
  selectedArt: number;
  setSelectedArt: React.Dispatch<React.SetStateAction<number>>;
  selectedArtRef: Ref<HTMLImageElement>;
  rotation: number;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
}

export const MusicPlayer: FC<MusicPlayerProps> = ({
  size,
  selectedArt,
  setSelectedArt,
  rotation,
  setRotation,
}) => {
	const spotifyAPI = useSpotifyAPIContext();
	const colorScheme = useColorSchemeContext();

  return (
    <Box
      width={size * 1.75}
      height={size * 1.75}
      sx={{
        position: "relative",
      }}
    >
      <PlayBar size={size * 1.75} thickness={size * 0.04} />
      <AlbumArt
				art={(()=>{
					if (spotifyAPI.loggedIn && spotifyAPI.userData.playbackstate) {
						return spotifyAPI.userData.playbackstate.item!.album.images[0].url;
					}

					return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-UngPlgyxNcUaiLzpeo20_f9K1PuCbrQK4w&s";
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
					zIndex: 1000000,
        }}
      />
      <QueueRing size={size} rotation={rotation} selectedArt={selectedArt}/>
      <PlayerControls
        size={size * 0.18}
        selectedArt={selectedArt}
        setSelectedArt={setSelectedArt}
        rotation={rotation}
        setRotation={setRotation}
      />
    </Box>
  );
};
