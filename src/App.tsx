import { type FC, useState, useRef } from "react";
import Playlist from "./components/playList";

// Import custom components here
import { MusicPlayer } from "./components/MusicPlayer/musicPlayer";

// Import custom contexts / providers here
import { PlayerProvider } from "./contexts/PlayerContext/playerProvider";
import { ColorSchemeProvider } from "./contexts/ColorSchemeContext/ColorSchemeProvider";

const App: FC = () => {
	// these states here WILL be changed in the future, DO NOT RELY ON THESE
  const [size, setSize] = useState(window.innerHeight / 4);
  const [selectedArt, setSelectedArt] = useState(0);
  const [rotation, setRotation] = useState(0);
  const selectedArtRef = useRef<HTMLImageElement | null>(null);

  window.addEventListener("resize", () => {
    setSize(window.innerHeight / 4);
  });

  return (
    <main>
      <ColorSchemeProvider>
        <PlayerProvider>
					<MusicPlayer
						size={size}
            selectedArt={selectedArt}
            setSelectedArt={setSelectedArt}
            selectedArtRef={selectedArtRef}
            rotation={rotation}
            setRotation={setRotation}
					/>
				</PlayerProvider>
        <h2>My Playlist</h2>
        <Playlist />
      </ColorSchemeProvider>
    </main>
  );
};
export default App;
