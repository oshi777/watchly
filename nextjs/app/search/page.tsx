'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { TMDB_IMAGE_BASE } from '@/lib/tmdb';
import { WatchlistItem, WatchStatus } from '@/lib/types';

const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YTgzYTQ5NWFiMTg0ZGQzMjEzYmVjMjVkMzE2MDc3NiIsIm5iZiI6MTc0OTk1NDQ3Ni44MTcsInN1YiI6IjY4NGUyZmFjNGEzZTQ0Y2Y2ODI5NGM2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OGP__W2OeeziBS4zsFtFWxcqnSwb7-IZ_7XUGGLGcGE';
const IMG_BASE = 'https://image.tmdb.org/t/p/w342';
const IMG_FULL = 'https://image.tmdb.org/t/p/w500';

const MOVIE_GENRES = [
    {id:28,name:'Action'},{id:12,name:'Adventure'},{id:16,name:'Animation'},
    {id:35,name:'Comedy'},{id:80,name:'Crime'},{id:99,name:'Documentary'},
    {id:18,name:'Drama'},{id:10751,name:'Family'},{id:14,name:'Fantasy'},
    {id:36,name:'History'},{id:27,name:'Horror'},{id:10402,name:'Music'},
    {id:9648,name:'Mystery'},{id:10749,name:'Romance'},{id:878,name:'Science Fiction'},
    {id:10770,name:'TV Movie'},{id:53,name:'Thriller'},{id:10752,name:'War'},{id:37,name:'Western'}
];
const TV_GENRES = [
    {id:10759,name:'Action & Adventure'},{id:16,name:'Animation'},{id:35,name:'Comedy'},
    {id:80,name:'Crime'},{id:99,name:'Documentary'},{id:18,name:'Drama'},
    {id:10751,name:'Family'},{id:10762,name:'Kids'},{id:9648,name:'Mystery'},
    {id:10763,name:'News'},{id:10764,name:'Reality'},{id:10765,name:'Sci-Fi & Fantasy'},
    {id:10766,name:'Soap'},{id:10767,name:'Talk'},{id:10768,name:'War & Politics'},{id:37,name:'Western'}
];

interface BrowseResult {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    release_date?: string;
    first_air_date?: string;
    media_type?: string;
    vote_average?: number;
}

interface BrowseDetail {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    overview?: string;
    genres: { id: number; name: string }[];
    release_date?: string;
    first_air_date?: string;
    vote_average?: number;
    runtime?: number;
    number_of_seasons?: number;
    status?: string;
}

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [type, setType] = useState('multi');
    const [sort, setSort] = useState('popularity.desc');
    const [genre, setGenre] = useState('');
    const [year, setYear] = useState('');
    const [rating, setRating] = useState('');
    const [results, setResults] = useState<BrowseResult[]>([]);
    const [status, setStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [detailItem, setDetailItem] = useState<BrowseDetail | null>(null);
    const [detailType, setDetailType] = useState('movie');
    const [toast, setToast] = useState('');
    const [watchlistTitles, setWatchlistTitles] = useState<Set<string>>(new Set());
    const [mounted, setMounted] = useState(false);
    const browseInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
        try {
            const data = JSON.parse(localStorage.getItem('watchlistData') || '[]');
            setWatchlistTitles(new Set(data.map((i: WatchlistItem) => i.title.toLowerCase())));
        } catch { /* ignore */ }

        // Check URL param
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        if (q) {
            setQuery(q);
            doSearch(q, 1, type, sort, genre, year, rating);
        } else {
            doSearch('', 1, type, sort, genre, year, rating);
        }
    }, []);

    const getWatchlistIndex = () => {
        try {
            const data = JSON.parse(localStorage.getItem('watchlistData') || '[]');
            const posters = new Set<string>();
            const titleYear = new Set<string>();
            data.forEach((i: WatchlistItem) => {
                if (i.poster) {
                    const path = i.poster.replace(IMG_BASE, '').replace(IMG_FULL, '');
                    posters.add(path);
                } else {
                    titleYear.add((i.title + '|' + (i.year || '')).toLowerCase());
                }
            });
            return { posters, titleYear };
        } catch { return { posters: new Set<string>(), titleYear: new Set<string>() }; }
    };

    const isInWatchlist = (posterPath: string | null, title: string, yr: string) => {
        const { posters, titleYear } = getWatchlistIndex();
        if (posterPath) return posters.has(posterPath);
        return titleYear.has((title + '|' + (yr || '')).toLowerCase());
    };

    const buildEndpoint = (q: string, page: number, t: string, s: string, g: string, y: string, r: string) => {
        const headers = { 'Authorization': `Bearer ${TMDB_TOKEN}` };
        if (q.trim()) {
            const searchType = t === 'multi' ? 'multi' : t;
            let url = `https://api.themoviedb.org/3/search/${searchType}?query=${encodeURIComponent(q)}&page=${page}`;
            if (y) url += `&year=${y}`;
            return url;
        } else {
            const discoverType = t === 'multi' ? 'movie' : t;
            let url = `https://api.themoviedb.org/3/discover/${discoverType}?sort_by=${s}&page=${page}`;
            if (g) url += `&with_genres=${g}`;
            if (y) {
                if (discoverType === 'movie') url += `&primary_release_year=${y}`;
                else url += `&first_air_date_year=${y}`;
            }
            if (r) url += `&vote_average.gte=${r}&vote_count.gte=100`;
            return url;
        }
    };

    const doSearch = useCallback(async (q: string, page: number, t: string, s: string, g: string, y: string, r: string) => {
        setStatus('Searching…');
        setResults([]);
        setLoading(true);
        try {
            const res = await fetch(buildEndpoint(q, page, t, s, g, y, r), {
                headers: { 'Authorization': `Bearer ${TMDB_TOKEN}` }
            });
            const data = await res.json();
            const filtered = (data.results || []).filter((r: BrowseResult) => r.media_type !== 'person');
            setTotalPages(Math.min(data.total_pages || 1, 500));
            const total = data.total_results || filtered.length;
            setStatus(total ? `${total.toLocaleString()} results` : 'No results found');
            setResults(filtered);
        } catch {
            setStatus('Search failed. Check connection.');
        }
        setLoading(false);
    }, []);

    const handleSearch = () => {
        setCurrentPage(1);
        doSearch(query, 1, type, sort, genre, year, rating);
    };

    const handleTypeChange = (newType: string) => {
        setType(newType);
        setGenre('');
        setCurrentPage(1);
        doSearch(query, 1, newType, sort, '', year, rating);
    };

    const handleSortChange = (newSort: string) => {
        setSort(newSort);
        setCurrentPage(1);
        doSearch(query, 1, type, newSort, genre, year, rating);
    };

    const handleGenreChange = (newGenre: string) => {
        setGenre(newGenre);
        setCurrentPage(1);
        doSearch(query, 1, type, sort, newGenre, year, rating);
    };

    const handleYearChange = (newYear: string) => {
        setYear(newYear);
        setCurrentPage(1);
        doSearch(query, 1, type, sort, genre, newYear, rating);
    };

    const handleRatingChange = (newRating: string) => {
        setRating(newRating);
        setCurrentPage(1);
        doSearch(query, 1, type, sort, genre, year, newRating);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        doSearch(query, page, type, sort, genre, year, rating);
        window.scrollTo(0, 0);
    };

    const openDetail = async (id: number, itemType: string) => {
        try {
            const endpoint = itemType === 'movie'
                ? `https://api.themoviedb.org/3/movie/${id}`
                : `https://api.themoviedb.org/3/tv/${id}`;
            const res = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${TMDB_TOKEN}` } });
            const d: BrowseDetail = await res.json();
            setDetailType(itemType);
            setDetailItem(d);
        } catch { /* ignore */ }
    };

    const addToWatchlist = (itemStatus: WatchStatus) => {
        if (!detailItem) return;
        const d = detailItem;
        const title = d.title || d.name || '';
        const yr = (d.release_date || d.first_air_date || '').slice(0, 4);
        const genres = (d.genres || []).map(g => g.name).sort();
        const poster = d.poster_path ? IMG_BASE + d.poster_path : null;
        const overview = d.overview || '';
        const isMovie = detailType === 'movie';
        const sectionChar = title.charAt(0).toUpperCase();
        const sectionKey = /[0-9]/.test(sectionChar) ? '0-9' : sectionChar;

        // Auto-set date if watched
        let date: string | undefined;
        if (itemStatus === 'watched') {
            date = new Date().toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        }

        const watchlist: WatchlistItem[] = JSON.parse(localStorage.getItem('watchlistData') || '[]');

        // Check if item already exists (by poster path or title+year)
        const existingIndex = watchlist.findIndex(item => {
            if (poster && item.poster) {
                const existingPath = item.poster.replace(IMG_BASE, '').replace(IMG_FULL, '');
                const newPath = poster.replace(IMG_BASE, '').replace(IMG_FULL, '');
                return existingPath === newPath;
            }
            return item.title.toLowerCase() === title.toLowerCase() &&
                   (item.year || '') === (yr || '');
        });

        if (existingIndex >= 0) {
            // Overwrite existing entry with new data + addedAt timestamp
            watchlist[existingIndex] = {
                ...watchlist[existingIndex],
                title, status: itemStatus,
                genres, section: sectionKey,
                isMovie,
                year: yr || undefined,
                overview: overview || undefined,
                poster: poster || undefined,
                date,
                addedAt: Date.now(),
            };
        } else {
            // Create new entry
            watchlist.push({
                id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                title, status: itemStatus,
                genres, section: sectionKey,
                isMovie, seasons: [],
                year: yr || undefined,
                overview: overview || undefined,
                poster: poster || undefined,
                date,
                addedAt: Date.now(),
            });
        }

        localStorage.setItem('watchlistData', JSON.stringify(watchlist));
        localStorage.setItem('dataChanged', 'true');

        setToast(`"${title}" ${existingIndex >= 0 ? 'updated in' : 'added to'} watchlist`);
        setTimeout(() => setToast(''), 2500);
        setDetailItem(null);

        // Refresh results to show "Added" badge
        doSearch(query, currentPage, type, sort, genre, year, rating);
    };

    const genres = type === 'movie' ? MOVIE_GENRES : (type === 'tv' ? TV_GENRES : MOVIE_GENRES);

    if (!mounted) return <div className="container"><div style={{padding: '40px', textAlign: 'center', color: 'var(--silver)'}}>Loading...</div></div>;

    return (
        <div className="container">
            <header>
                <h1>Browse</h1>
                <p>Search TMDB and add anything to your watchlist</p>
                <div className="tmdb-search-attribution">
                    Movie & TV data provided by <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">The Movie Database (TMDB)</a>
                </div>
            </header>

            <main>
                {/* Search bar + filters */}
                <div className="browse-controls">
                    <div className="browse-search-row">
                        <input
                            type="text"
                            ref={browseInputRef}
                            placeholder="Search movies, TV shows..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                            autoComplete="off"
                        />
                        <button className="add-btn" onClick={handleSearch}>Search</button>
                    </div>
                    <div className="browse-filters">
                        <div className="filter-group">
                            <label>Type</label>
                            <div className="pill-row">
                                <button className={`pill ${type === 'multi' ? 'active' : ''}`} onClick={() => handleTypeChange('multi')}>All</button>
                                <button className={`pill ${type === 'movie' ? 'active' : ''}`} onClick={() => handleTypeChange('movie')}>Movies</button>
                                <button className={`pill ${type === 'tv' ? 'active' : ''}`} onClick={() => handleTypeChange('tv')}>TV Shows</button>
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Sort By</label>
                            <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
                                <option value="popularity.desc">Most Popular</option>
                                <option value="vote_average.desc">Top Rated</option>
                                <option value="release_date.desc">Newest</option>
                                <option value="release_date.asc">Oldest</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Genre</label>
                            <select value={genre} onChange={(e) => handleGenreChange(e.target.value)}>
                                <option value="">All Genres</option>
                                {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Year</label>
                            <input type="number" placeholder="e.g. 2023" min="1900" max="2030" value={year} onChange={(e) => handleYearChange(e.target.value)} />
                        </div>
                        <div className="filter-group">
                            <label>Min Rating</label>
                            <select value={rating} onChange={(e) => handleRatingChange(e.target.value)}>
                                <option value="">Any</option>
                                <option value="9">9+</option>
                                <option value="8">8+</option>
                                <option value="7">7+</option>
                                <option value="6">6+</option>
                                <option value="5">5+</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="browse-status">{status}</div>

                {/* Grid */}
                <div className="browse-grid">
                    {results.map(r => {
                        const title = r.title || r.name || '';
                        const yr = (r.release_date || r.first_air_date || '').slice(0, 4);
                        const itemType = r.media_type === 'tv' || (r.name && !r.title) ? 'tv' : 'movie';
                        const rt = r.vote_average ? r.vote_average.toFixed(1) : '';
                        const added = isInWatchlist(r.poster_path || null, title, yr);

                        return (
                            <div key={r.id} className="browse-card" onClick={() => openDetail(r.id, itemType)}>
                                {r.poster_path ? (
                                    <img src={IMG_BASE + r.poster_path} alt={title} loading="lazy" />
                                ) : (
                                    <div className="browse-card-placeholder">{title.charAt(0)}</div>
                                )}
                                {added && <div className="browse-card-added">Added</div>}
                                <div className="browse-card-footer">
                                    <div className="browse-card-title">{title}</div>
                                    <div className="browse-card-meta">
                                        <span className="browse-card-type">{itemType === 'movie' ? 'Movie' : 'TV'}</span>
                                        {yr && <span>{yr}</span>}
                                        {rt && <span className="browse-card-rating">★ {rt}</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="browse-pagination">
                        <button disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}>← Prev</button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const start = Math.max(1, currentPage - 2);
                            const p = start + i;
                            if (p > totalPages) return null;
                            return (
                                <button
                                    key={p}
                                    className={p === currentPage ? 'current-page' : ''}
                                    onClick={() => goToPage(p)}
                                >{p}</button>
                            );
                        })}
                        <button disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)}>Next →</button>
                    </div>
                )}
            </main>

            {/* Browse Detail Modal */}
            {detailItem && (
                <div className="modal" style={{display: 'block'}}>
                    <div className="bd-modal-wrap">
                        <div className="bd-layout">
                            <div className="bd-poster-col">
                                {detailItem.poster_path ? (
                                    <img src={IMG_FULL + detailItem.poster_path} alt="" className="bd-poster-img" />
                                ) : (
                                    <div className="bd-poster-ph">
                                        <span>{(detailItem.title || detailItem.name || '?').charAt(0).toUpperCase()}</span>
                                    </div>
                                )}
                            </div>
                            <div className="bd-info-col">
                                <div className="bd-topbar">
                                    <div className="bd-topbar-badges">
                                        <span className="bd-badge">{detailType === 'movie' ? 'Movie' : 'TV Show'}</span>
                                        <span className="bd-year">{(detailItem.release_date || detailItem.first_air_date || '').slice(0, 4)}</span>
                                    </div>
                                    <button className="bd-close-btn" onClick={() => setDetailItem(null)}>← Close</button>
                                </div>
                                <h2 className="bd-title">{detailItem.title || detailItem.name}</h2>
                                <p className="bd-meta">
                                    {[
                                        detailItem.vote_average ? `★ ${detailItem.vote_average.toFixed(1)}` : '',
                                        detailItem.runtime ? `${detailItem.runtime} min` : '',
                                        detailItem.number_of_seasons ? `${detailItem.number_of_seasons} seasons` : '',
                                        detailItem.status || ''
                                    ].filter(Boolean).join(' · ')}
                                </p>
                                <p className="bd-overview">{detailItem.overview || ''}</p>
                                <div className="bd-genres">
                                    {(detailItem.genres || []).map(g => (
                                        <span key={g.id} className="genre-tag">{g.name}</span>
                                    ))}
                                </div>
                                {(() => {
                                    const title = detailItem.title || detailItem.name || '';
                                    const yr = (detailItem.release_date || detailItem.first_air_date || '').slice(0, 4);
                                    const added = isInWatchlist(detailItem.poster_path, title, yr);
                                    if (added) {
                                        return <div className="bd-already" style={{display: 'block'}}>Already in your watchlist</div>;
                                    }
                                    return (
                                        <div className="bd-add-row">
                                            <span className="bd-add-label">Add as:</span>
                                            <button className="bd-add-btn" onClick={() => addToWatchlist('pending')}>To Watch</button>
                                            <button className="bd-add-btn" data-status="watched" onClick={() => addToWatchlist('watched')}>Watched</button>
                                            <button className="bd-add-btn" data-status="upcoming" onClick={() => addToWatchlist('upcoming')}>Upcoming</button>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '24px', left: '50%',
                    transform: 'translateX(-50%) translateY(0)',
                    background: 'var(--surface)', color: 'var(--light)',
                    border: '1px solid var(--silver)',
                    padding: '10px 24px', borderRadius: '8px',
                    fontWeight: 600, fontSize: '0.9rem', zIndex: 9999,
                }}>
                    {toast}
                </div>
            )}

            <style>{`
                .tmdb-search-attribution {
                    margin-top: 8px; font-size: 0.75rem;
                    color: var(--muted); text-align: center;
                }
                .tmdb-search-attribution a { color: var(--silver); text-decoration: none; }
                .tmdb-search-attribution a:hover { color: var(--light); }
                .browse-controls {
                    background: var(--surface);
                    border: 1px solid rgba(195,199,206,0.1);
                    border-radius: 14px; padding: 20px 24px;
                    margin-bottom: 28px;
                }
                .browse-search-row { display: flex; gap: 10px; margin-bottom: 16px; }
                .browse-search-row input {
                    flex: 1; padding: 12px 16px;
                    border: 1px solid rgba(195,199,206,0.2);
                    border-radius: 10px; background: var(--surface);
                    color: var(--light); font-size: 1rem; font-family: inherit;
                }
                .browse-search-row input:focus { outline: none; border-color: var(--silver); }
                .browse-search-row input::placeholder { color: var(--muted); }
                .browse-filters { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end; }
                .filter-group { display: flex; flex-direction: column; gap: 5px; }
                .filter-group label {
                    font-size: 0.72rem; font-weight: 600; color: var(--silver);
                    text-transform: uppercase; letter-spacing: 0.8px;
                }
                .filter-group select, .filter-group input[type="number"] {
                    padding: 8px 12px; border: 1px solid rgba(195,199,206,0.2);
                    border-radius: 8px; background: var(--surface); color: var(--light);
                    font-size: 0.88rem; font-family: inherit; cursor: pointer;
                }
                .filter-group input[type="number"] { width: 110px; }
                .filter-group select:focus, .filter-group input[type="number"]:focus {
                    outline: none; border-color: var(--silver);
                }
                .pill-row { display: flex; gap: 6px; }
                .pill {
                    padding: 6px 14px; border: 1px solid rgba(195,199,206,0.2);
                    border-radius: 20px; background: var(--surface); color: var(--silver);
                    font-size: 0.82rem; font-weight: 600; cursor: pointer;
                    transition: all 0.2s; font-family: inherit;
                }
                .pill:hover { border-color: var(--silver); color: var(--light); }
                .pill.active { background: var(--muted); border-color: var(--silver); color: var(--light); }
                .browse-status {
                    text-align: center; color: var(--silver);
                    font-size: 0.9rem; min-height: 24px; margin-bottom: 16px;
                }
                .browse-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 18px; margin-bottom: 32px;
                }
                .browse-card {
                    position: relative; aspect-ratio: 2/3; border-radius: 12px;
                    overflow: hidden; background: var(--surface); cursor: pointer;
                    border: 1px solid rgba(195,199,206,0.08);
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                .browse-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.5); }
                .browse-card img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; transition: transform 0.35s ease; }
                .browse-card:hover img { transform: scale(1.04); }
                .browse-card-placeholder {
                    width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
                    background: linear-gradient(135deg, #222326, #2a2d35);
                    font-size: 3rem; font-weight: 800; color: rgba(195,199,206,0.15);
                }
                .browse-card-footer {
                    position: absolute; bottom: 0; left: 0; right: 0;
                    padding: 36px 10px 10px;
                    background: linear-gradient(to top, rgba(0,0,0,0.95) 55%, transparent);
                    pointer-events: none;
                }
                .browse-card-title { font-size: 0.82rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; }
                .browse-card-meta { font-size: 0.68rem; color: rgba(255,255,255,0.55); display: flex; gap: 5px; align-items: center; }
                .browse-card-type { font-size: 0.6rem; font-weight: 700; padding: 1px 5px; border-radius: 3px; text-transform: uppercase; background: rgba(255,255,255,0.15); color: #fff; }
                .browse-card-rating { font-size: 0.68rem; color: #f5c518; font-weight: 700; }
                .browse-card-added { position: absolute; top: 8px; right: 8px; z-index: 2; background: rgba(40,167,69,0.9); color: #fff; font-size: 0.6rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; }
                .browse-pagination { display: flex; justify-content: center; gap: 10px; padding-bottom: 40px; flex-wrap: wrap; }
                .browse-pagination button { padding: 8px 18px; border: 1px solid rgba(195,199,206,0.2); border-radius: 8px; background: var(--surface); color: var(--light); font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
                .browse-pagination button:hover { background: var(--muted); }
                .browse-pagination button.current-page { background: var(--muted); border-color: var(--silver); }
                .browse-pagination button:disabled { opacity: 0.35; cursor: default; }
                .bd-modal-wrap { background: #141414; margin: 3% auto; border: 1px solid rgba(195,199,206,0.12); border-radius: 20px; width: 90%; max-width: 1200px; max-height: 88vh; overflow: hidden; position: relative; box-shadow: 0 24px 80px rgba(0,0,0,0.75); display: flex; flex-direction: column; }
                .bd-layout { display: flex; height: 82vh; max-height: 82vh; }
                .bd-poster-col { flex-shrink: 0; width: calc(82vh * 0.667); background: #141414; border-radius: 20px 0 0 20px; overflow: hidden; display: flex; align-items: stretch; }
                .bd-poster-img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
                .bd-poster-ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #222326, #2a2d35); font-size: 6rem; font-weight: 800; color: rgba(195,199,206,0.1); }
                .bd-info-col { flex: 1; min-width: 0; padding: 22px 26px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
                .bd-topbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px; }
                .bd-topbar-badges { display: flex; align-items: center; gap: 8px; }
                .bd-close-btn { background: rgba(255,255,255,0.08) !important; border: 1px solid rgba(255,255,255,0.14) !important; color: rgba(255,255,255,0.7) !important; padding: 5px 13px !important; border-radius: 20px !important; font-size: 0.72rem !important; font-weight: 600 !important; cursor: pointer; width: auto !important; text-transform: uppercase; transition: background 0.2s !important; }
                .bd-close-btn:hover { background: rgba(255,255,255,0.18) !important; color: #fff !important; }
                .bd-badge { font-size: 0.65rem; font-weight: 700; padding: 2px 9px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; background: rgba(195,199,206,0.15); color: var(--silver); }
                .bd-year { font-size: 0.8rem; color: var(--silver); }
                .bd-title { font-size: 1.6rem; font-weight: 800; color: #fff; line-height: 1.2; margin: 0; }
                .bd-meta { font-size: 0.83rem; color: rgba(255,255,255,0.4); margin: 0; }
                .bd-overview { font-size: 0.88rem; color: rgba(255,255,255,0.75); line-height: 1.65; margin: 0; }
                .bd-genres { display: flex; flex-wrap: wrap; gap: 6px; }
                .bd-genres .genre-tag { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); font-size: 0.75rem; cursor: default; }
                .bd-add-row { margin-top: auto; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
                .bd-add-label { font-size: 0.75rem; font-weight: 600; color: var(--silver); text-transform: uppercase; letter-spacing: 0.5px; }
                .bd-add-btn { all: unset; box-sizing: border-box; cursor: pointer; padding: 8px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; font-family: 'Inter', sans-serif; border: 1px solid rgba(255,255,255,0.18); background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.85); transition: background 0.18s, color 0.18s; white-space: nowrap; display: inline-flex; align-items: center; }
                .bd-add-btn:hover { background: rgba(255,255,255,0.18); color: #fff; }
                .bd-add-btn[data-status="watched"] { border-color: rgba(40,167,69,0.5); }
                .bd-add-btn[data-status="watched"]:hover { background: rgba(40,167,69,0.35); }
                .bd-add-btn[data-status="upcoming"] { border-color: rgba(230,140,0,0.5); }
                .bd-add-btn[data-status="upcoming"]:hover { background: rgba(230,140,0,0.3); }
                .bd-already { font-size: 0.85rem; font-weight: 600; color: rgba(40,167,69,0.9); padding: 8px 12px; background: rgba(40,167,69,0.1); border-radius: 8px; border: 1px solid rgba(40,167,69,0.25); }
                @media (max-width: 768px) {
                    .bd-layout { flex-direction: column; height: 100vh; max-height: 100vh; }
                    .bd-poster-col { width: 100%; height: auto; aspect-ratio: 2/3; max-height: 45vh; border-radius: 0; }
                    .bd-poster-img { object-fit: contain; }
                    .bd-modal-wrap { margin: 0; border-radius: 0; position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100vh; max-height: 100vh; }
                    .bd-info-col { padding: 16px 14px 0; flex: 1; overflow-y: auto; background: #141414; }
                    .browse-search-row { flex-direction: column; }
                    .browse-search-row input { width: 100%; }
                    .browse-filters { gap: 10px; }
                    .filter-group { width: calc(50% - 5px); }
                    .filter-group select, .filter-group input[type="number"] { width: 100%; }
                    .browse-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; }
                }
                @media (max-width: 480px) {
                    .bd-poster-col { max-height: 40vh; }
                    .bd-title { font-size: 1rem; }
                    .filter-group { width: 100%; }
                    .browse-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
                    .pill { padding: 5px 10px; font-size: 0.75rem; }
                }
            `}</style>
        </div>
    );
}
