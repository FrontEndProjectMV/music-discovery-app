import { type FC, useState } from "react";
import { Box } from "@mui/material";
import { AlbumArt } from "./albumArt";

import { usePlayerContext } from "../../contexts/PlayerContext/playerContext";

interface QueueRingProps {
  size: number;
  rotation: number;
  selectedArt: number;
}

export const QueueRing: FC<QueueRingProps> = ({
  size,
  rotation,
  selectedArt,
}) => {
  const [isResizing, setIsResizing] = useState(false);
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

  return (
    <Box
      id="circleSelectionBar"
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        transformOrigin: "center",
        transitionDuration: "1s",
      }}
    >
      {(() => {
        const components = [];
        const radius = size * 1.35;
        for (let i = 0; i < playerData.queue.length; i++) {
          const radians = (-(360 / playerData.queue.length) * i * Math.PI) / 180;
          const x = (size * 1.75) / 2 + radius * Math.cos(radians);
          const y = (size * 1.75) / 2 + radius * Math.sin(radians);
          components.push(
            <AlbumArt
              art={playerData.queue[i]}
              size={size / 2}
              sx={{
                height: "fit-content",
                position: "absolute",
                //left: selectedArt !== i ? `${x}px` : `${(size * 1.75) / 2}px`,
                //top: selectedArt !== i ? `${y}px` : `${(size * 1.75) / 2}px`,
                left: `${x}px`,
                top: `${y}px`,
                transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
                transitionDuration:
                  isResizing ? "0s" : "1s",
              }}
            />,
          );
        }
        return components;
      })()}
    </Box>
  );
};
