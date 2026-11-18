'use client';
import { useState, useEffect } from 'react';
import { WatchlistItem } from '@/lib/types';

interface HistoryEntry {
    title: string;
    subtitle: string | null;
    type: 'movie' | 'show' | 'season' | 'movie-part';
    date: string;
    parsedDate: Date | null;
    yearOnly: boolean;
    typeRank: number;
    partNumber: number;
    genres: string[];
    isMovie: boolean;
    addedAt: number;
    poster?: string | null;
}

function parseDate(dateStr: string | undefined): Date | null {
    if (!dateStr) return null;
    const s = String(dateStr).trim();
    if (/^\d{4}$/.test(s)) return new Date(parseInt(s), 0, 1);
    const monthMap: { [key: string]: number } = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
    const parts = s.replace(',', '').split(' ');
    if (parts.length === 3 && monthMap[parts[0]] !== undefined) {
        return new Date(parseInt(parts[2]), monthMap[parts[0]], parseInt(parts[1]));
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
}

function formatDisplayDate(dateStr: string | undefined): string {
    if (!dateStr) return 'No date';
    return String(dateStr).trim();
}

function formatTime(addedAt: number): string {
    if (!addedAt || addedAt <= 0) return '';
    const date = new Date(addedAt);
    const savedTimezone = typeof localStorage !== 'undefined' ? (localStorage.getItem('appTimezone') || 'auto') : 'auto';
    const timezone = savedTimezone === 'auto'
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : savedTimezone;
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
    return formatter.format(date);
}

export default function HistoryPage() {
    const [entries, setEntries] = useState<HistoryEntry[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('watchlistData');
            if (!saved) { setMounted(true); return; }
            const watchlistData: WatchlistItem[] = JSON.parse(saved);
            const built: HistoryEntry[] = [];

            watchlistData.forEach(item => {
                const hasSeason = item.seasons && item.seasons.length > 0;
                const isWatched = item.status === 'watched';
                if (!isWatched && !hasSeason) return;

                if (isWatched && item.date && !hasSeason) {
                    const raw = String(item.date).trim();
                    built.push({
                        title: item.title,
                        subtitle: null,
                        type: item.isMovie ? 'movie' : 'show',
                        date: item.date || '',
                        parsedDate: parseDate(item.date),
                        yearOnly: /^\d{4}$/.test(raw),
                        typeRank: 0,
                        partNumber: 0,
                        genres: item.genres || [],
                        isMovie: item.isMovie,
                        addedAt: item.addedAt || 0,
                        poster: item.poster,
                    });
                }

                if (hasSeason) {
                    item.seasons!.forEach(s => {
                        if (!s.date) return;
                        const raw = String(s.date).trim();
                        const label = item.isMovie
                            ? (s.season ? `Movie ${s.season}` : 'Movie')
                            : `Season ${s.season}`;
                        built.push({
                            title: item.title,
                            subtitle: label,
                            type: item.isMovie ? 'movie-part' : 'season',
                            date: s.date,
                            parsedDate: parseDate(s.date),
                            yearOnly: /^\d{4}$/.test(raw),
                            typeRank: 1,
                            partNumber: s.season || 0,
                            genres: item.genres || [],
                            isMovie: item.isMovie,
                            addedAt: item.addedAt || 0,
                            poster: item.poster,
                        });
                    });
                }
            });

            // Sort: newest first, ties by addedAt, then yearOnly, then typeRank, then partNumber
            const withDate = built.filter(e => e.parsedDate !== null);
            const noDate = built.filter(e => e.parsedDate === null);

            withDate.sort((a, b) => {
                const dateDiff = (b.parsedDate!.getTime()) - (a.parsedDate!.getTime());
                if (dateDiff !== 0) return dateDiff;
                if (a.addedAt !== b.addedAt) return (b.addedAt || 0) - (a.addedAt || 0);
                if (a.yearOnly !== b.yearOnly) return a.yearOnly ? 1 : -1;
                if (a.typeRank !== b.typeRank) return a.typeRank - b.typeRank;
                return (b.partNumber || 0) - (a.partNumber || 0);
            });

            setEntries([...withDate, ...noDate]);
        } catch { /* ignore */ }
        setMounted(true);
    }, []);

    if (!mounted) return <div className="container"><div style={{padding: '40px', textAlign: 'center', color: 'var(--silver)'}}>Loading...</div></div>;

    // Group by year
    let currentYear: string | number | null = null;

    return (
        <div className="container">
            <header>
                <h1>Watch History</h1>
                <p>Everything you&apos;ve watched, newest first</p>
            </header>

            <main>
                <div className="history-container">
                    {entries.length === 0 ? (
                        <div className="no-history">No watch history yet. Start marking things as watched!</div>
                    ) : (
                        <>
                            <div className="history-count">
                                {entries.length} entr{entries.length === 1 ? 'y' : 'ies'}
                            </div>
                            <div className="timeline">
                                {entries.map((entry, i) => {
                                    const year = entry.parsedDate ? entry.parsedDate.getFullYear() : null;
                                    const displayYear = year || 'No Date';
                                    const showDivider = displayYear !== currentYear;
                                    currentYear = displayYear;

                                    let badge = '';
                                    if (entry.type === 'season') badge = `<span class="badge badge-season">${entry.subtitle}</span>`;
                                    else if (entry.type === 'movie-part') badge = `<span class="badge badge-movie">${entry.subtitle}</span>`;
                                    else if (entry.type === 'show') badge = '<span class="badge badge-show">Show</span>';
                                    else badge = '<span class="badge badge-movie">Movie</span>';

                                    const timeStr = formatTime(entry.addedAt);

                                    return (
                                        <div key={i}>
                                            {showDivider && (
                                                <div className="year-divider">
                                                    <span className="year-label">{displayYear}</span>
                                                </div>
                                            )}
                                            <div className="history-entry">
                                                <div className="entry-top">
                                                    <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                                                        {entry.poster && (
                                                            <img
                                                                src={entry.poster}
                                                                alt={entry.title}
                                                                style={{
                                                                    width: '36px', height: '54px',
                                                                    borderRadius: '4px', objectFit: 'cover',
                                                                    flexShrink: 0, background: 'var(--surface)',
                                                                }}
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="entry-title" dangerouslySetInnerHTML={{__html: `${entry.title} ${badge}`}} />
                                                        </div>
                                                    </div>
                                                    <div className="entry-date">
                                                        <div>{formatDisplayDate(entry.date)}</div>
                                                        {timeStr && <div className="entry-time">{timeStr}</div>}
                                                    </div>
                                                </div>
                                                {entry.genres.length > 0 && (
                                                    <div className="entry-genres">
                                                        {entry.genres.map((g, j) => (
                                                            <span key={j} className="genre-tag">{g}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </main>

            <style>{`
                .history-container { max-width: 750px; margin: 0 auto; }
                .timeline { position: relative; padding-left: 36px; }
                .timeline::before {
                    content: ''; position: absolute; left: 10px; top: 0; bottom: 0;
                    width: 2px; background: linear-gradient(to bottom, var(--silver), transparent);
                }
                [data-theme="netflix"] .timeline::before { background: linear-gradient(to bottom, #E50914, transparent); }
                [data-theme="prime"] .timeline::before { background: linear-gradient(to bottom, #00A8E1, transparent); }
                .year-divider {
                    position: relative; text-align: left;
                    margin: 32px 0 18px -36px; padding-left: 36px;
                }
                .year-divider::before {
                    content: ''; position: absolute; left: 4px; top: 50%;
                    width: 14px; height: 14px; background: var(--silver);
                    border-radius: 50%; transform: translateY(-50%);
                    box-shadow: 0 0 12px rgba(195,199,206,0.5);
                }
                [data-theme="netflix"] .year-divider::before { background: #E50914; box-shadow: 0 0 12px rgba(229,9,20,0.6); }
                [data-theme="prime"] .year-divider::before { background: #00A8E1; box-shadow: 0 0 12px rgba(0,168,225,0.6); }
                .year-label {
                    display: inline-block; font-size: 1.4rem; font-weight: 800;
                    color: var(--light); letter-spacing: 2px; padding: 4px 0;
                    border-bottom: 2px solid var(--silver);
                }
                [data-theme="netflix"] .year-label { border-bottom-color: #E50914; }
                [data-theme="prime"] .year-label { border-bottom-color: #00A8E1; }
                .history-entry {
                    position: relative; background: var(--glass);
                    border: 1px solid rgba(195,199,206,0.08);
                    border-radius: 12px; padding: 16px 18px;
                    margin-bottom: 12px; transition: all 0.25s ease;
                }
                .history-entry::before {
                    content: ''; position: absolute; left: -30px; top: 50%;
                    width: 10px; height: 10px; background: var(--muted);
                    border-radius: 50%; transform: translateY(-50%);
                    transition: background 0.25s ease;
                }
                [data-theme="netflix"] .history-entry::before { background: rgba(229,9,20,0.5); }
                [data-theme="prime"] .history-entry::before { background: rgba(0,168,225,0.5); }
                .history-entry:hover {
                    border-color: rgba(195,199,206,0.2);
                    transform: translateX(4px);
                    box-shadow: 0 6px 24px rgba(0,0,0,0.35);
                }
                .history-entry:hover::before { background: var(--silver); }
                [data-theme="netflix"] .history-entry:hover::before { background: #E50914; }
                [data-theme="prime"] .history-entry:hover::before { background: #00A8E1; }
                .entry-top {
                    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
                }
                .entry-title {
                    font-size: 1.05rem; font-weight: 700; color: var(--light); line-height: 1.3;
                }
                .entry-date {
                    font-size: 0.8rem; color: var(--silver); white-space: nowrap;
                    flex-shrink: 0; padding-top: 2px;
                    display: flex; flex-direction: column; gap: 2px; align-items: flex-end;
                }
                .entry-time { font-size: 0.7rem; color: var(--silver); opacity: 0.8; }
                .entry-genres {
                    display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;
                }
                .entry-genres .genre-tag {
                    font-size: 0.72rem; padding: 3px 9px; cursor: default;
                }
                .entry-genres .genre-tag:hover {
                    background: rgba(58,63,71,0.6); color: var(--light);
                    transform: none; border-color: rgba(195,199,206,0.15);
                }
                .badge {
                    display: inline-block; font-size: 0.7rem; font-weight: 700;
                    padding: 2px 8px; border-radius: 4px;
                    text-transform: uppercase; letter-spacing: 0.5px;
                    margin-left: 8px; vertical-align: middle;
                }
                .badge-season, .badge-movie {
                    background: rgba(58,63,71,0.8); color: var(--silver);
                    border: 1px solid rgba(195,199,206,0.15);
                }
                .badge-show {
                    background: rgba(195,199,206,0.15); color: var(--silver);
                    border: 1px solid rgba(195,199,206,0.3);
                }
                .no-history {
                    text-align: center; padding: 80px 20px; color: var(--silver);
                    font-size: 1.2rem; background: var(--surface);
                    border-radius: 15px; border: 1px solid rgba(195,199,206,0.1);
                }
                .history-count {
                    text-align: center; color: var(--muted);
                    font-size: 0.85rem; margin-bottom: 28px; letter-spacing: 0.5px;
                }
                @media (max-width: 480px) {
                    .timeline { padding-left: 24px; }
                    .timeline::before { left: 6px; }
                    .year-divider { margin-left: -24px; padding-left: 24px; }
                    .year-divider::before { left: 6px; }
                    .history-entry::before { left: -20px; width: 8px; height: 8px; }
                    .entry-title { font-size: 0.95rem; }
                }
            `}</style>
        </div>
    );
}
