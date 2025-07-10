import { type FC } from "react";
import SpotifyTest from "./spotifyTest";

import { IconButton, Box } from "@mui/material";
import { PlaylistAdd } from "@mui/icons-material";

import { useColorSchemeContext } from "../contexts/ColorSchemeContext/ColorSchemeContext";

interface NavbarProps {
	size: number;
	setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: FC<NavbarProps> = ({
	size,
	setPopupOpen,
}) => {
  const colorScheme = useColorSchemeContext();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "35px 25px",
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        backdropFilter: "blur(15px)",
        border: "none",
        borderBottom: "1px solid rgba(255, 255, 255, 0.0)",
        width: "100vw",
        maxWidth: "none",
				height: size / 4,
        boxSizing: "border-box",
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        zIndex: 10,
        margin: "0",
      }}
    >
      <IconButton
        sx={{
          backgroundColor: colorScheme.backgroundColor,
          color: "white",
        }}

				onClick={()=>{
					setPopupOpen(prev => !prev);
				}}
      >
        <PlaylistAdd
        />
      </IconButton>
      <Box sx={{ flex: 1 }}></Box>
      <SpotifyTest />
    </nav>
  );
};

export default Navbar;

