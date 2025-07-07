// Constants
const clientId = 'b02259e480804424b9d4f349eca4c01f';
const redirectUri = 'http://127.0.0.1:5173/';
const scope = [
	"user-read-private",
	"user-read-email",
	"user-read-playback-state",
	"user-read-recently-played",
	"user-modify-playback-state",
].join(" ");
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";

// Helper functions
const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Token management
export const tokenStorage = {
  get accessToken(): string | null { 
    return localStorage.getItem('access_token') || null; 
  },
  
  get refreshToken(): string | null { 
    return localStorage.getItem('refresh_token') || null; 
  },
  
  get expiresIn(): string | null { 
    return localStorage.getItem('expires_in') || null;
  },
  
  get expires(): Date | null { 
    const expires = localStorage.getItem('expires');
    return expires ? new Date(expires) : null;
  },

  save: function(response: any): void {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem('access_token', access_token);
    
    if (refresh_token) {
      localStorage.setItem('refresh_token', refresh_token);
    }
    
    if (expires_in) {
      localStorage.setItem('expires_in', expires_in);
      const now = new Date();
      const expiry = new Date(now.getTime() + (expires_in * 1000));
      localStorage.setItem('expires', expiry.toString());
    }
  },
  
  clear: function(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('expires');
    localStorage.removeItem('code_verifier');
  }
};

// Main authorization function
export const redirectToSpotifyAuth = async (): Promise<void> => {
  try {
    // Generate code verifier and challenge
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);
    
    // Store the code verifier for later use
    localStorage.setItem('code_verifier', codeVerifier);
    
    // Build authorization URL
    const authUrl = new URL(authorizationEndpoint);
    const params = {
      response_type: 'code',
      client_id: clientId,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    };
    
    authUrl.search = new URLSearchParams(params).toString();
    
    // Redirect to Spotify authorization page
    window.location.href = authUrl.toString();
  } catch (error) {
    console.error('Authorization error:', error);
  }
};

// Exchange authorization code for access token
export const getToken = async (code: string): Promise<any> => {
  try {
    // Get stored code verifier
    const codeVerifier = localStorage.getItem('code_verifier');
    
    if (!codeVerifier) {
      throw new Error('Code verifier not found in localStorage');
    }
    
    // Make token exchange request
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Save token data
    tokenStorage.save(data);
    return data;
  } catch (error) {
    console.error('Token exchange error:', error);
    throw error;
  }
};

// Refresh access token when expired
export const refreshToken = async (): Promise<any> => {
  try {
    const refresh_token = tokenStorage.refreshToken;
    
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'refresh_token',
        refresh_token
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    tokenStorage.save(data);
    return data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

// Check if we're receiving a callback from Spotify
export const handleCallback = async (): Promise<boolean> => {
  const args = new URLSearchParams(window.location.search);
  const code = args.get('code');
  
  if (code) {
    try {
      await getToken(code);
      
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      
      const updatedUrl = url.search ? url.href : url.href.replace('?', '');
      window.history.replaceState({}, document.title, updatedUrl);
      return true;
    } catch (error) {
      console.error('Error handling callback:', error);
      return false;
    }
  }
  return false;
};

// Check if the token is valid or needs to be refreshed
export const ensureValidToken = async (): Promise<boolean> => {
  if (!tokenStorage.accessToken) {
    return false;
  }
  
  if (tokenStorage.expires && new Date() > tokenStorage.expires) {
    if (tokenStorage.refreshToken) {
      try {
        await refreshToken();
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  }
  
  return true;
};
