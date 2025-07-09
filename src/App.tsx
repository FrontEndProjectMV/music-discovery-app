import "./App.css";
import { type FC, useState, useRef, useEffect } from "react";
import Playlist from "./components/playList";
import MusicSearch from "./components/MusicSearch";
import Navbar from "./components/Navbar";

// Import MUI components here
import { Box } from "@mui/material";

// Import custom components here
import { MusicPlayer } from "./components/MusicPlayer/musicPlayer";

// Import custom contexts / providers here
import { PlayerProvider } from "./contexts/PlayerContext/playerProvider";
import { ColorSchemeProvider } from "./contexts/ColorSchemeContext/ColorSchemeProvider";
import { SpotifyAPIProvider } from "./contexts/SpotifyAPIContext/SpotifyAPIProvider";
import { PlaylistProvider } from "./contexts/PlaylistContext/PlaylistProvider";

// Import custom utilities here
import { findGradient } from "./utils/GradientFinder/gradientFinder";

const App: FC = () => {
  // these states here WILL be changed in the future, DO NOT RELY ON THESE
  const [size, setSize] = useState(window.innerHeight / 4);
  const [selectedArt, setSelectedArt] = useState(0);
  const [rotation, setRotation] = useState(0);

  window.addEventListener("resize", () => {
    setSize(window.innerHeight / 4);
  });

  return (
    <main style={{ 
      overflow: 'visible',
      paddingBottom: '50px',
      paddingTop: '80px'
    }}>
      <ColorSchemeProvider>
        <SpotifyAPIProvider>
          <PlaylistProvider>
            <PlayerProvider>
              <Navbar />
              <Box sx={{ display: "block", marginBottom: "20px" }}>
                <MusicSearch />
                <Playlist />
              </Box>
              <Box sx={{ display: "block" }}>
                <MusicPlayer
                  size={size}
                  selectedArt={selectedArt}
                  setSelectedArt={setSelectedArt}
                />
              </Box>
            </PlayerProvider>
          </PlaylistProvider>
          <Box sx={{ display: "block" }}>
            <SpotifyTest />
          </Box>
        </SpotifyAPIProvider>
      </ColorSchemeProvider>
    </main>
  );
};
export default App;
