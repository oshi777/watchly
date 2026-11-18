'use client';

interface StatsBarProps {
    total: number;
    watched: number;
    upcoming: number;
}

export default function StatsBar({ total, watched, upcoming }: StatsBarProps) {
    return (
        <div className="stats">
            <div className="stat-item">
                <span className="stat-number">{total}</span>
                <span className="stat-label">Total Items</span>
            </div>
            <div className="stat-item">
                <span className="stat-number">{watched}</span>
                <span className="stat-label">Watched</span>
            </div>
            <div className="stat-item">
                <span className="stat-number">{upcoming}</span>
                <span className="stat-label">Upcoming</span>
            </div>
        </div>
    );
}
