'use client';
import { useState, useRef } from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { WatchlistItem } from '@/lib/types';
import StatsBar from '@/components/StatsBar';
import WatchlistGrid from '@/components/WatchlistGrid';
import QuickAccess from '@/components/QuickAccess';
import AddShowModal from '@/components/AddShowModal';
import DetailModal from '@/components/DetailModal';

export default function HomePage() {
    const {
        items, filtered, stats, allGenres,
        searchTerm, setSearchTerm,
        statusFilter, setStatusFilter,
        genreFilter, setGenreFilter,
        addItem, deleteItem, editItem,
        toggleWatchStatus, addSeason, deleteSeason,
        resetAll, importData, mounted,
    } = useWatchlist();

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState<WatchlistItem | null>(null);
    const [detailItem, setDetailItem] = useState<WatchlistItem | null>(null);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const rankingIds = JSON.parse(localStorage.getItem('watchlistRankings') || '[]');
        const rankingsWithNames = rankingIds.map((id: string) => {
            const item = items.find(w => w.id === id);
            return { id, title: item ? item.title : 'Unknown' };
        });

        const exportData = {
            watchlistData: items,
            rankings: rankingsWithNames,
            leaderboardRankings: JSON.parse(localStorage.getItem('rankings') || '[]'),
            quickAccess: JSON.parse(localStorage.getItem('quickAccess') || '[]'),
            timestamp: new Date().toISOString()
        };
        const data = JSON.stringify(exportData, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'watchlist-backup.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target?.result as string);
                if (confirm('This will replace your current watchlist and rankings. Continue?')) {
                    // Write all keys directly to localStorage before calling importData
                    if (importedData.leaderboardRankings?.length) {
                        localStorage.setItem('rankings', JSON.stringify(importedData.leaderboardRankings));
                    }
                    if (importedData.quickAccess?.length) {
                        const qa = importedData.quickAccess.map((id: any) =>
                            typeof id === 'string' ? { itemId: id } : id
                        );
                        localStorage.setItem('quickAccess', JSON.stringify(qa));
                    }
                    if (importedData.rankings?.length) {
                        const rankingIds = importedData.rankings.map((r: any) =>
                            typeof r === 'string' ? r : r.id
                        );
                        localStorage.setItem('watchlistRankings', JSON.stringify(rankingIds));
                    }
                    importData(importedData);
                }
            } catch {
                alert('Invalid file format. Please select a valid JSON file.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleDelete = (id: string) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            deleteItem(itemToDelete);
            setItemToDelete(null);
        }
        setShowDeleteModal(false);
    };

    const handleEdit = (item: WatchlistItem) => {
        setEditingItem(item);
        setShowAddModal(true);
    };

    if (!mounted) {
        return <div className="container"><div style={{padding: '40px', textAlign: 'center', color: 'var(--silver)'}}>Loading...</div></div>;
    }

    return (
        <div className="container">
            <header>
                <h1>Watchly</h1>
                <p>Track, Organize, Discover</p>
                <div className="search-container">
                    <input
                        type="text"
                        id="searchInput"
                        placeholder="Search movies and shows..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="filters">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">ALL STATUS</option>
                            <option value="watched">WATCHED</option>
                            <option value="currently-watching">CURRENTLY WATCHING</option>
                            <option value="upcoming">UPCOMING</option>
                            <option value="pending">TO WATCH</option>
                        </select>
                        <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                            <option value="all">ALL GENRES</option>
                            {allGenres.map(genre => (
                                <option key={genre} value={genre}>{genre.toUpperCase()}</option>
                            ))}
                        </select>
                        <button className="add-btn" onClick={() => { setEditingItem(null); setShowAddModal(true); }}>
                            + Add Show
                        </button>
                        <button className="add-btn" onClick={handleExport}>Export</button>
                        <button className="add-btn" onClick={() => fileInputRef.current?.click()}>Import</button>
                        <input type="file" ref={fileInputRef} accept=".json" style={{display: 'none'}} onChange={handleImport} />
                        <button className="reset-btn" onClick={() => setShowResetModal(true)}>Reset All</button>
                    </div>
                </div>
            </header>

            <main>
                <StatsBar total={stats.total} watched={stats.watched} upcoming={stats.upcoming} />
                <QuickAccess items={items} onItemClick={setDetailItem} />
                <div className="watchlist" id="watchlist">
                    <WatchlistGrid items={filtered} onItemClick={setDetailItem} />
                </div>
            </main>

            {showAddModal && (
                <AddShowModal
                    onClose={() => { setShowAddModal(false); setEditingItem(null); }}
                    onAdd={addItem}
                    editItem={editingItem}
                    onEdit={editItem}
                />
            )}

            {detailItem && (
                <DetailModal
                    item={items.find(i => i.id === detailItem.id) || detailItem}
                    onClose={() => setDetailItem(null)}
                    onDelete={handleDelete}
                    onToggleStatus={toggleWatchStatus}
                    onAddSeason={addSeason}
                    onDeleteSeason={deleteSeason}
                    onEdit={handleEdit}
                />
            )}

            {showDeleteModal && (
                <div className="modal" style={{display: 'block'}}>
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowDeleteModal(false)}>&times;</span>
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete this item?</p>
                        <div className="modal-actions">
                            <button className="delete-btn" onClick={confirmDelete}>Delete</button>
                            <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showResetModal && (
                <div className="modal" style={{display: 'block'}}>
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowResetModal(false)}>&times;</span>
                        <h2>Reset All Data</h2>
                        <p>This will permanently delete ALL items from your watchlist. This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="delete-btn" onClick={() => { resetAll(); setShowResetModal(false); }}>Reset All</button>
                            <button className="cancel-btn" onClick={() => setShowResetModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
