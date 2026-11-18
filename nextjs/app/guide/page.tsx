'use client';
import Link from 'next/link';

export default function GuidePage() {
    return (
        <div className="container">
            <header>
                <h1>Watchly User Guide</h1>
                <p>Everything you need to know about using Watchly</p>
                <Link href="/" className="add-btn">Back To Watchly</Link>
            </header>

            <main>
                <div className="guide-content">

                    <div className="guide-section">
                        <h2>Getting Started</h2>
                        <p>Watchly is a personal tracker for movies and TV shows. Your watchlist is saved locally in your browser and optionally synced to the cloud when you sign in with Google.</p>
                    </div>

                    <div className="guide-section">
                        <h2>Adding Items</h2>
                        <ul>
                            <li>Click <strong>+ Add Show</strong> on the main page</li>
                            <li>Enter the title and select a status — <strong>To Watch</strong>, <strong>Watched</strong>, or <strong>Upcoming</strong></li>
                            <li>Add genres separated by commas (e.g. Action, Drama)</li>
                            <li>Optionally add a release year, watch date, and notes</li>
                            <li>Check <strong>Movie</strong> if it's a film rather than a series</li>
                            <li>Click <strong>Add to Watchlist</strong></li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>Managing Items</h2>
                        <ul>
                            <li><strong>Mark Watched / Unwatched:</strong> Toggle the watch status directly from the card</li>
                            <li><strong>Add Season:</strong> Track individual seasons or sequels under a single entry</li>
                            <li><strong>Edit:</strong> Update title, genres, notes, year, or any other field</li>
                            <li><strong>Delete:</strong> Remove an item — you'll be asked to confirm</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>Search &amp; Filter</h2>
                        <ul>
                            <li><strong>Search:</strong> Type to find by title or genre</li>
                            <li><strong>Status filter:</strong> Show only Watched, Upcoming, or To Watch</li>
                            <li><strong>Genre filter:</strong> Narrow down by a specific genre</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>History</h2>
                        <p>The History page shows everything you've marked as watched, grouped by year with the date and time you marked it. Gold, silver, and bronze medals highlight your top 3 most recently watched.</p>
                    </div>

                    <div className="guide-section">
                        <h2>Leaderboard</h2>
                        <ul>
                            <li>Create your own personal ranked list of favourites</li>
                            <li>Add any item from your watchlist using the dropdown</li>
                            <li>Drag and drop to reorder</li>
                            <li>Click <strong>×</strong> to remove an item from the ranking</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>Import &amp; Export</h2>
                        <ul>
                            <li><strong>Export:</strong> Downloads your full watchlist and rankings as a JSON file — good for a local backup</li>
                            <li><strong>Import:</strong> Upload a previously exported JSON file to restore your data</li>
                            <li><strong>Reset All:</strong> Clears your entire watchlist (cannot be undone)</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>Cloud Sync</h2>
                        <p>Sign in with Google (the <strong>Account</strong> button in the top right) to enable automatic cloud sync.</p>
                        <ul>
                            <li>Every change — adding, removing, editing, or toggling watched — syncs to the cloud automatically within a couple of seconds</li>
                            <li>When you sign in on any device, your watchlist loads from the cloud instantly</li>
                            <li>No manual syncing needed — it all happens in the background</li>
                        </ul>

                        <div style={{
                            margin: '20px 0 0',
                            padding: '16px 20px',
                            background: 'rgba(195,199,206,0.05)',
                            borderRadius: '10px',
                            border: '1px solid rgba(195,199,206,0.1)',
                        }}>
                            <strong style={{color: 'var(--light)', display: 'block', marginBottom: '10px'}}>Storage limits per account</strong>
                            <ul style={{margin: 0}}>
                                <li><strong>5 MB</strong> per account (free tier)</li>
                                <li>Each item averages <strong>~1–3 KB</strong> depending on notes and seasons</li>
                                <li>A typical watchlist of <strong>500 shows/movies</strong> uses roughly 1–2 MB</li>
                                <li>At maximum capacity you could store approximately <strong>1,500–5,000 entries</strong></li>
                                <li>In practice most users will never hit the limit through normal use</li>
                            </ul>
                        </div>
                    </div>

                    <div className="guide-section">
                        <h2>Themes</h2>
                        <p>Go to <strong>Settings</strong> to switch between four themes — Default, Netflix, Prime Video, and Light. Your choice is saved automatically.</p>
                    </div>

                    <div className="guide-section">
                        <h2>Display Options</h2>
                        <p>In Settings you can also change how your watchlist is displayed:</p>
                        <ul>
                            <li><strong>Poster mode:</strong> Shows cover art for each entry</li>
                            <li><strong>List mode:</strong> Compact text-based view</li>
                            <li><strong>List grouping:</strong> Group entries by first letter, genre, or status</li>
                        </ul>
                    </div>

                </div>
            </main>

            <style>{`
                .guide-content {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .guide-section {
                    padding: 30px 0;
                    border-bottom: 1px solid rgba(195,199,206,0.12);
                }
                .guide-section:last-child {
                    border-bottom: none;
                }
                .guide-section h2 {
                    color: var(--light);
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 14px;
                }
                .guide-section p {
                    color: var(--silver);
                    line-height: 1.7;
                    margin-bottom: 10px;
                    text-align: left;
                }
                .guide-section ul {
                    padding-left: 20px;
                    text-align: left;
                }
                .guide-section li {
                    color: var(--silver);
                    line-height: 1.7;
                    margin-bottom: 6px;
                }
                .guide-section strong {
                    color: var(--light);
                }
                @media (max-width: 768px) {
                    .guide-content { padding: 0 4px; }
                    .guide-section { padding: 20px 0; }
                    .guide-section h2 { font-size: 1.1rem; }
                }
            `}</style>
        </div>
    );
}
