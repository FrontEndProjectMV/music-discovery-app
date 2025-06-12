import React from 'react';

interface PlaylistItemProps {
    title: string;
    artist: string;
    duration?: string;
    coverImageUrl?: string;
    onClick?: () => void;
    onDelete?: () => void;
}

const PlayListItem: React.FC<PlaylistItemProps> = ({
    title,
    artist,
    duration,
    coverImageUrl,
    onClick,
    onDelete,
}) => {

    return (
        <div
            className={"playlist-item"}
            onClick={onClick}
        >
            {coverImageUrl && (
                <img
                    src={coverImageUrl}
                    alt={`${title} cover`}
                />
            )}
            <div>
                {title} - {artist}
                {duration}
            </div>
            {onDelete && (
                <button onClick={e => { e.stopPropagation(); onDelete()}}>
                    Delete
                </button>
            )}
            
        </div>
    );
};

export default PlayListItem;