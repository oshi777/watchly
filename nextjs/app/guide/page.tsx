'use client';
import Link from 'next/link';

export default function GuidePage() {
    return (
        <div className="container">
            <header>
                <h1>Watchly User Guide</h1>
                <p>Learn how to use your personal watchlist</p>
                <Link href="/" className="add-btn">Back To Watchly</Link>
            </header>

            <main>
                <div className="guide-content">
                    <div className="guide-section">
                        <h2>Getting Started</h2>
                        <p>Welcome to Watchly! This guide will help you manage your movies and TV shows effectively.</p>
                    </div>

                    <div className="guide-section">
                        <h2>Adding Items</h2>
                        <ul>
                            <li>Click <strong>&quot;+ Add Show&quot;</strong> button</li>
                            <li>Enter the title, select status (To Watch/Watched/Upcoming)</li>
                            <li>Add genres separated by commas (e.g., Action, Drama, Comedy)</li>
                            <li>Optionally add date, release year, and notes</li>
                            <li>Check &quot;Movie&quot; if it&apos;s a movie instead of a TV show</li>
                            <li>Click <strong>&quot;Add to Watchlist&quot;</strong></li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>Managing Items</h2>
                        <ul>
                            <li><strong>Mark Watched/Unwatched:</strong> Toggle completion status</li>
                            <li><strong>Add Season/Movie:</strong> Track individual seasons or movie sequels</li>
                            <li><strong>Edit:</strong> Modify title, genres, notes, or other details</li>
                            <li><strong>Delete:</strong> Remove items with confirmation dialog</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>Search &amp; Filter</h2>
                        <ul>
                            <li><strong>Search:</strong> Type in the search box to find titles or genres</li>
                            <li><strong>Status Filter:</strong> Show only Watched, Upcoming, or To Watch items</li>
                            <li><strong>Genre Filter:</strong> Filter by specific genres</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>Data Management</h2>
                        <ul>
                            <li><strong>Export:</strong> Download watchlist + rankings as JSON backup</li>
                            <li><strong>Import:</strong> Upload previously exported JSON file</li>
                            <li><strong>Reset All:</strong> Clear entire watchlist</li>
                            <li><strong>Auto Backup:</strong> Daily cloud backup (setup required)</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>Status Icons</h2>
                        <ul>
                            <li><strong>✓</strong> - Watched</li>
                            <li><strong>→</strong> - Upcoming</li>
                            <li><strong>○</strong> - To Watch</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>Organization</h2>
                        <p>Items are automatically organized alphabetically by first letter. Your stats show total items, watched count, and upcoming releases.</p>
                    </div>

                    <div className="guide-section">
                        <h2>Leaderboard</h2>
                        <ul>
                            <li><strong>Personal Rankings:</strong> Create your own ranked list of favorites</li>
                            <li><strong>Add Items:</strong> Select from dropdown to add watchlist items to leaderboard</li>
                            <li><strong>Drag &amp; Drop:</strong> Reorder items by dragging them up/down</li>
                            <li><strong>Remove Items:</strong> Click × button with confirmation dialog</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>Trakt.tv Integration</h2>
                        <p>Automatically sync your watch history from Netflix, Prime Video, Disney+, and other streaming services using Trakt.tv.</p>

                        <p><strong>What is Trakt.tv?</strong></p>
                        <ul>
                            <li>Free service that tracks what you watch across streaming platforms</li>
                            <li>Browser extension auto-detects when you watch shows/movies</li>
                            <li>Sync your watch history to Watchly with one click</li>
                        </ul>

                        <p><strong>Step 1: Create Trakt Account</strong></p>
                        <ul>
                            <li>Go to <a href="https://trakt.tv" target="_blank" rel="noopener noreferrer" style={{color: 'var(--light)'}}>trakt.tv</a></li>
                            <li>Sign up for a free account</li>
                            <li>No credit card required</li>
                        </ul>

                        <p><strong>Step 2: Install Trakt Browser Extension</strong></p>
                        <ul>
                            <li>Visit <a href="https://trakt.tv/apps" target="_blank" rel="noopener noreferrer" style={{color: 'var(--light)'}}>trakt.tv/apps</a></li>
                            <li>Install the extension for your browser (Chrome, Firefox, etc.)</li>
                            <li>The extension will automatically track what you watch</li>
                        </ul>

                        <p><strong>Step 3: Create Trakt API Application</strong></p>
                        <ul>
                            <li>Go to <a href="https://trakt.tv/oauth/applications/new" target="_blank" rel="noopener noreferrer" style={{color: 'var(--light)'}}>trakt.tv/oauth/applications/new</a></li>
                            <li>Sign in to your Trakt account</li>
                            <li><strong>Name:</strong> Watchly</li>
                            <li><strong>Redirect URI:</strong> Copy from Watchly settings page</li>
                            <li>Click &quot;Save App&quot;</li>
                            <li>Copy the <strong>Client ID</strong> and <strong>Client Secret</strong></li>
                        </ul>

                        <p><strong>Step 4: Connect in Watchly</strong></p>
                        <ul>
                            <li>Go to Settings page in Watchly</li>
                            <li>Find &quot;Trakt.tv Integration&quot; section</li>
                            <li>Click &quot;Connect Trakt.tv Account&quot;</li>
                            <li>Paste your Client ID and Client Secret</li>
                            <li>Click &quot;Save &amp; Connect&quot;</li>
                            <li>Authorize Watchly to access your Trakt account</li>
                        </ul>

                        <p><strong>How It Works:</strong></p>
                        <ul>
                            <li>Watch shows on Netflix, Prime Video, etc.</li>
                            <li>Trakt browser extension tracks automatically</li>
                            <li>Click &quot;Sync Now&quot; in Watchly to import your history</li>
                            <li>All watched shows/movies appear in your watchlist</li>
                            <li>Includes poster images, genres, and watch dates</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>Auto Backup Setup</h2>
                        <p><strong>Step 1:</strong> Get GitHub personal access token</p>
                        <ul>
                            <li>Go to <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener noreferrer" style={{color: 'var(--light)'}}>github.com/settings/tokens</a></li>
                            <li>Click &quot;Generate new token&quot; (Fine-grained token)</li>
                            <li>Give it a name (e.g., &quot;Watchly&quot;)</li>
                            <li>Set expiration (recommended: No expiration)</li>
                            <li>Repository access: Select &quot;Public Repositories (read-only)&quot;</li>
                            <li>Scroll to <strong>Account permissions</strong> (NOT Repository permissions)</li>
                            <li>Find &quot;Gists&quot; and set to <strong>&quot;Read and write&quot;</strong></li>
                            <li>Click &quot;Generate token&quot; and copy it (starts with github_pat_...)</li>
                        </ul>

                        <p><strong>Step 2:</strong> Setup in Watchly</p>
                        <ul>
                            <li>Go to Backup page in Watchly</li>
                            <li>Click &quot;Setup GitHub&quot;</li>
                            <li>Paste your token</li>
                            <li>Click &quot;Save&quot;</li>
                            <li>Click &quot;Test Connection&quot; to verify</li>
                            <li>Click &quot;Force Backup Now&quot; to create your first backup</li>
                        </ul>

                        <p><strong>How it works:</strong></p>
                        <ul>
                            <li>Backs up automatically every 1 minute when changes are made</li>
                            <li>Creates one private GitHub Gist (updates same file)</li>
                            <li>Access your backup at gist.github.com</li>
                            <li>Includes both watchlist and leaderboard data</li>
                            <li>Click &quot;View Backup&quot; button to see your data</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>Sync Across Devices</h2>
                        <p><strong>Setup on First Device:</strong></p>
                        <ul>
                            <li>Complete Auto Backup setup (see above)</li>
                            <li>Click &quot;Force Backup Now&quot; to create your backup</li>
                            <li>Click &quot;View Backup&quot; to open your GitHub Gist</li>
                            <li>Copy the Gist ID from the URL: gist.github.com/username/<strong>GIST_ID</strong></li>
                        </ul>

                        <p><strong>Setup on Additional Devices:</strong></p>
                        <ul>
                            <li>Open Watchly on your new device</li>
                            <li>Go to Backup page</li>
                            <li>Click &quot;Setup GitHub&quot;</li>
                            <li>Enter your GitHub token (same one from first device)</li>
                            <li>Enter the Gist ID you copied</li>
                            <li>Click &quot;Save&quot;</li>
                            <li>Click &quot;Sync from Gist&quot; to download your watchlist</li>
                            <li>Refresh the page to see all your data</li>
                        </ul>

                        <p><strong>Daily Usage:</strong></p>
                        <ul>
                            <li><strong>Make changes on any device:</strong> Auto-backup runs every minute</li>
                            <li><strong>Switch devices:</strong> Click &quot;Sync from Gist&quot; to get latest data</li>
                            <li><strong>Force Backup Now:</strong> Manually push changes immediately</li>
                            <li><strong>Sync from Gist:</strong> Pull latest changes from GitHub — replaces local data with backup</li>
                        </ul>

                        <p><strong>Important:</strong> Sync is a full replace — the backup becomes your local data. Always Force Backup on one device before Syncing on another to avoid losing recent changes.</p>
                    </div>

                    <div className="guide-section">
                        <h2>Accessing Your Backups</h2>
                        <ul>
                            <li><strong>View Backup:</strong> Click &quot;View Backup&quot; button on Backup page</li>
                            <li><strong>Direct Access:</strong> Go to gist.github.com (sign in to see private gists)</li>
                            <li><strong>Download:</strong> Click &quot;Raw&quot; button in gist to download JSON file</li>
                            <li><strong>Restore:</strong> Use Import function in Watchly with downloaded file</li>
                            <li><strong>Instant Updates:</strong> Every change automatically saves to same gist</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>Data Storage</h2>
                        <ul>
                            <li><strong>Local Storage:</strong> Data saved in browser (can be lost)</li>
                            <li><strong>Auto Backup:</strong> Cloud backup to GitHub Gists (recommended)</li>
                            <li><strong>Manual Export:</strong> Download JSON files for safekeeping</li>
                            <li><strong>Import:</strong> Restore from JSON files anytime</li>
                            <li><strong>Combined Backup:</strong> Export includes both watchlist and rankings</li>
                        </ul>
                    </div>

                    <div className="guide-section">
                        <h2>Security</h2>
                        <p>Use the <strong>&quot;Lock&quot;</strong> button to log out and secure your watchlist. You&apos;ll need to re-enter the password to access it again.</p>
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
                    border-bottom: 1px solid rgba(195,199,206,0.15);
                }
                .guide-section:last-child {
                    border-bottom: none;
                }
                .guide-section h2 {
                    color: var(--light);
                    font-size: 1.4rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                }
                .guide-section p, .guide-section li {
                    color: var(--silver);
                    line-height: 1.6;
                    margin-bottom: 10px;
                    text-align: left;
                }
                .guide-section ul {
                    padding-left: 20px;
                    text-align: left;
                }
                .guide-section strong {
                    color: var(--light);
                }
                .guide-section a {
                    color: var(--light);
                    text-decoration: none;
                }
                .guide-section a:hover {
                    text-decoration: underline;
                }
                @media (max-width: 768px) {
                    .guide-content { padding: 0 4px; }
                    .guide-section { padding: 20px; }
                    .guide-section h2 { font-size: 1.2rem; }
                }
                @media (max-width: 480px) {
                    .guide-section { padding: 16px; }
                    .guide-section h2 { font-size: 1.1rem; }
                }
            `}</style>
        </div>
    );
}
