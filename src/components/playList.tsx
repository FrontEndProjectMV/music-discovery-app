import React, { useState } from 'react';
import PlaylistItem from './playListItem';
import post1 from '../assets/post1.jpg';
import post2 from '../assets/post2.jpg';

interface PlaylistItemType {
  title: string;
  artist: string;
  duration?: string;
  coverImageUrl?: string;
}

const allSongs: PlaylistItemType[] = [
  {
    title: "No Flex",
    artist: "Post Malone",
    duration: "3:45",
    coverImageUrl: post1,
  },
  {
    title: "RockStar",
    artist: "Post Malone",
    duration: "4:12",
    coverImageUrl: post2,
  },
];

const Playlist: React.FC = () => {
  const [playlistIndices, setPlaylistIndices] = useState<number[]>([]);

  const handleAdd = (idx: number) => {
    if (!playlistIndices.includes(idx)) {
      setPlaylistIndices(indices => [...indices, idx]);
    }
  };

  const handleDelete = (idx: number) => {
    setPlaylistIndices(indices => indices.filter(i => i !== idx));
  };

  return (
    <div>
      <h3>Available Songs</h3>
      {allSongs.map((song, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
          <span>{song.title} - {song.artist}</span>
          {!playlistIndices.includes(idx) ? (
            <button style={{ marginLeft: 8 }} onClick={() => handleAdd(idx)}>
              Add to Playlist
            </button>
          ) : (
            <button style={{ marginLeft: 8 }} onClick={() => handleDelete(idx)}>
              Remove from Playlist
            </button>
          )}
        </div>
      ))}

      <h3>Playlist</h3>
      {playlistIndices.length === 0 && <div>No songs in playlist.</div>}
      {playlistIndices.map(idx => (
        <PlaylistItem
          key={idx}
          title={allSongs[idx].title}
          artist={allSongs[idx].artist}
          duration={allSongs[idx].duration}
          coverImageUrl={allSongs[idx].coverImageUrl}
          onDelete={() => handleDelete(idx)}
        />
      ))}
    </div>
  );
};


export default Playlist;