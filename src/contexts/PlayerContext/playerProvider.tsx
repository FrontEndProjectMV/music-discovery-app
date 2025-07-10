import { useState, useEffect, type ReactNode, useMemo } from "react";
import { PlayerContext } from "./playerContext";
import { type PlayerContextType } from "./playerType";
import { useSpotifyAPIContext } from "../SpotifyAPIContext/SpotifyAPIContext";

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const spotifyAPI = useSpotifyAPIContext();

  const [history, setHistory] = useState<string[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const [bottomTrackIndex, setBottomTrackIndex] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);

  // Get real-time data from Spotify API instead of local state
  const currentTrack = spotifyAPI.userData.playbackstate?.item;
  const trackPosition = spotifyAPI.userData.playbackstate?.progress_ms || 0;
  const trackDuration = currentTrack?.duration_ms || 0;
  const paused = !spotifyAPI.userData.playbackstate?.is_playing;

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

        setRotation(prev => prev + 360 / queue.length);
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
    return spotifyAPI.play();
  }

  const pause = async () => {
    return spotifyAPI.pause();
  }

  const playTrack = async (trackUri: string) => {
    return spotifyAPI.startPlaybackWithTracks([trackUri], 0);
  }

  const playPlaylist = async (trackUris: string[], startIndex: number = 0) => {
    return spotifyAPI.startPlaybackWithTracks(trackUris, startIndex);
  }

  // Use useMemo to prevent unnecessary re-renders
  const data: PlayerContextType = useMemo(() => ({
    queue,
    addToQueue,
    setQueue,
    history,
    addToHistory,
    currentTrack,
    trackPosition,
    setTrackPosition: () => {},
    trackDuration,
    setTrackDuration: () => {},
    skipToNext,
    skipToPrevious,
    bottomTrackIndex,
    paused,
    play,
    pause,
    playTrack,
    playPlaylist,
    rotation,
    setRotation,
  }), [
    queue,
    addToQueue,
    setQueue,
    history,
    addToHistory,
    currentTrack,
    trackPosition,
    trackDuration,
    skipToNext,
    skipToPrevious,
    bottomTrackIndex,
    paused,
    play,
    pause,
    playTrack,
    playPlaylist,
    rotation,
    setRotation,
  ]);

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
  }, [spotifyAPI.userData.queue, queue.length]);

  return (
    <PlayerContext.Provider value={data}>{children}</PlayerContext.Provider>
  );
};