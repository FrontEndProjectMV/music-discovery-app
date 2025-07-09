import "./App.css";
import { type FC, useState } from "react";

// Import MUI components here
import { Box } from "@mui/material";

// Import custom components here
import { MusicPlayer } from "./components/MusicPlayer/musicPlayer";
import { Popup } from "./components/Popup/Popup";
import Playlist from "./components/Playlist/playList";
import MusicSearch from "./components/MusicSearch";
import Navbar from "./components/Navbar";

// Import custom contexts / providers here
import { PlayerProvider } from "./contexts/PlayerContext/playerProvider";
import { ColorSchemeProvider } from "./contexts/ColorSchemeContext/ColorSchemeProvider";
import { SpotifyAPIProvider } from "./contexts/SpotifyAPIContext/SpotifyAPIProvider";
import { PlaylistProvider } from "./contexts/PlaylistContext/PlaylistProvider";

const App: FC = () => {
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  // these states here WILL be changed in the future, DO NOT RELY ON THESE
  const [size, setSize] = useState(window.innerHeight / 4);

  window.addEventListener("resize", () => {
    setSize(window.innerHeight / 4);
  });

  return (
    <main
      style={{
        overflow: "visible",
        paddingBottom: "50px",
        paddingTop: "80px",
      }}
    >
      <ColorSchemeProvider>
        <SpotifyAPIProvider>
          <PlaylistProvider>
            <PlayerProvider>
              <Navbar size={size} setPopupOpen={setPopupOpen} />
              {popupOpen ? (
                <Popup fullScreen={false} setPopupOpen={setPopupOpen}>
                  <Box
                    sx={{
                      display: "block",
                      marginBottom: "20px",
                    }}
                  >
                    <MusicSearch />
                    <Playlist />
                  </Box>
                </Popup>
              ) : (
                ""
              )}
              <Box sx={{ display: "block" }}>
                <MusicPlayer size={size} />
              </Box>
            </PlayerProvider>
          </PlaylistProvider>
        </SpotifyAPIProvider>
      </ColorSchemeProvider>
    </main>
  );
};
export default App;
