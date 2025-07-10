import "./Popup.css";
import { type FC, type PropsWithChildren } from "react";

// Material components / icons
import { Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface PopupProps {
  fullScreen: boolean;
	setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Popup: FC<PropsWithChildren<PopupProps>> = ({
  fullScreen,
  children,
	setPopupOpen,
}) => {
  const classes = ["popup", fullScreen ? "full" : ""].join(" ");

  return (
    <Box id={"popup_container"}>
      <Box id={"popup_navbar"}>
        <IconButton sx={{ alignSelf: "flex-end" }} onClick={() => {
					setPopupOpen(prev => !prev);
				}}>
          <Close sx={{ color: "white" }} />
        </IconButton>
      </Box>
      <Box id={"popup"} className={classes} sx={{ overflow: "hidden" }}>
        {children}
      </Box>
    </Box>
  );
};
