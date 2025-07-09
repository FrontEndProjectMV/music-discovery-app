import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

import {
  redirectToSpotifyAuth,
  handleCallback,
  tokenStorage,
  ensureValidToken,
} from "../../Api/authorize";
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SpotifyAPIContext } from "./SpotifyAPIContext";
import { type SpotifyAPIContextType } from "./SpotifyAPIType";
import { redirectToSpotifyAuth, handleCallback, tokenStorage, ensureValidToken } from "../../Api/authorize";

const APIURL = "https://api.spotify.com/v1";

const generateHeaders = (method: string | null, accessToken: string | null) => {
    if (!accessToken) return null;

    return {
        method: method ? method : "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    };
}

export const SpotifyAPIProvider = ({ children }: { children: ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [userData, setUserData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const handledAuth = useRef<boolean>(false);

    const login = useCallback(() => {
        redirectToSpotifyAuth();
    }, []);

    const logout = useCallback(() => {
        tokenStorage.clear();
        setLoggedIn(false);
        setUserData({});
    }, []);

    // Position tracking setup
    const positionUpdateInterval = useRef<NodeJS.Timeout | null>(null);

    const startPositionTracking = useCallback(() => {
        if (positionUpdateInterval.current) {
            clearInterval(positionUpdateInterval.current);
        }

        positionUpdateInterval.current = setInterval(async () => {
            try {
                const res = await fetch(`${APIURL}/me/player`, generateHeaders("GET", tokenStorage.accessToken));
                if (res.ok) {
                    const data: SpotifyApi.CurrentPlaybackResponse = await res.json();
                    if (data) {
                        setUserData(prev => ({
                            ...prev, 
                            playbackstate: data
                        }));
                    }
                }
            } catch (error) {
                console.error("Error updating position:", error);
            }
        }, 1000);
    }, []);

    const stopPositionTracking = useCallback(() => {
        if (positionUpdateInterval.current) {
            clearInterval(positionUpdateInterval.current);
            positionUpdateInterval.current = null;
        }
    }, []);

    const getUserProfile = useCallback(async () => {
        try {
            const res = await fetch(`${APIURL}/me`, generateHeaders("GET", tokenStorage.accessToken));
            
            if (res.ok) {
                const data: SpotifyApi.CurrentUsersProfileResponse = await res.json();
                setUserData(prev => ({...prev, profile: data}));
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }, []);

    const getPlaybackState = useCallback(async () => {
        try {
            const res = await fetch(`${APIURL}/me/player`, generateHeaders("GET", tokenStorage.accessToken));

            if (res.ok) {
                const data: SpotifyApi.CurrentPlaybackResponse = await res.json();
                setUserData(prev => ({...prev, playbackstate: data}));
                
                if (data?.is_playing) {
                    startPositionTracking();
                }
                
                return data;
            }
        } catch (error) {
            console.error("Error fetching playback state:", error);
        }
    }, [startPositionTracking]);
    
    const getRecentlyPlayed = useCallback(async () => {
        try {
            const res = await fetch(`${APIURL}/me/player/recently-played`, generateHeaders("GET", tokenStorage.accessToken));

            if (res.ok) {
                const data = await res.json();
                setUserData(prev => ({...prev, recentlyPlayed: data}));
            }
        } catch (error) {
            console.error("Error fetching recently played tracks:", error);
        }
    }, []);

    const getQueue = useCallback(async () => {
        try {
            const res = await fetch(`${APIURL}/me/player/queue`, generateHeaders("GET", tokenStorage.accessToken));

            if (res.ok) {
                const data: SpotifyApi.UsersQueueResponse = await res.json();
                setUserData(prev => ({...prev, queue: data}));
            }
        } catch (error) {
            console.error("Error fetching queue:", error);
        }
    }, []);

    const skipToNext = useCallback(async () => {
        try {
            const res = await fetch(`${APIURL}/me/player/next`, generateHeaders("POST", tokenStorage.accessToken));

            if (res.ok) {
                setTimeout(() => {
                    getPlaybackState();
                    getQueue();
                }, 500);
            }
        } catch (error) {
            console.error("Error skipping to next track:", error);
        }
    }, [getPlaybackState, getQueue]);

    const skipToPrevious = useCallback(async () => {
        try {
            const res = await fetch(`${APIURL}/me/player/previous`, generateHeaders("POST", tokenStorage.accessToken));

            if (res.ok) {
                setTimeout(() => {
                    getPlaybackState();
                    getQueue();
                }, 500);
            }
        } catch (error) {
            console.error("Error skipping to previous track:", error);
        }
    }, [getPlaybackState, getQueue]);

    const searchTracks = useCallback(async (query: string, limit: number = 20) => {
        try {
            const encodedQuery = encodeURIComponent(query);
            const res = await fetch(
                `${APIURL}/search?q=${encodedQuery}&type=track&limit=${limit}`, 
                generateHeaders("GET", tokenStorage.accessToken)
            );

            if (res.ok) {
                const data: SpotifyApi.TrackSearchResponse = await res.json();
                return data;
            }
            return null;
        } catch (error) {
            console.error("Error searching tracks:", error);
            return null;
        }
      }
    } catch (error) {
      console.error("Error fetching playback state:", error);
    }
  }, [userData]);

    const play = useCallback(async () => {
        try {
            const res = await fetch(`${APIURL}/me/player/play`, generateHeaders("PUT", tokenStorage.accessToken));

            if (res.ok) {
                startPositionTracking();
                // Update playback state after a short delay
                setTimeout(() => getPlaybackState(), 500);
                return true;
            }

            return false;
        } catch (error) {
            console.error("Error playing track:", error);
            return false;
        }
    }, [startPositionTracking, getPlaybackState]);

    const pause = useCallback(async () => {
        try {
            const res = await fetch(`${APIURL}/me/player/pause`, generateHeaders("PUT", tokenStorage.accessToken));

            if (res.ok) {
                stopPositionTracking();
                // Update playback state after a short delay
                setTimeout(() => getPlaybackState(), 500);
                return true;
            }

            return false;
        } catch (error) {
            console.error("Error pausing track:", error);
            return false;
        }
    }, [stopPositionTracking, getPlaybackState]);

    const getUserPlaylists = useCallback(async () => {
        try {
            const res = await fetch(
                `${APIURL}/me/playlists?limit=50`, 
                generateHeaders("GET", tokenStorage.accessToken)
            );

            if (res.ok) {
                const data: SpotifyApi.ListOfCurrentUsersPlaylistsResponse = await res.json();
                return data;
            }
            return null;
        } catch (error) {
            console.error("Error fetching user playlists:", error);
            return null;
        }
    }, []);

    const getPlaylistTracks = useCallback(async (playlistId: string) => {
        try {
            const res = await fetch(
                `${APIURL}/playlists/${playlistId}/tracks`, 
                generateHeaders("GET", tokenStorage.accessToken)
            );

            if (res.ok) {
                const data: SpotifyApi.PlaylistTrackResponse = await res.json();
                return data;
            }
            return null;
        } catch (error) {
            console.error("Error fetching playlist tracks:", error);
            return null;
        }
    }, []);

    const createUserPlaylist = useCallback(async (name: string, description: string = "") => {
        try {
            if (!userData.profile?.id) return null;

            const res = await fetch(
                `${APIURL}/users/${userData.profile.id}/playlists`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${tokenStorage.accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        description,
                        public: false
                    })
                }
            );

            if (res.ok) {
                const data: SpotifyApi.CreatePlaylistResponse = await res.json();
                return data;
            }
            return null;
        } catch (error) {
            console.error("Error creating playlist:", error);
            return null;
        }
    }, [userData.profile]);

    const addTracksToPlaylist = useCallback(async (playlistId: string, trackUris: string[]) => {
        try {
            const res = await fetch(
                `${APIURL}/playlists/${playlistId}/tracks`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${tokenStorage.accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        uris: trackUris
                    })
                }
            );

            return res.ok;
        } catch (error) {
            console.error("Error adding tracks to playlist:", error);
            return false;
          });
      }
    } catch (error) {
      console.error("Error skipping to next track:", error);
    }
  }, [getPlaybackState, getQueue]);

    const removeTracksFromPlaylist = useCallback(async (playlistId: string, trackUris: string[]) => {
        try {
            const res = await fetch(
                `${APIURL}/playlists/${playlistId}/tracks`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${tokenStorage.accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        tracks: trackUris.map(uri => ({ uri }))
                    })
                }
            );

            return res.ok;
        } catch (error) {
            console.error("Error removing tracks from playlist:", error);
            return false;
          });
      }
    } catch (error) {
      console.error("Error skipping to previous track:", error);
    }
  }, [getPlaybackState, getQueue]);

  const searchTracks = useCallback(
    async (query: string, limit: number = 20) => {
      try {
        const encodedQuery = encodeURIComponent(query);
        const res = await fetch(
          `${APIURL}/search?q=${encodedQuery}&type=track&limit=${limit}`,
          generateHeaders("GET", tokenStorage.accessToken),
        );

        if (res.ok) {
          const data: SpotifyApi.TrackSearchResponse = await res.json();
          return data;
        }
        return null;
      } catch (error) {
        console.error("Error searching tracks:", error);
        return null;
      }
    },
    [],
  );

    const deleteUserPlaylist = useCallback(async (playlistId: string) => {
        try {
            const res = await fetch(
                `${APIURL}/playlists/${playlistId}/followers`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${tokenStorage.accessToken}`
                    }
                }
            );

      if (res.ok) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error playing track:", error);
    }
  }, []);

  const pause = useCallback(async () => {
    try {
      const res = await fetch(
        `${APIURL}/me/player/pause`,
        generateHeaders("PUT", tokenStorage.accessToken),
      );

      if (res.ok) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error pausing track:", error);
    }
  }, []);
  const getUserPlaylists = useCallback(async () => {
    try {
      const res = await fetch(
        `${APIURL}/me/playlists?limit=50`,
        generateHeaders("GET", tokenStorage.accessToken),
      );

      if (res.ok) {
        const data: SpotifyApi.ListOfCurrentUsersPlaylistsResponse =
          await res.json();
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user playlists:", error);
      return null;
    }
  }, []);

  const getPlaylistTracks = useCallback(async (playlistId: string) => {
    try {
      const res = await fetch(
        `${APIURL}/playlists/${playlistId}/tracks`,
        generateHeaders("GET", tokenStorage.accessToken),
      );

      if (res.ok) {
        const data: SpotifyApi.PlaylistTrackResponse = await res.json();
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
      return null;
    }
  }, []);

  const createUserPlaylist = useCallback(
    async (name: string, description: string = "") => {
      try {
        if (!userData.profile?.id) return null;

        const res = await fetch(
          `${APIURL}/users/${userData.profile.id}/playlists`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${tokenStorage.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              description,
              public: false,
            }),
          },
        );

        if (res.ok) {
          const data: SpotifyApi.CreatePlaylistResponse = await res.json();
          return data;
        }
        return null;
      } catch (error) {
        console.error("Error creating playlist:", error);
        return null;
      }
    },
    [userData.profile],
  );

    const data = useMemo(() => ({
        loggedIn,
        login,
        logout,
        userData,
        loading,
        getUserProfile,
        getPlaybackState,
        skipToNext,
        skipToPrevious,
        getRecentlyPlayed,
        getQueue,
        searchTracks,
        play,
        pause,
        getUserPlaylists,
        getPlaylistTracks,
        addTracksToPlaylist,
        removeTracksFromPlaylist,
        createUserPlaylist,
        deleteUserPlaylist,
    } as SpotifyAPIContextType), [
        loggedIn,
        login,
        logout,
        userData,
        loading,
        getUserProfile,
        getPlaybackState,
        skipToNext,
        skipToPrevious,
        getRecentlyPlayed,
        getQueue,
        searchTracks,
        play,
        pause,
        getUserPlaylists,
        getPlaylistTracks,
        addTracksToPlaylist,
        removeTracksFromPlaylist,
        createUserPlaylist,
        deleteUserPlaylist,
    ]);

    useEffect(() => {
        if (handledAuth.current) return;

        handledAuth.current = true;
        const checkAuth = async () => {
            const callbackSuccess = await handleCallback();

            if (callbackSuccess) {
                setLoggedIn(true);
                await getUserProfile();
                await getPlaybackState();
                await getRecentlyPlayed();
                await getQueue();
            } else {
                const hasValidToken = await ensureValidToken();
                setLoggedIn(hasValidToken);

                if (hasValidToken) {
                    await getUserProfile();
                    await getPlaybackState();
                    await getRecentlyPlayed();
                    await getQueue();
                }
            }

            setLoading(false);
        }

        checkAuth();
    }, [getUserProfile, getPlaybackState, getRecentlyPlayed, getQueue]);

    // Auto-start tracking if music is playing
    useEffect(() => {
        if (loggedIn && userData.playbackstate?.is_playing) {
            startPositionTracking();
        } else if (!userData.playbackstate?.is_playing) {
            stopPositionTracking();
        }
        
        return () => {
            stopPositionTracking();
        };
    }, [loggedIn, userData.playbackstate?.is_playing, startPositionTracking, stopPositionTracking]);

    return <SpotifyAPIContext.Provider value={data}>{children}</SpotifyAPIContext.Provider>;
}
