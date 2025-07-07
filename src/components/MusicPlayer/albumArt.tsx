import { type FC, type Ref } from "react";
import { Box } from "@mui/material";

interface AlbumArtProps {
  art: string;
  size: number;
  ref?: Ref<HTMLImageElement>;
	rounded?: number;
	sx?: object;
	id?: number;
}

export const AlbumArt: FC<AlbumArtProps> = ({ art, size, ref, rounded, sx, id }) => {
  return (
    <Box
      sx={sx}
    >
      <img
        ref={ref}
        id={`queue_image_${id}`}
        src={art}
        style={{ width: size, height: size, borderRadius: rounded }}
      />
    </Box>
  );
};
