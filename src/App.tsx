import "./App.css";
import { type FC, useState, useRef, useEffect } from "react";
import Playlist from "./components/playList";
import SpotifyTest from "./components/test";

// Import MUI components here
import { Box } from "@mui/material";

// Import custom components here
import { MusicPlayer } from "./components/MusicPlayer/musicPlayer";

// Import custom contexts / providers here
import { PlayerProvider } from "./contexts/PlayerContext/playerProvider";
import { ColorSchemeProvider } from "./contexts/ColorSchemeContext/ColorSchemeProvider";

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
      console.log("HI");
    }
  }, [gradient]);

  window.addEventListener("resize", () => {
    setSize(window.innerHeight / 4);
  });

  return (
    <main>
      <ColorSchemeProvider>
        <PlayerProvider>
          <Box>
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
      </ColorSchemeProvider>
    </main>
  );
};
export default App;
