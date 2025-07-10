import { type FC } from "react";
import SpotifyTest from "./spotifyTest";
import SearchBar from "./SearchBar";

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
        justifyContent: "space-between",
        alignItems: "center",
        padding: "50px 25px",
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
      {/* Left side - Playlist button */}
      <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-start" }}>
        <IconButton
          sx={{
						backgroundColor: "rgba(0,0,0,0)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            color: "white",
            width: "50px",
            height: "50px",
          }}
          onClick={()=>{
            setPopupOpen(prev => !prev);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colorScheme.hoverColor;
            e.currentTarget.style.border = "2px solid rgba(255, 255, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0,0,0,0)";
          }}
        >
          <PlaylistAdd />
        </IconButton>
      </Box>

      {/* Center - Search bar */}
      <Box sx={{ display: "flex", flex: 1, justifyContent: "center" }}>
        <SearchBar />
      </Box>

      {/* Right side - Spotify login */}
      <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
        <SpotifyTest />
      </Box>
    </nav>
  );
};

export default Navbar;

