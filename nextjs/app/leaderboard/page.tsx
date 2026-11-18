'use client';
import { useState, useEffect } from 'react';
import { WatchlistItem } from '@/lib/types';

export default function LeaderboardPage() {
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [rankings, setRankings] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('watchlistData');
            if (saved) setItems(JSON.parse(saved));
            const savedRankings = localStorage.getItem('rankings');
            if (savedRankings) setRankings(JSON.parse(savedRankings));
        } catch (e) {
            // ignore
        }
        setMounted(true);
    }, []);

    const saveRankings = (newRankings: string[]) => {
        setRankings(newRankings);
        localStorage.setItem('rankings', JSON.stringify(newRankings));
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const newRankings = [...rankings];
        [newRankings[index], newRankings[index - 1]] = [newRankings[index - 1], newRankings[index]];
        saveRankings(newRankings);
    };

    const moveDown = (index: number) => {
        if (index === rankings.length - 1) return;
        const newRankings = [...rankings];
        [newRankings[index], newRankings[index + 1]] = [newRankings[index + 1], newRankings[index]];
        saveRankings(newRankings);
    };

    const addToRanking = (itemId: string) => {
        if (rankings.includes(itemId)) return;
        saveRankings([...rankings, itemId]);
    };

    const removeFromRanking = (itemId: string) => {
        saveRankings(rankings.filter(id => id !== itemId));
    };

    if (!mounted) return <div className="container"><div style={{padding: '40px', textAlign: 'center', color: 'var(--silver)'}}>Loading...</div></div>;

    const rankedItems = rankings
        .map(id => items.find(i => i.id === id))
        .filter((i): i is WatchlistItem => i !== undefined);

    const unrankedItems = items.filter(i => !rankings.includes(i.id));

    return (
        <div className="container">
            <header>
                <h1>Leaderboard</h1>
                <p>Rank your favorite shows and movies</p>
            </header>
            <main style={{maxWidth: '800px', margin: '0 auto', padding: '0 20px 40px'}}>
                {rankedItems.length > 0 ? (
                    <div style={{marginBottom: '40px'}}>
                        <div className="section-header">Your Rankings</div>
                        {rankedItems.map((item, index) => (
                            <div key={item.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '16px',
                                background: 'var(--surface)',
                                borderRadius: '12px',
                                border: '1px solid rgba(195,199,206,0.08)',
                                marginBottom: '8px',
                            }}>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '900',
                                    color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'var(--silver)',
                                    minWidth: '40px',
                                    textAlign: 'center',
                                }}>
                                    #{index + 1}
                                </div>
                                {item.poster && (
                                    <img src={item.poster} alt={item.title} style={{width: '40px', height: '60px', borderRadius: '4px', objectFit: 'cover'}} />
                                )}
                                <div style={{flex: 1}}>
                                    <div style={{fontWeight: '700', color: 'var(--light)'}}>{item.title}</div>
                                    <div style={{fontSize: '0.85rem', color: 'var(--silver)'}}>
                                        {item.isMovie ? 'Movie' : 'TV Show'} • {item.year || ''}
                                    </div>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                                    <button
                                        className="qa-move-btn"
                                        disabled={index === 0}
                                        onClick={() => moveUp(index)}
                                    >▲</button>
                                    <button
                                        className="qa-move-btn"
                                        disabled={index === rankedItems.length - 1}
                                        onClick={() => moveDown(index)}
                                    >▼</button>
                                </div>
                                <button
                                    className="qa-remove-btn"
                                    onClick={() => removeFromRanking(item.id)}
                                >×</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-results" style={{marginBottom: '40px'}}>
                        No rankings yet. Add shows below to create your leaderboard.
                    </div>
                )}

                {unrankedItems.length > 0 && (
                    <div>
                        <div className="section-header">Available Shows</div>
                        <div className="available-shows">
                            {unrankedItems.map(item => (
                                <div key={item.id} className="available-show-item">
                                    <div className="show-info">
                                        <span className="show-title">{item.title}</span>
                                        <span className="show-details">
                                            {item.isMovie ? 'Movie' : 'TV Show'} • {item.year || ''} • {item.genres?.join(', ') || ''}
                                        </span>
                                    </div>
                                    <button
                                        className="add-to-currently-btn"
                                        onClick={() => addToRanking(item.id)}
                                    >+ Rank</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
