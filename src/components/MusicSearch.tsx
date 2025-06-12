import { useState } from 'react';

interface MusicItem {
    id: number;
    artist: string;
    title: string;
    duration: string;
}

const musicSearchResults: MusicItem[] = [
    {
        id: 1,
        artist: 'Artist Name',
        title: 'Song Title',
        duration: '0:00',
    },
    {
        id: 2,
        artist: 'Artist',
        title: 'Song',
        duration: '0:00',
    }
];

function MusicSearch() {
    const [searchMusic, setSearchMusic] = useState<string>('');
    const [results, setResults] = useState<MusicItem[]>([]);

    const handleSearch = () => {
        console.log('Search term:', searchMusic);
        const filteredResults = musicSearchResults.filter(item =>
            item.artist.toLowerCase().includes(searchMusic.toLowerCase())
        );
        console.log('Filtered results:', filteredResults);
        setResults(filteredResults);
    };
    console.log('Current results:', results);

    return (
        <div>
            <input
                type="text"
                value={searchMusic}
                onChange={e => setSearchMusic(e.target.value)}
                placeholder="Search by artist"
            />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {results.map(item => (
                    <li key={item.id}>
                        {item.artist} - {item.title} ({item.duration})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MusicSearch;
