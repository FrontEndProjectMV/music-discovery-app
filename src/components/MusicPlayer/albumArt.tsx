import { type FC, type Ref } from "react";
import { Box } from "@mui/material";

interface AlbumArtProps {
  art: string;
  size: number;
  ref?: Ref<HTMLImageElement>;
	rounded?: number;
	sx?: object;
}

export const AlbumArt: FC<AlbumArtProps> = ({ art, size, ref, rounded, sx }) => {
  return (
    <Box
      sx={sx}
    >
      <img
        ref={ref}
        id={art.split("/").pop()}
        src={art}
        style={{ width: size, height: size, borderRadius: rounded }}
      />
    </Box>
  );
};
