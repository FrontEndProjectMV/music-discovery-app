import React from 'react';

interface PlaylistItemProps {
    title: string;
    artist: string;
    duration?: string;
    coverImageUrl?: string;
    albumName?: string;
    onClick?: () => void;
    onDelete?: () => void;
}

const PlayListItem: React.FC<PlaylistItemProps> = ({
    title,
    artist,
    duration,
    coverImageUrl,
    albumName,
    onClick,
    onDelete,
}) => {

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                marginBottom: '8px',
                backgroundColor: '#fafafa',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'background-color 0.2s ease',
                ':hover': onClick ? { backgroundColor: '#f0f0f0' } : {}
            }}
            onClick={onClick}
            onMouseEnter={(e) => {
                if (onClick) {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa';
            }}
        >
            {/* Album Cover Image */}
            <div style={{ marginRight: '15px', flexShrink: 0 }}>
                {coverImageUrl ? (
                    <img
                        src={coverImageUrl}
                        alt={`${title} cover`}
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '4px',
                            objectFit: 'cover'
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '4px',
                            backgroundColor: '#ddd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            color: '#666'
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
                        fontWeight: 'bold', 
                        fontSize: '16px',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {title}
                </div>
                <div 
                    style={{ 
                        color: '#666', 
                        fontSize: '14px',
                        marginBottom: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {artist}
                </div>
                {albumName && (
                    <div 
                        style={{ 
                            color: '#999', 
                            fontSize: '12px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {albumName}
                    </div>
                )}
            </div>

            {/* Duration and Delete Button */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                flexShrink: 0 
            }}>
                {duration && (
                    <span style={{ 
                        color: '#666', 
                        fontSize: '14px',
                        minWidth: '40px',
                        textAlign: 'right'
                    }}>
                        {duration}
                    </span>
                )}
                
                {onDelete && (
                    <button 
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            onDelete();
                        }}
                        style={{
                            padding: '6px 10px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#c82333';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc3545';
                        }}
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default PlayListItem;