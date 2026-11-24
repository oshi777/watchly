'use client';
import { useState, useRef, useEffect } from 'react';
import { searchTmdb, getTmdbDetail, TMDB_IMAGE_BASE } from '@/lib/tmdb';
import { WatchlistItem, WatchStatus, TMDBResult } from '@/lib/types';

interface AddShowModalProps {
    onClose: () => void;
    onAdd: (item: Omit<WatchlistItem, 'id' | 'section'>) => void;
    editItem?: WatchlistItem | null;
    onEdit?: (id: string, updates: Omit<WatchlistItem, 'id' | 'section'>) => void;
}

export default function AddShowModal({ onClose, onAdd, editItem, onEdit }: AddShowModalProps) {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState<WatchStatus>('pending');
    const [genres, setGenres] = useState('');
    const [date, setDate] = useState('');
    const [year, setYear] = useState('');
    const [note, setNote] = useState('');
    const [isMovie, setIsMovie] = useState(false);
    const [tmdbResults, setTmdbResults] = useState<TMDBResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPoster, setSelectedPoster] = useState<string | null>(null);
    const [selectedTmdbId, setSelectedTmdbId] = useState<number | null>(null);
    const [selectedOverview, setSelectedOverview] = useState<string>('');
    const [dateType, setDateType] = useState<'full' | 'year'>('full');
    const [dateYear, setDateYear] = useState('');
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isEditing = !!editItem;

    useEffect(() => {
        if (editItem) {
            setTitle(editItem.title);
            setStatus(editItem.status);
            setGenres(editItem.genres.join(', '));
            setNote(editItem.note || '');
            setYear(editItem.year || '');
            setIsMovie(editItem.isMovie || false);
            setSelectedPoster(editItem.poster || null);
            setSelectedOverview(editItem.overview || '');

            // Handle date
            if (editItem.date && editItem.status === 'watched') {
                if (/^\d{4}$/.test(editItem.date)) {
                    setDateType('year');
                    setDateYear(editItem.date);
                } else {
                    setDateType('full');
                    const dateParts = editItem.date.split(' ');
                    if (dateParts.length >= 3) {
                        const monthMap: { [key: string]: number } = {Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
                        const month = dateParts[0];
                        const day = dateParts[1].replace(',', '');
                        const yr = dateParts[2];
                        const monthNum = monthMap[month] || 1;
                        setDate(`${yr}-${monthNum.toString().padStart(2, '0')}-${day.padStart(2, '0')}`);
                    }
                }
            }
        }
    }, [editItem]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (value: string) => {
        setTitle(value);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        if (value.trim().length < 2) {
            setShowDropdown(false);
            return;
        }
        searchTimer.current = setTimeout(async () => {
            const results = await searchTmdb(value.trim());
            setTmdbResults(results);
            setShowDropdown(true);
        }, 400);
    };

    const selectTmdbResult = async (result: TMDBResult) => {
        const titleName = result.title || result.name || '';
        const releaseDate = result.release_date || result.first_air_date || '';
        const yearStr = releaseDate ? releaseDate.split('-')[0] : '';

        setTitle(titleName);
        setYear(yearStr);
        setIsMovie(result.media_type === 'movie');
        setSelectedTmdbId(result.id);

        if (result.poster_path) {
            setSelectedPoster(TMDB_IMAGE_BASE + result.poster_path);
        }

        try {
            const detail = await getTmdbDetail(result.id, result.media_type);
            if (detail.genres && detail.genres.length > 0) {
                setGenres(detail.genres.map(g => g.name).join(', '));
            }
            if (detail.overview) {
                setSelectedOverview(detail.overview);
                // Don't auto-fill notes with overview — keep notes empty
            }
        } catch (e) {
            // Ignore detail fetch errors
        }

        setShowDropdown(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const finalDate = dateType === 'year' ? dateYear :
            date ? new Date(date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            }) : '';

        const itemData = {
            title: title.trim(),
            status,
            genres: genres.split(',').map(g => g.trim()).filter(Boolean).sort(),
            year: year.trim(),
            date: finalDate || undefined,
            isMovie,
            tmdbId: selectedTmdbId || undefined,
            poster: selectedPoster,
            note: note.trim() || undefined,
            overview: selectedOverview || undefined,
            seasons: editItem?.seasons || [],
        };

        // Auto-set date if watched and no date
        if (status === 'watched' && !itemData.date) {
            itemData.date = new Date().toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        }

        if (isEditing && editItem && onEdit) {
            onEdit(editItem.id, itemData);
        } else {
            onAdd(itemData);
        }

        onClose();
    };

    return (
        <div className="modal" style={{display: 'block'}}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{isEditing ? 'Edit Show/Movie' : 'Add New Show/Movie'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="tmdb-search-wrapper" ref={dropdownRef}>
                        <input
                            type="text"
                            placeholder="Title — start typing to search TMDB"
                            value={title}
                            onChange={(e) => handleSearch(e.target.value)}
                            autoComplete="off"
                            required
                        />
                        {showDropdown && tmdbResults.length > 0 && (
                            <div className="tmdb-dropdown" style={{display: 'block'}}>
                                {tmdbResults.map((result) => {
                                    const name = result.title || result.name || '';
                                    const releaseDate = result.release_date || result.first_air_date || '';
                                    const yearStr = releaseDate ? releaseDate.split('-')[0] : '';
                                    const poster = result.poster_path ? TMDB_IMAGE_BASE + result.poster_path : '';
                                    return (
                                        <div
                                            key={result.id}
                                            className="tmdb-result-item"
                                            onClick={() => selectTmdbResult(result)}
                                        >
                                            {poster ? (
                                                <img src={poster} className="tmdb-thumb" alt={name} />
                                            ) : (
                                                <div className="tmdb-thumb tmdb-no-poster">?</div>
                                            )}
                                            <div className="tmdb-result-info">
                                                <div className="tmdb-result-title">{name}</div>
                                                <div className="tmdb-result-year">
                                                    {yearStr} • {result.media_type === 'movie' ? 'Movie' : 'TV Show'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="tmdb-attribution-dropdown">
                                    Data from <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">TMDB</a>
                                </div>
                            </div>
                        )}
                    </div>
                    <select value={status} onChange={(e) => setStatus(e.target.value as WatchStatus)}>
                        <option value="pending">To Watch</option>
                        <option value="currently-watching">Currently Watching</option>
                        <option value="watched">Watched</option>
                        <option value="upcoming">Upcoming</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Genres (comma separated)"
                        value={genres}
                        onChange={(e) => setGenres(e.target.value)}
                        required
                    />
                    <div className="date-input-group">
                        <div className="date-type-toggle">
                            <label>
                                <input type="radio" name="newDateType" value="full" checked={dateType === 'full'} onChange={() => setDateType('full')} />
                                Full Date
                            </label>
                            <label>
                                <input type="radio" name="newDateType" value="year" checked={dateType === 'year'} onChange={() => setDateType('year')} />
                                Year Only
                            </label>
                        </div>
                        {dateType === 'full' ? (
                            <input type="date" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
                        ) : (
                            <input type="number" placeholder="Year watched" min="1900" max="2100" value={dateYear} onChange={(e) => setDateYear(e.target.value)} />
                        )}
                    </div>
                    <input type="number" placeholder="Release Year (optional)" min="1900" max="2030" value={year} onChange={(e) => setYear(e.target.value)} />
                    <input type="text" placeholder="Notes (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
                    <label>
                        <input type="checkbox" checked={isMovie} onChange={(e) => setIsMovie(e.target.checked)} />
                        Movie
                    </label>
                    <button type="submit">{isEditing ? 'Update Item' : 'Add to Watchlist'}</button>
                </form>
            </div>
        </div>
    );
}
