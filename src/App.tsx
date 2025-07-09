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
  const [gradient, setGradient] = useState<string[] | undefined>(undefined);
  const selectedArtRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (selectedArtRef.current) {
      selectedArtRef.current.onload = () => {
        setGradient(findGradient(selectedArtRef.current!));
      };
    }
  }, [selectedArt]);

  useEffect(() => {
    if (gradient) {
      document.body.style.background = `linear-gradient(${gradient![0]}, ${gradient![1]})`;
    }
  }, [gradient]);

  window.addEventListener("resize", () => {
    setSize(window.innerHeight / 4);
  });

  return (
    <main style={{ 
      minHeight: '100vh', 
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
                  selectedArtRef={selectedArtRef}
                  rotation={rotation}
                  setRotation={setRotation}
                />
              </Box>
            </PlayerProvider>
          </PlaylistProvider>
        </SpotifyAPIProvider>
      </ColorSchemeProvider>
    </main>
  );
};
export default App;