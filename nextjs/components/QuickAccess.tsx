'use client';
import { useState, useEffect } from 'react';
import { WatchlistItem } from '@/lib/types';

interface QuickAccessProps {
    items: WatchlistItem[];
    onItemClick: (item: WatchlistItem) => void;
}

interface QuickAccessEntry {
    itemId: string;
}

const statusLabels: Record<string, string> = {
    'watched': 'Watched',
    'upcoming': 'Upcoming',
    'currently-watching': 'Currently Watching',
    'pending': 'To Watch',
};

export default function QuickAccess({ items, onItemClick }: QuickAccessProps) {
    const [quickAccess, setQuickAccess] = useState<QuickAccessEntry[]>([]);
    const [mounted, setMounted] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        try {
            const saved = localStorage.getItem('quickAccess');
            if (saved) {
                setQuickAccess(JSON.parse(saved));
            }
        } catch (e) {
            // ignore
        }
        setMounted(true);
    }, []);

    const saveQuickAccess = (qa: QuickAccessEntry[]) => {
        localStorage.setItem('quickAccess', JSON.stringify(qa));
        setQuickAccess(qa);
    };

    const addToQuickAccess = (itemId: string) => {
        if (quickAccess.some(qa => qa.itemId === itemId)) return;
        const updated = [...quickAccess, { itemId }];
        saveQuickAccess(updated);
    };

    const removeFromQuickAccess = (itemId: string) => {
        const updated = quickAccess.filter(qa => qa.itemId !== itemId);
        saveQuickAccess(updated);
    };

    const moveQuickAccess = (itemId: string, direction: 'up' | 'down') => {
        const index = quickAccess.findIndex(qa => qa.itemId === itemId);
        if (index < 0) return;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= quickAccess.length) return;
        const updated = [...quickAccess];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        saveQuickAccess(updated);
    };

    const quickAccessItems = quickAccess
        .map(qa => items.find(i => i.id === qa.itemId))
        .filter((i): i is WatchlistItem => i !== undefined);

    const availableShows = items.filter(item =>
        !quickAccess.some(qa => qa.itemId === item.id) &&
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!mounted) return null;

    return (
        <>
            <div className="currently-watching-section" id="currentlyWatchingSection">
                <div className="section-header">
                    <h2>Quick Access</h2>
                    <p className="section-subtitle">Pin shows and movies for quick access</p>
                    <button
                        className="add-btn"
                        style={{marginLeft: 'auto'}}
                        onClick={() => setShowManageModal(true)}
                    >
                        + Add from List
                    </button>
                </div>
                {quickAccessItems.length > 0 ? (
                    <div className="currently-watching-grid">
                        {quickAccessItems.map((item) => {
                            const statusClass = item.status === 'watched' ? 'watched' :
                                item.status === 'upcoming' ? 'upcoming' :
                                item.status === 'currently-watching' ? 'currently-watching' : 'pending';

                            return (
                                <div key={item.id} className="currently-watching-card" onClick={() => onItemClick(item)}>
                                    {item.poster ? (
                                        <div className="currently-watching-item" style={{padding: 0, overflow: 'hidden', position: 'relative', aspectRatio: '2/3', cursor: 'pointer'}}>
                                            <img src={item.poster} alt={item.title} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px'}} />
                                            <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 12px 10px', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 55%, transparent)', borderRadius: '0 0 12px 12px'}}>
                                                <div style={{fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{item.title}</div>
                                                <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                                    <span className={`item-poster-status ${statusClass}`} style={{fontSize: '0.6rem'}}>{statusLabels[item.status]}</span>
                                                    {item.year && <span style={{fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)'}}>{item.year}</span>}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFromQuickAccess(item.id); }}
                                                style={{
                                                    position: 'absolute', top: '6px', right: '6px',
                                                    background: 'rgba(0,0,0,0.7)', color: '#fff',
                                                    border: 'none', borderRadius: '50%',
                                                    width: '24px', height: '24px', cursor: 'pointer',
                                                    fontSize: '0.8rem', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                }}
                                            >×</button>
                                        </div>
                                    ) : (
                                        <div className="currently-watching-item" style={{padding: 0, overflow: 'hidden', position: 'relative', aspectRatio: '2/3', cursor: 'pointer', borderRadius: '12px', background: 'linear-gradient(135deg, #222326 0%, #2a2d35 50%, #222326 100%)'}}>
                                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60%'}}>
                                                <div style={{fontSize: '3rem', fontWeight: 800, color: 'rgba(195,199,206,0.15)'}}>{item.title.charAt(0).toUpperCase()}</div>
                                            </div>
                                            <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 12px 10px', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 55%, transparent)'}}>
                                                <div style={{fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{item.title}</div>
                                                <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                                    <span className={`item-poster-status ${statusClass}`} style={{fontSize: '0.6rem'}}>{statusLabels[item.status]}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFromQuickAccess(item.id); }}
                                                style={{
                                                    position: 'absolute', top: '6px', right: '6px',
                                                    background: 'rgba(0,0,0,0.7)', color: '#fff',
                                                    border: 'none', borderRadius: '50%',
                                                    width: '24px', height: '24px', cursor: 'pointer',
                                                    fontSize: '0.8rem', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                }}
                                            >×</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="currently-watching-empty">
                        <div className="empty-icon">🎬</div>
                        <h3>Nothing Pinned Yet</h3>
                        <p>Add shows from your watchlist to pin them here for quick access.</p>
                        <div className="empty-actions">
                            <button className="add-btn" onClick={() => setShowManageModal(true)}>
                                Add from List
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showManageModal && (
                <div className="modal" style={{display: 'block'}}>
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowManageModal(false)}>&times;</span>
                        <h2>Manage Quick Access</h2>
                        <p style={{marginBottom: '20px', color: 'var(--silver)'}}>
                            Reorder or remove items. Add more shows from your list below.
                        </p>

                        {quickAccessItems.length > 0 && (
                            <div style={{marginBottom: '25px'}}>
                                <h3 style={{fontSize: '1rem', color: 'var(--silver)', marginBottom: '10px'}}>
                                    Current Quick Access Items
                                </h3>
                                <div id="currentQuickAccessItems" style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                    {quickAccessItems.map((item, index) => (
                                        <div key={item.id} className="qa-modal-item">
                                            <div className="qa-reorder-buttons">
                                                <button
                                                    className="qa-move-btn"
                                                    disabled={index === 0}
                                                    onClick={() => moveQuickAccess(item.id, 'up')}
                                                >▲</button>
                                                <button
                                                    className="qa-move-btn"
                                                    disabled={index === quickAccessItems.length - 1}
                                                    onClick={() => moveQuickAccess(item.id, 'down')}
                                                >▼</button>
                                            </div>
                                            <div className="qa-item-info">
                                                <div className="qa-item-title">{item.title}</div>
                                                <div className="qa-item-meta">
                                                    {item.isMovie ? 'Movie' : 'TV Show'} • {item.year || ''}
                                                </div>
                                            </div>
                                            <button
                                                className="qa-remove-btn"
                                                onClick={() => removeFromQuickAccess(item.id)}
                                            >×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {quickAccessItems.length > 0 && (
                            <hr style={{border: 'none', borderTop: '1px solid rgba(195,199,206,0.15)', margin: '25px 0'}} />
                        )}

                        <h3 style={{fontSize: '1rem', color: 'var(--silver)', marginBottom: '15px'}}>Add More Shows</h3>
                        <div className="search-filter">
                            <input
                                type="text"
                                placeholder="Search your watchlist..."
                                style={{marginBottom: '15px'}}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="available-shows">
                            {availableShows.length === 0 ? (
                                <p style={{textAlign: 'center', color: 'var(--silver)', padding: '40px'}}>
                                    {items.length === 0
                                        ? 'No shows in your watchlist yet. Add some shows first!'
                                        : 'All your shows are already pinned!'}
                                </p>
                            ) : (
                                availableShows.map(item => (
                                    <div key={item.id} className="available-show-item">
                                        <div className="show-info">
                                            <span className="show-title">{item.title}</span>
                                            <span className="show-details">
                                                {item.isMovie ? 'Movie' : 'TV Show'} • {item.year || ''} • {item.genres?.join(', ') || ''}
                                            </span>
                                        </div>
                                        <button
                                            className="add-to-currently-btn"
                                            onClick={() => addToQuickAccess(item.id)}
                                        >+ Add</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
