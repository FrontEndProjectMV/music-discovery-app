import { useState, useEffect, type ReactNode } from "react";
import { PlayerContext } from "./playerContext";
import { type PlayerContextType } from "./playerType";
import { useSpotifyAPIContext } from "../SpotifyAPIContext/SpotifyAPIContext";

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const spotifyAPI = useSpotifyAPIContext();

  const [history, setHistory] = useState<string[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const [bottomTrackIndex, setBottomTrackIndex] = useState<number>(0);
  const [trackPosition, setTrackPosition] = useState<number>(0.9);

  const addToQueue = (track: string) => {
    setQueue([...queue, track]);
  };

  const addToHistory = (track: string) => {
    setHistory([...history, track]);
  };

  const skipToNext = async () => {
    spotifyAPI
      .skipToNext()
      .then(() => {
        if (bottomTrackIndex === queue.length - 1) {
          setBottomTrackIndex(0);
        } else {
          setBottomTrackIndex(bottomTrackIndex + 1);
        }

        const trimmedSpotifyQueue = [
          spotifyAPI.userData.queue.currently_playing,
          ...spotifyAPI.userData.queue.queue.slice(0, 12),
        ].map((song) => song.album.images[0].url);
        if (queue.length > 0) {
          const updatedQueue = [...queue];
          updatedQueue[bottomTrackIndex] =
            trimmedSpotifyQueue[trimmedSpotifyQueue.length - 1];
          setQueue(updatedQueue);
        } else {
          setQueue(trimmedSpotifyQueue.slice(0, 12));
        }
      })
      .catch(() => {
        return false;
      });
  };

  const skipToPrevious = async () => {
    if (bottomTrackIndex === queue.length - 1) {
      spotifyAPI.getQueue();
    }

    spotifyAPI
      .skipToPrevious()
      .then(() => {
        if (bottomTrackIndex === 0) {
          setBottomTrackIndex(queue.length - 1);
        } else {
          setBottomTrackIndex(bottomTrackIndex - 1);
        }
        const trimmedSpotifyQueue = [
          spotifyAPI.userData.queue.currently_playing,
          ...spotifyAPI.userData.queue.queue.slice(0, 12),
        ].map((song) => song.album.images[0].url);
        if (queue.length > 0) {
          const updatedQueue = [...queue];
          updatedQueue[bottomTrackIndex] = trimmedSpotifyQueue[0];
          setQueue(updatedQueue);
        } else {
          setQueue(trimmedSpotifyQueue.slice(0, 12));
        }

        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const data: PlayerContextType = {
    queue,
    addToQueue,
    setQueue,
    history,
    addToHistory,
    trackPosition,
    setTrackPosition,
    skipToNext,
    skipToPrevious,
    bottomTrackIndex,
  };

  useEffect(() => {
    if (
      spotifyAPI.userData.queue &&
      spotifyAPI.userData.queue.currently_playing
    ) {
      const trimmedSpotifyQueue = [
        spotifyAPI.userData.queue.currently_playing,
        ...spotifyAPI.userData.queue.queue.slice(0, 12),
      ].map((song) => song.album.images[0].url);
      if (queue.length === 0) {
        setQueue(trimmedSpotifyQueue.slice(0, 12));
      }

      // when queue updates
      //
    }
  });

  const incrementer = window.setInterval(() => {
    setTrackPosition(trackPosition + 0.01);
    if (trackPosition >= 1.0) {
      setTrackPosition(1.0);
      window.clearInterval(incrementer);
    }
  }, 1000);

  return (
    <PlayerContext.Provider value={data}>{children}</PlayerContext.Provider>
  );
};
