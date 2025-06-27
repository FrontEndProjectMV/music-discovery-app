import { type FC, type Ref } from "react";

import { Box } from "@mui/material";

// custom components
import { PlayerControls } from "./playerControls";
import { PlayBar } from "./playBar";
import { AlbumArt } from "./albumArt";
import { QueueRing } from "./queueRing";

// contexts
import { usePlayerContext } from "../../contexts/PlayerContext/playerContext";

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
  selectedArtRef,
  rotation,
  setRotation,
}) => {
	const playerData = usePlayerContext();

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
        art={playerData.queue[selectedArt]}
        size={size}
        ref={selectedArtRef}
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
