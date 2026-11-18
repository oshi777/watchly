export default function Footer() {
    return (
        <footer className="universal-footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>Watchly</h3>
                        <p>Your Personal Movie & TV Tracking Platform</p>
                    </div>
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/search">Browse</a></li>
                            <li><a href="/leaderboard">Leaderboard</a></li>
                            <li><a href="/backup">Backup</a></li>
                            <li><a href="/guide">Guide</a></li>
                            <li><a href="/settings">Settings</a></li>
                        </ul>
                    </div>
                    <div className="footer-legal">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="/terms">Terms of Service</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Watchly. Built for movie and TV enthusiasts.</p>
                </div>
            </div>
        </footer>
    );
}
