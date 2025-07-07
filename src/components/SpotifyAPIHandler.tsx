import React, { useRef, useEffect, useState } from 'react';
import { redirectToSpotifyAuth, handleCallback, tokenStorage, ensureValidToken } from '../Api/authorize';

const APIURL = "https://api.spotify.com/v1";

const SpotifyAPIHandler: React.FC = () => {
}
