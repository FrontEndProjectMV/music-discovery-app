# Music Discovery App

## Overview

Music Discovery App is a modern, interactive front-end web application inspired by Spotify. It allows users to search for music, view playlists, control playback, and visually explore their listening queue with a unique circular interface. The app integrates with the Spotify Web API for real-time playback and user data, providing a seamless and visually engaging music experience.

## Contributors 
Damien Hall, Juan Figueroa, and Briana Daniels

## Features

- **Spotify OAuth2 Authentication**: Secure login and token management using PKCE.
- **Now Playing View**: Displays current track info, album art, and playback controls.
- **Circular Queue Ring**: Visualizes the upcoming tracks in a circular layout.
- **Interactive Player Controls**: Play, pause, skip, and seek functionality.
- **Dynamic Color Scheme**: UI adapts to album art colors for a personalized look.
- **Music Search**: Search for tracks and artists using Spotify's search API.
- **Responsive Design**: Scales beautifully across devices and screen sizes.

## Tech Stack

- **Languages**: TypeScript, JavaScript, CSS
- **Frameworks/Libraries**:
  - [React 19](https://react.dev/)
  - [Vite](https://vitejs.dev/) (build tool)
  - [Material UI (MUI)](https://mui.com/) (UI components)
  - [Chroma.js](https://gka.github.io/chroma.js/) (color manipulation)
  - [Lodash](https://lodash.com/) (utility functions)
- **Spotify Web API**: For authentication and music data

## Project Structure

```
## Project Structure

```
src/
  Api/
    authorize.tsx
  components/
    MusicPlayer/
      albumArt.tsx
      musicPlayer.tsx
      playBar.tsx
      playerControls.tsx
      queueRing.tsx
    Playlist/
      playList.tsx
      playListItem.tsx
    Popup/
      Popup.css
    MusicSearch.tsx
    Navbar.tsx
    SearchBar.tsx
    SpotifyAPIHandler.tsx
    spotifyTest.tsx
  contexts/
    ColorSchemeContext/
    PlayerContext/
    PlaylistContext/
    SearchContext/
    SpotifyAPIContext/
  utils/
    GradientFinder/
  App.tsx
  main.tsx
public/
package.json
vite.config.ts
README.md
```

## Key Components

- **MusicPlayer**: Main player UI, combines album art, controls, play bar, and queue ring.
- **AlbumArt**: Displays the current track's album cover.
- **PlayerControls**: Play, pause, skip, and seek buttons.
- **QueueRing**: Circular visualization of the playback queue.
- **PlayBar**: Progress bar for the current track.
- **MusicSearch**: Search interface for tracks and artists.
- **Playlist**: Displays and manages user playlists.

## Context Providers

- **SpotifyAPIContext**: Handles Spotify API calls and authentication state.
- **PlayerContext**: Manages playback state and queue.
- **ColorSchemeContext**: Dynamically updates UI colors based on album art.
- **PlaylistContext**: Manages playlist data.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Spotify Developer Account](https://developer.spotify.com/)

### Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-org/music-discovery-app.git
   cd music-discovery-app
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure Spotify API**
   - Register your app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications).
   - Set your `clientId` and `redirectUri` in `src/Api/authorize.tsx`.

4. **Start the development server**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173).

### Build for Production

```sh
npm run build
```

## Architecture

- **Component-based**: Each UI element is a reusable React component.
- **Context API**: Used for global state management (auth, playback, color scheme).
- **Hooks**: Custom hooks for API calls and state logic.
- **Responsive UI**: Uses MUI and CSS for adaptive layouts.
- **Spotify Integration**: Handles OAuth2 PKCE flow, token storage, and API requests.

## Contributing

1. Fork the repo and create your branch.
2. Make your changes and add tests if needed.
3. Submit a pull request with a clear description.


*Inspired by Spotify. This project is for educational purposes only.