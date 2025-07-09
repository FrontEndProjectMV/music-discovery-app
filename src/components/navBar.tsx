import React from 'react';
import SpotifyTest from './spotifyTest';

const Navbar: React.FC = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: '15px 25px',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(15px)',
      border: 'none',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      width: '100vw',
      maxWidth: 'none',
      boxSizing: 'border-box',
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: 1000,
      margin: '0'
    }}>
      <SpotifyTest />
    </nav>
  );
};

export default Navbar;