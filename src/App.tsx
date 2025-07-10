import "./App.css";
import { type FC, useState } from "react";

// Import MUI components here
import { Box } from "@mui/material";

// Import custom components here
import { MusicPlayer } from "./components/MusicPlayer/musicPlayer";
import { Popup } from "./components/Popup/Popup";
import Playlist from "./components/Playlist/playList";
import Navbar from "./components/Navbar";
import SearchResultsPopup from "./components/SearchResultsPopup";

// Import custom contexts / providers here
import { PlayerProvider } from "./contexts/PlayerContext/playerProvider";
import { ColorSchemeProvider } from "./contexts/ColorSchemeContext/ColorSchemeProvider";
import { SpotifyAPIProvider } from "./contexts/SpotifyAPIContext/SpotifyAPIProvider";
import { PlaylistProvider } from "./contexts/PlaylistContext/PlaylistProvider";
import { SearchProvider } from "./contexts/SearchContext/SearchProvider";

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
          <SearchProvider>
            <PlaylistProvider>
              <PlayerProvider>
                <Navbar size={size} setPopupOpen={setPopupOpen} />
                <SearchResultsPopup />
                {popupOpen ? (
                  <Popup fullScreen={false} setPopupOpen={setPopupOpen}>
                    <Box
                      sx={{
                        display: "block",
                        marginBottom: "20px",
                      }}
                    >
                      <Playlist />
                    </Box>
                  </Popup>
                ) : (
                  ""
                )}
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                  paddingTop: "15px",
                  minHeight: "calc(100vh - 180px)"
                }}>
                  <MusicPlayer size={size} />
                </Box>
              </PlayerProvider>
            </PlaylistProvider>
          </SearchProvider>
        </SpotifyAPIProvider>
      </ColorSchemeProvider>
    </main>
  );
};
export default App;
