'use client';
import { useState } from 'react';
import { WatchlistItem, WatchStatus, Season } from '@/lib/types';

interface DetailModalProps {
    item: WatchlistItem | null;
    onClose: () => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string) => void;
    onAddSeason: (id: string, season: Season) => void;
    onDeleteSeason: (id: string, seasonIndex: number) => void;
    onEdit: (item: WatchlistItem) => void;
}

const statusLabels: Record<string, string> = {
    'watched': 'Watched',
    'upcoming': 'Upcoming',
    'currently-watching': 'Currently Watching',
    'pending': 'To Watch',
};

export default function DetailModal({ item, onClose, onDelete, onToggleStatus, onAddSeason, onDeleteSeason, onEdit }: DetailModalProps) {
    const [showSeasonModal, setShowSeasonModal] = useState(false);
    const [seasonNumber, setSeasonNumber] = useState('');
    const [seasonDateType, setSeasonDateType] = useState<'full' | 'year'>('full');
    const [seasonDate, setSeasonDate] = useState('');
    const [seasonDateYear, setSeasonDateYear] = useState('');
    const [editingSeasonIndex, setEditingSeasonIndex] = useState<number | null>(null);

    if (!item) return null;

    const statusClass = item.status === 'watched' ? 'watched' :
        item.status === 'upcoming' ? 'upcoming' :
        item.status === 'currently-watching' ? 'currently-watching' : 'pending';

    const handleSeasonSubmit = () => {
        if (!seasonDate) return;
        if (!seasonNumber && !item.isMovie) return;

        const formattedDate = seasonDateType === 'year'
            ? seasonDateYear
            : new Date(seasonDate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

        const seasonData: Season = { date: formattedDate };
        if (seasonNumber) seasonData.season = parseInt(seasonNumber);

        if (editingSeasonIndex !== null) {
            // Replace existing season
            const newSeasons = [...(item.seasons || [])];
            newSeasons[editingSeasonIndex] = seasonData;
            // Use addSeason which will replace by matching season number
            onAddSeason(item.id, seasonData);
        } else {
            onAddSeason(item.id, seasonData);
        }

        // Reset and close
        setShowSeasonModal(false);
        setSeasonNumber('');
        setSeasonDate('');
        setSeasonDateYear('');
        setEditingSeasonIndex(null);
    };

    const openAddSeason = () => {
        setEditingSeasonIndex(null);
        setSeasonNumber('');
        setSeasonDate('');
        setSeasonDateYear('');
        setSeasonDateType('full');
        setShowSeasonModal(true);
    };

    const openEditSeason = (index: number) => {
        const season = item.seasons![index];
        setEditingSeasonIndex(index);
        setSeasonNumber(season.season ? String(season.season) : '');
        if (/^\d{4}$/.test(season.date)) {
            setSeasonDateType('year');
            setSeasonDateYear(season.date);
            setSeasonDate('');
        } else {
            setSeasonDateType('full');
            const dateParts = season.date.split(' ');
            if (dateParts.length >= 3) {
                const monthMap: { [key: string]: number } = {Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
                const month = dateParts[0];
                const day = dateParts[1].replace(',', '');
                const year = dateParts[2];
                const monthNum = monthMap[month] || 1;
                setSeasonDate(`${year}-${monthNum.toString().padStart(2, '0')}-${day.padStart(2, '0')}`);
            }
            setSeasonDateYear('');
        }
        setShowSeasonModal(true);
    };

    return (
        <>
            <div className="modal" style={{display: 'block'}}>
                <div className="detail-modal-content">
                    <div className="detail-layout">
                        <div className="detail-poster-col">
                            {item.poster ? (
                                <img src={item.poster} alt={item.title} className="detail-poster-img" />
                            ) : (
                                <div className="detail-poster-placeholder">
                                    <span>{item.title.charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                        <div className="detail-info-col">
                            <div className="detail-topbar">
                                <div className="detail-topbar-badges">
                                    <span className={`item-poster-status ${statusClass}`}>
                                        {statusLabels[item.status]}
                                    </span>
                                    <span className="detail-type-badge">
                                        {item.isMovie ? 'Movie' : 'TV Show'}
                                    </span>
                                </div>
                                <button className="detail-close" onClick={onClose}>Close</button>
                            </div>
                            <h2 className="detail-title">{item.title}</h2>
                            <div className="detail-meta">
                                {[item.date, item.year ? `Release: ${item.year}` : ''].filter(Boolean).join(' · ')}
                            </div>
                            {item.overview && (
                                <div className="detail-overview">{item.overview}</div>
                            )}
                            {item.note && (
                                <div className="detail-note">{item.note}</div>
                            )}
                            <div className="detail-genres">
                                {(item.genres || []).sort().map((genre, i) => (
                                    <span key={i} className="genre-tag">{genre}</span>
                                ))}
                            </div>
                            {item.seasons && item.seasons.length > 0 && (
                                <div className="detail-seasons">
                                    <strong>{item.isMovie ? 'Movies:' : 'Seasons:'}</strong>{' '}
                                    {item.seasons.map((s, i) => (
                                        <span key={i}>
                                            <span
                                                className="season-item"
                                                style={{cursor: 'pointer'}}
                                                onClick={() => openEditSeason(i)}
                                            >
                                                {item.isMovie ? (s.season ? `M${s.season}` : 'Movie') : `S${s.season}`} ({s.date})
                                            </span>
                                            {i < item.seasons!.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="detail-actions">
                                <button
                                    className={`action-btn ${item.status === 'watched' ? 'watched' : ''}`}
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleStatus(item.id); }}
                                >
                                    {item.status === 'watched' ? 'Mark Unwatched' : 'Mark Watched'}
                                </button>
                                <button
                                    className="action-btn"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); openAddSeason(); }}
                                >
                                    {item.isMovie ? 'Add Movie' : 'Add Season'}
                                </button>
                                <button
                                    className="action-btn"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(item); onClose(); }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="action-btn"
                                    style={{background: 'rgba(255,68,68,0.15)', borderColor: 'rgba(255,68,68,0.3)'}}
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(item.id); onClose(); }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Season Modal */}
            {showSeasonModal && (
                <div className="modal" style={{display: 'block', zIndex: 1100}}>
                    <div className="modal-content">
                        <span className="close" onClick={() => { setShowSeasonModal(false); setEditingSeasonIndex(null); }}>&times;</span>
                        <h2>{item.isMovie ? (editingSeasonIndex !== null ? 'Edit Movie' : 'Add Movie Completion') : (editingSeasonIndex !== null ? 'Edit Season' : 'Add Season Completion')}</h2>
                        <p id="seasonTitle">{item.isMovie ? 'Add movie for' : 'Add season for'}: {item.title}</p>
                        <input
                            type="number"
                            placeholder={item.isMovie ? 'Movie Number' : 'Season Number'}
                            min="1"
                            value={seasonNumber}
                            onChange={(e) => setSeasonNumber(e.target.value)}
                            required={!item.isMovie}
                        />
                        <div className="date-input-group">
                            <div className="date-type-toggle">
                                <label>
                                    <input
                                        type="radio"
                                        name="seasonDateType"
                                        value="full"
                                        checked={seasonDateType === 'full'}
                                        onChange={() => setSeasonDateType('full')}
                                    />
                                    Full Date
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="seasonDateType"
                                        value="year"
                                        checked={seasonDateType === 'year'}
                                        onChange={() => setSeasonDateType('year')}
                                    />
                                    Year Only
                                </label>
                            </div>
                            {seasonDateType === 'full' ? (
                                <input
                                    type="date"
                                    value={seasonDate}
                                    onChange={(e) => setSeasonDate(e.target.value)}
                                />
                            ) : (
                                <input
                                    type="number"
                                    placeholder="Year"
                                    min="1900"
                                    max="2100"
                                    value={seasonDateYear}
                                    onChange={(e) => setSeasonDateYear(e.target.value)}
                                />
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="delete-btn" onClick={handleSeasonSubmit}>
                                {item.isMovie ? (editingSeasonIndex !== null ? 'Update Movie' : 'Add Movie') : (editingSeasonIndex !== null ? 'Update Season' : 'Add Season')}
                            </button>
                            {editingSeasonIndex !== null && (
                                <button
                                    className="delete-btn"
                                    style={{background: 'linear-gradient(135deg, #ff4444, #cc0000)'}}
                                    onClick={() => {
                                        onDeleteSeason(item.id, editingSeasonIndex);
                                        setShowSeasonModal(false);
                                        setEditingSeasonIndex(null);
                                    }}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
