import React, { useRef, useEffect, useState } from "react";

// Import custom contexts here
import { useSpotifyAPIContext } from "../contexts/SpotifyAPIContext/SpotifyAPIContext";

const SpotifyTest: React.FC = () => {
  const spotifyAPI = useSpotifyAPIContext();

  if (spotifyAPI.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Spotify API Test</h1>

      {!spotifyAPI.loggedIn ? (
        <button onClick={spotifyAPI.login}>Login with Spotify</button>
      ) : (
        <div>
          <h2>You're logged in!</h2>
          <button onClick={spotifyAPI.logout}>Logout</button>

          {spotifyAPI.userData.profile && (
            <div>
              <h3>Your Spotify Info:</h3>
              <p>
                <strong>Name:</strong>{" "}
                {spotifyAPI.userData.profile.display_name}
              </p>
              <p>
                <strong>Email:</strong> {spotifyAPI.userData.profile.email}
              </p>
              {spotifyAPI.userData.profile.images!.length > 0 && (
                <img
                  src={spotifyAPI.userData.profile.images![0].url}
                  alt="Profile"
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpotifyTest;
