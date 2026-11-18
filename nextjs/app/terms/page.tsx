import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="container">
            <header>
                <h1>Terms of Service</h1>
                <p>Last updated: August 11, 2026</p>
            </header>

            <main>
                <div className="legal-content">
                    <section className="legal-section">
                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing or using Watchly (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Service.</p>
                    </section>

                    <section className="legal-section">
                        <h2>2. Description of Service</h2>
                        <p>Watchly is a personal movie and TV show tracking platform that allows users to:</p>
                        <ul>
                            <li>Create and manage personal watchlists</li>
                            <li>Track viewing progress and history</li>
                            <li>Search and discover content using TMDB (The Movie Database) API</li>
                            <li>Create rankings and leaderboards of their favorite content</li>
                            <li>Backup their data to GitHub Gist</li>
                            <li>Access viewing statistics and insights</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>3. User Accounts and Data</h2>
                        <h3>3.1 Local Data Storage</h3>
                        <p>Watchly primarily stores your data locally in your browser&apos;s local storage. This means:</p>
                        <ul>
                            <li>Your data remains on your device by default</li>
                            <li>Clearing your browser data will remove your watchlist</li>
                            <li>You are responsible for backing up your data</li>
                        </ul>

                        <h3>3.2 Optional Backup Services</h3>
                        <p>You may choose to backup your data to third-party services such as GitHub Gist. When using these features:</p>
                        <ul>
                            <li>You are responsible for managing your own backup accounts</li>
                            <li>Third-party service terms apply (e.g., GitHub Terms of Service)</li>
                            <li>We do not control or guarantee the availability of third-party services</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>4. Acceptable Use</h2>
                        <p>You agree to use Watchly only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                        <ul>
                            <li>Use the Service for any illegal or unauthorized purpose</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with or disrupt the Service</li>
                            <li>Use automated scripts to scrape or harvest data</li>
                            <li>Violate any applicable laws or regulations</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>5. Third-Party Content and Services</h2>
                        <h3>5.1 TMDB Integration</h3>
                        <p>Watchly uses The Movie Database (TMDB) API to provide movie and TV show information. This integration is subject to:</p>
                        <ul>
                            <li>TMDB&apos;s terms of service and API usage policies</li>
                            <li>Availability and accuracy of TMDB data</li>
                            <li>Rate limits and usage restrictions imposed by TMDB</li>
                        </ul>

                        <h3>5.2 Content Ownership</h3>
                        <p>All movie and TV show metadata, images, and descriptions are provided by TMDB and remain the property of their respective owners. We do not claim ownership of this content.</p>
                    </section>

                    <section className="legal-section">
                        <h2>6. Intellectual Property</h2>
                        <p>The Watchly application, including its design, code, and functionality, is protected by intellectual property laws. You may not:</p>
                        <ul>
                            <li>Copy, modify, or distribute the application code</li>
                            <li>Reverse engineer or attempt to extract source code</li>
                            <li>Remove or alter any copyright notices</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>7. Disclaimers and Limitation of Liability</h2>
                        <h3>7.1 Service &quot;As Is&quot;</h3>
                        <p>Watchly is provided &quot;as is&quot; without warranties of any kind, either express or implied, including but not limited to:</p>
                        <ul>
                            <li>Merchantability or fitness for a particular purpose</li>
                            <li>Uninterrupted or error-free operation</li>
                            <li>Accuracy or completeness of content</li>
                        </ul>

                        <h3>7.2 Data Loss</h3>
                        <p>We are not responsible for any loss of data, including but not limited to:</p>
                        <ul>
                            <li>Browser storage limitations or deletions</li>
                            <li>Third-party service failures or data loss</li>
                            <li>User error or device failures</li>
                        </ul>

                        <h3>7.3 Limitation of Liability</h3>
                        <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</p>
                    </section>

                    <section className="legal-section">
                        <h2>8. Privacy and Data Protection</h2>
                        <p>Your privacy is important to us. Please review our <Link href="/privacy">Privacy Policy</Link> for information about how we collect, use, and protect your data.</p>
                    </section>

                    <section className="legal-section">
                        <h2>9. Modifications to Terms</h2>
                        <p>We reserve the right to modify these Terms at any time. When we make changes:</p>
                        <ul>
                            <li>We will update the &quot;Last updated&quot; date at the top of this page</li>
                            <li>Continued use of the Service constitutes acceptance of the modified Terms</li>
                            <li>If you do not agree to the modified Terms, you should discontinue use of the Service</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>10. Termination</h2>
                        <p>You may stop using Watchly at any time. We may suspend or terminate your access to the Service if you violate these Terms or for any other reason at our sole discretion.</p>
                    </section>

                    <section className="legal-section">
                        <h2>11. Governing Law</h2>
                        <p>These Terms are governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the Service will be resolved through appropriate legal channels.</p>
                    </section>

                    <section className="legal-section">
                        <h2>12. Contact Information</h2>
                        <p>If you have questions about these Terms of Service, please contact us through the feedback options available in the application.</p>
                    </section>
                </div>
            </main>

            <style>{`
                .legal-content { max-width: 800px; margin: 0 auto; line-height: 1.6; }
                .legal-section { margin-bottom: 40px; }
                .legal-section h2 { color: var(--light); font-size: 1.4rem; font-weight: 700; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid var(--muted); }
                .legal-section h3 { color: var(--light); font-size: 1.1rem; font-weight: 600; margin: 20px 0 12px 0; }
                .legal-section p { color: var(--silver); margin-bottom: 16px; }
                .legal-section ul { color: var(--silver); padding-left: 24px; margin-bottom: 16px; }
                .legal-section li { margin-bottom: 8px; }
                .legal-section a { color: var(--light); text-decoration: underline; }
                .legal-section a:hover { color: var(--silver); }
                header p { color: var(--muted); font-size: 0.9rem; margin-top: 8px; }
                @media (max-width: 768px) { .legal-content { padding: 0 8px; } .legal-section h2 { font-size: 1.2rem; } }
            `}</style>
        </div>
    );
}
