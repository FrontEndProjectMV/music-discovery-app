import React from "react";
import { useSpotifyAPIContext } from "../contexts/SpotifyAPIContext/SpotifyAPIContext";

import { Box, Typography, Button } from "@mui/material";
import { useColorSchemeContext } from "../contexts/ColorSchemeContext/ColorSchemeContext";

const SpotifyTest: React.FC = () => {
  const spotifyAPI = useSpotifyAPIContext();
  const colorScheme = useColorSchemeContext();

  if (spotifyAPI.loading) {
    return <div style={{ color: "white" }}>Loading Spotify...</div>;
  }

  if (!spotifyAPI.loggedIn) {
    return (
      <div>
        <Button
          sx={{
            backgroundColor: "rgba(0,0,0,0)",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
            border: "2px solid rgba(255, 255, 255, 0.3)",
          }}
          onClick={spotifyAPI.login}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colorScheme.hoverColor;
            e.currentTarget.style.border = "2px solid rgba(255, 255, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0,0,0,0)";
          }}
        >
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <div>
          <Button
            sx={{
              backgroundColor: "rgba(0,0,0,0)",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
              border: "2px solid rgba(255, 255, 255, 0.3)",
            }}
            onClick={spotifyAPI.logout}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colorScheme.hoverColor;
              e.currentTarget.style.border =
                "2px solid rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0,0,0,0)";
            }}
          >
            Logout
          </Button>
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
          <Box
            sx={{
              display: "flex",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                flex: "1",
              }}
            >
              {spotifyAPI.userData.profile?.display_name
                ? spotifyAPI.userData.profile.display_name[0]
                : "?"}
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default SpotifyTest;
