import React from "react";
import { useSpotifyAPIContext } from "../contexts/SpotifyAPIContext/SpotifyAPIContext";

import { Box, Typography } from "@mui/material";

const SpotifyTest: React.FC = () => {
  const spotifyAPI = useSpotifyAPIContext();

  if (spotifyAPI.loading) {
    return <div style={{ color: "white" }}>Loading Spotify...</div>;
  }

  if (!spotifyAPI.loggedIn) {
    return (
      <div>
        <p
          style={{
            margin: 0,
            color: "#1db954",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "18px",
            fontWeight: "600",
          }}
          onClick={spotifyAPI.login}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#1ed760";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#1db954";
          }}
        >
          Log In
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <div>
          <h3
            style={{
              margin: 0,
              color: "white",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            Welcome, {spotifyAPI.userData.profile?.display_name || "User"}!
          </h3>
          <p
            style={{
              margin: 0,
              color: "#1db954",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "16px",
              fontWeight: "600",
            }}
            onClick={spotifyAPI.logout}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#1ed760";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#1db954";
            }}
          >
            Logout
          </p>
        </div>

        {spotifyAPI.userData.profile?.images?.[0]?.url ? (
          <img
            src={spotifyAPI.userData.profile.images[0].url}
            alt="Profile"
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              border: "2px solid rgba(255, 255, 255, 0.3)",
            }}
          />
        ) : (
					<Box sx={{
						display: "flex",
						width: "50px",
						height: "50px",
						borderRadius: "50%",
						border: "2px solid rgba(255, 255, 255, 0.3)",
						alignItems: "center",
					}}>
						<Typography variant="h6" sx={{
							flex: "1"
						}}>
							{spotifyAPI.userData.profile?.display_name ? spotifyAPI.userData.profile.display_name[0] : "?"}
						</Typography>
					</Box>
        )}
      </div>
    </div>
  );
};

export default SpotifyTest;

