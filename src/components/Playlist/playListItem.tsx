import React from "react";
import { useColorSchemeContext } from "../../contexts/ColorSchemeContext/ColorSchemeContext";

interface PlaylistItemProps {
  title: string;
  artist: string;
  duration?: string;
  coverImageUrl?: string;
  albumName?: string;
  spotifyUri?: string;
  onClick?: () => void;
  onDelete?: () => void;
  onPlay?: (spotifyUri: string) => void;
}

const PlayListItem: React.FC<PlaylistItemProps> = ({
  title,
  artist,
  duration,
  coverImageUrl,
  albumName,
  spotifyUri,
  onClick,
  onDelete,
  onPlay,
}) => {
  const colorScheme = useColorSchemeContext();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay && spotifyUri) {
      onPlay(spotifyUri);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        marginBottom: "8px",
        backgroundColor: "rgba(0, 0, 0, 0)",
        cursor: onClick ? "pointer" : "default",
        transition: "background-color 0.2s ease",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colorScheme.hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0)";
      }}
    >
      {/* Album Cover Image */}
      <div style={{ marginRight: "15px", flexShrink: 0 }}>
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={`${title} cover`}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "4px",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "4px",
              backgroundColor: "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: "#666",
            }}
          >
            ♪
          </div>
        )}
      </div>

      {/* Song Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: "4px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#666",
            fontSize: "14px",
            marginBottom: "2px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {artist}
        </div>
        {albumName && (
          <div
            style={{
              color: "#999",
              fontSize: "12px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {albumName}
          </div>
        )}
      </div>

      {/* Duration and Action Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        {duration && (
          <span
            style={{
              color: "#666",
              fontSize: "14px",
              minWidth: "40px",
              textAlign: "right",
            }}
          >
            {duration}
          </span>
        )}

        {/* Play Button */}
        {onPlay && spotifyUri && (
          <button
            onClick={handlePlayClick}
            style={{
              padding: "4px 8px",
              backgroundColor: "#1db954",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "bold",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1ed760";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1db954";
            }}
            title="Play this track"
          >
            ▶
          </button>
        )}

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={{
              padding: "4px 8px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "bold",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#c82333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#dc3545";
            }}
            title="Remove from playlist"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayListItem;

