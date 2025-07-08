import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react";

import { redirectToSpotifyAuth, handleCallback, tokenStorage, ensureValidToken } from '../../Api/authorize';
import { SpotifyAPIContext } from "./SpotifyAPIContext";
import { type SpotifyAPIContextType } from "./SpotifyAPIType";

const APIURL = "https://api.spotify.com/v1";

const generateHeaders = (method: string | null, accessToken: string | null) => {
	if (!accessToken) return;

	return {
		method: method ? method : "GET",
		headers: {
			"Authorization": `Bearer ${accessToken}`
		}
	};
}

export const SpotifyAPIProvider = ({ children }: { children: ReactNode }) => {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const [userData, setUserData] = useState<object>({});
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
				
				if (userData.playbackstate && data.item.id === userData.playbackstate.item.id) {
					console.log("PLAYBACK STATE WASN'T UP TO DATE!");
					return getPlaybackState();
				} else {
					setUserData(prev => ({...prev, playbackstate: data}));
					return {...userData, playbackstate: data};
				}
			}
		} catch (error) {
			console.error("Error fetching playback state:", error);
		}
	}, [userData]);
	
	const getRecentlyPlayed = useCallback(async () => {
		try {
			const res = await fetch(`${APIURL}/me/player/recently-played?limit=4`, generateHeaders("GET", tokenStorage.accessToken));

			if (res.ok) {
				const data: SpotifyApi.UsersRecentlyPlayedTracksResponse = await res.json();
				setUserData(prev => ({...prev, recentlyplayedtracks: data}));
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
				return data;
			}
		} catch (error) {
			console.error("Error fetching queue:", error);
		}
	}, [userData.queue]);

	const skipToNext = useCallback(async () => {
		try {
			const res = await fetch(`${APIURL}/me/player/next`, generateHeaders("POST", tokenStorage.accessToken));

			if (res.ok) {
				getQueue();
				getPlaybackState().then(() => {
					return true;
				}).catch(() => { return false });
			}
		} catch (error) {
			console.error("Error skipping to next track:", error);
		}
	}, [getPlaybackState, getQueue]);

	const skipToPrevious = useCallback(async () => {
		try {
			const res = await fetch(`${APIURL}/me/player/previous`, generateHeaders("POST", tokenStorage.accessToken));

			if (res.ok) {
				getQueue();
				getPlaybackState().then(() => {
					return true;
				}).catch(() => { return false });
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
    }, []);

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
	]);

	// Check if user is already logged in on init
	useEffect(() => {
		if (handledAuth.current) return;

		handledAuth.current = true;
		const checkAuth = async () => {
			const callbackSuccess = await handleCallback();

			if (callbackSuccess) {
				setLoggedIn(true);
				getUserProfile();
				getPlaybackState();
				getRecentlyPlayed();
				getQueue();
			} else {
				// if a valid token exists, then we must be logged in :)
				const hasValidToken = await ensureValidToken();
				setLoggedIn(hasValidToken);

				if (hasValidToken) {
					getUserProfile();
					getPlaybackState();
					getRecentlyPlayed();
					getQueue();
				}
			}

			setLoading(false);
		}

		checkAuth();
	});

	return <SpotifyAPIContext.Provider value={data}>{children}</SpotifyAPIContext.Provider>;
}
