import React, { useEffect, useState } from 'react';
import { redirectToSpotifyAuth, handleCallback, tokenStorage, ensureValidToken } from '../Api/authorize';

const SpotifyTest: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      // First check if we're handling a callback
      const callbackSuccess = await handleCallback();
      
      if (callbackSuccess) {
        setIsLoggedIn(true);
        fetchUserData();
      } else {
        // Otherwise check if we have a valid token
        const hasValidToken = await ensureValidToken();
        setIsLoggedIn(hasValidToken);
        
        if (hasValidToken) {
          fetchUserData();
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Fetch user data from Spotify
  const fetchUserData = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${tokenStorage.accessToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  const handleLogin = () => {
    redirectToSpotifyAuth();
  };
  
  const handleLogout = () => {
    tokenStorage.clear();
    setIsLoggedIn(false);
    setUserData(null);
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>Spotify API Test</h1>
      
      {!isLoggedIn ? (
        <button onClick={handleLogin}>Login with Spotify</button>
      ) : (
        <div>
          <h2>You're logged in!</h2>
          <button onClick={handleLogout}>Logout</button>
          
          {userData && (
            <div>
              <h3>Your Spotify Info:</h3>
              <p><strong>Name:</strong> {userData.display_name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              {userData.images?.length > 0 && (
                <img 
                  src={userData.images[0].url} 
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