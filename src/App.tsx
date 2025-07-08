import "./App.css";
import { type FC, useState, useRef, useEffect } from "react";
import Playlist from "./components/playList";
import SpotifyTest from "./components/spotifyTest";
import MusicSearch from "./components/MusicSearch";

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
      paddingBottom: '50px' // Add some bottom padding for scrolling
    }}>
      <ColorSchemeProvider>
        <SpotifyAPIProvider>
          <PlaylistProvider>
            <PlayerProvider>
              {/* Search and Playlist components moved to top */}
              <Box sx={{ display: "none", marginBottom: "20px" }}>
                <MusicSearch />
                <Playlist />
              </Box>
              
              {/* Music Player moved below */}
              <Box sx={{ display: "block" }}>
                <MusicPlayer
                  size={size}
                  selectedArt={selectedArt}
                  setSelectedArt={setSelectedArt}
                  rotation={rotation}
                  setRotation={setRotation}
                />
              </Box>
            </PlayerProvider>
          </PlaylistProvider>
          <Box sx={{ display: "none" }}>
            <SpotifyTest />
          </Box>
        </SpotifyAPIProvider>
      </ColorSchemeProvider>
    </main>
  );
};
export default App;
