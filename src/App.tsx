import "./App.css";
import { type FC, useState } from "react";

// Import MUI components here
import { Box } from "@mui/material";

// Import custom components here
import { MusicPlayer } from "./components/MusicPlayer/musicPlayer";
import { Popup } from "./components/Popup/Popup";
import Playlist from "./components/Playlist/playList";
import Navbar from "./components/Navbar";
import MusicSearch from "./components/MusicSearch";
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
      <SpotifyAPIProvider>
        <ColorSchemeProvider>
          <SearchProvider>
            <PlaylistProvider>
              <PlayerProvider>
                <Navbar size={size} setPopupOpen={setPopupOpen} />
								<SearchResultsPopup />
                {popupOpen ? (
                  <Popup fullScreen={false} setPopupOpen={setPopupOpen}>
                    <Box
                      sx={{
                        display: "flex",
                        marginBottom: "20px",
												height: "100%",
                      }}
                    >
                      <Playlist />
                    </Box>
                  </Popup>
                ) : (
                  ""
                )}
                <Box sx={{ display: "block", marginTop: "20%" }}>
                  <MusicPlayer size={size} />
                </Box>
              </PlayerProvider>
            </PlaylistProvider>
          </SearchProvider>
        </ColorSchemeProvider>
      </SpotifyAPIProvider>
    </main>
  );
};
export default App;
