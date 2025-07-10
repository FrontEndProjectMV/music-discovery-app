import './PlayerBar.css';



const PlayerBar = () => {
    return (
         <><img
            src="/path/to/cover.jpg"
            alt="Album Cover"
            className="player-cover" /><div className="player-info">
                <div className="player-title">Beat It</div>
                <div className="player-artist">Michael Jackson</div>
                <input
                    type="range"
                    min={0}
                    max={210}
                    value={96}
                    className="player-progress"
                    readOnly />
                <div className="player-time">
                    <span>1:36</span>
                    <span>3:30</span>
                </div>
            </div><div className="player-controls">
                <button>{'⏪'}</button>
                <button>{'▶️'}</button>
                <button>{'⏩'}</button>
            </div></>
            
    )
}

export default PlayerBar;
