import { useState, useEffect, type ReactNode } from "react";
import { PlayerContext } from "./playerContext";
import { type PlayerContextType } from "./playerType";
import { useSpotifyAPIContext } from "../SpotifyAPIContext/SpotifyAPIContext";

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const spotifyAPI = useSpotifyAPIContext();

  const [history, setHistory] = useState<string[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const [bottomTrackIndex, setBottomTrackIndex] = useState<number>(0);
	const [trackDuration, setTrackDuration] = useState<number>(0);
  const [trackPosition, setTrackPosition] = useState<number>(0.0);
  const [offset, setOffset] = useState<number>(0);
	const [paused, setPaused] = useState<boolean>(false);

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
        if (bottomTrackIndex === 8) {
          spotifyAPI.getQueue();
          setOffset(9);
        }

        if (bottomTrackIndex === queue.length - 1) {
          spotifyAPI.getQueue();
          setOffset(0);
          setBottomTrackIndex(0);
        } else {
          setBottomTrackIndex(bottomTrackIndex + 1);
        }

        let spotifyQueue = [
          spotifyAPI.userData.queue.currently_playing,
          ...spotifyAPI.userData.queue.queue,
        ];

        spotifyQueue = spotifyQueue
          .slice(bottomTrackIndex - offset, bottomTrackIndex + 13 - offset)
          .map((song) => song.album.images[0].url);

        if (queue.length > 0) {
          const updatedQueue = [...queue];
          updatedQueue[bottomTrackIndex] =
            spotifyQueue[spotifyQueue.length - 1];
          setQueue(updatedQueue);
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

	const play = async () => {
		spotifyAPI.play().then(() => {
			setPaused(false);
			return false;
		});
	}

	const pause = async () => {
		spotifyAPI.pause().then(() => {
			setPaused(true);
			return true;
		});
	}

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
		trackDuration,
		setTrackDuration,
		paused,
		play,
		pause,
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
    }
  });

  // runs once to setup interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackPosition(prev => {
				if (prev >= 1.0) {
					//skipToNext();
					return 0.0;
				}
				
				return prev + 0.01
			});
			console.log("UPDATED",trackPosition)
    }, 1000);

		return () => clearInterval(interval);
  }, []);

  return (
    <PlayerContext.Provider value={data}>{children}</PlayerContext.Provider>
  );
};
