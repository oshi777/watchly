'use client';
import { WatchlistItem } from '@/lib/types';

interface WatchlistGridProps {
    items: WatchlistItem[];
    onItemClick: (item: WatchlistItem) => void;
}

const statusLabels: Record<string, string> = {
    'watched': 'Watched',
    'upcoming': 'Upcoming',
    'currently-watching': 'Currently Watching',
    'pending': 'To Watch',
};

export default function WatchlistGrid({ items, onItemClick }: WatchlistGridProps) {
    if (!items || items.length === 0) {
        return (
            <div className="no-results">
                No items found matching your criteria.
            </div>
        );
    }

    // Sort alphabetically by section then title
    const sorted = [...items].sort((a, b) => {
        if (a.section !== b.section) {
            if (a.section === '0-9') return -1;
            if (b.section === '0-9') return 1;
            return a.section.localeCompare(b.section);
        }
        return a.title.localeCompare(b.title);
    });

    return (
        <div className="items-grid">
            {sorted.map((item) => {
                const statusClass = item.status === 'watched' ? 'watched' :
                    item.status === 'upcoming' ? 'upcoming' :
                    item.status === 'currently-watching' ? 'currently-watching' : 'pending';

                return (
                    <div
                        key={item.id}
                        className={item.poster ? 'item has-poster' : 'item no-poster'}
                        onClick={() => onItemClick(item)}
                    >
                        {item.poster ? (
                            <img
                                src={item.poster}
                                alt={item.title}
                                className="item-poster-bg"
                                loading="lazy"
                            />
                        ) : (
                            <div className="item-poster-placeholder">
                                <div className="item-poster-placeholder-letter">
                                    {item.title.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        )}
                        <div className="item-poster-footer">
                            <div className="item-poster-title">{item.title}</div>
                            <div className="item-poster-meta">
                                <span className={`item-poster-status ${statusClass}`}>
                                    {statusLabels[item.status] || item.status}
                                </span>
                                {item.year && <span>{item.year}</span>}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
