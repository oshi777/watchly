'use client';
import Link from 'next/link';

export default function Footer() {
    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/search', label: 'Browse' },
        { href: '/leaderboard', label: 'Leaderboard' },
        { href: '/history', label: 'History' },
        { href: '/guide', label: 'Guide' },
        { href: '/settings', label: 'Settings' },
    ];

    return (
        <footer className="site-footer" style={{
            padding: '48px 24px 32px',
            marginTop: 'auto',
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>

                {/* Brand */}
                <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--light)', letterSpacing: '-0.5px' }}>
                        Watchly
                    </span>
                </div>

                {/* Tagline */}
                <p style={{ color: 'var(--silver)', fontSize: '0.85rem', marginBottom: '28px' }}>
                    Your personal movie &amp; TV tracking platform
                </p>

                {/* Nav links */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '4px',
                    marginBottom: '28px',
                }}>
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                color: 'var(--silver)',
                                textDecoration: 'none',
                                fontSize: '0.8rem',
                                fontWeight: '500',
                                padding: '6px 14px',
                                borderRadius: '20px',
                                border: '1px solid rgba(195,199,206,0.12)',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = 'var(--light)';
                                e.currentTarget.style.borderColor = 'rgba(195,199,206,0.3)';
                                e.currentTarget.style.background = 'rgba(195,199,206,0.06)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = 'var(--silver)';
                                e.currentTarget.style.borderColor = 'rgba(195,199,206,0.12)';
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid rgba(195,199,206,0.08)', paddingTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--silver)', fontSize: '0.75rem' }}>
                        © {new Date().getFullYear()} Watchly
                    </span>
                    <span style={{ color: 'rgba(195,199,206,0.2)', fontSize: '0.75rem' }}>·</span>
                    <Link href="/terms" style={{ color: 'var(--silver)', textDecoration: 'none', fontSize: '0.75rem', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--light)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--silver)'}
                    >
                        Terms
                    </Link>
                    <span style={{ color: 'rgba(195,199,206,0.2)', fontSize: '0.75rem' }}>·</span>
                    <Link href="/privacy" style={{ color: 'var(--silver)', textDecoration: 'none', fontSize: '0.75rem', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--light)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--silver)'}
                    >
                        Privacy
                    </Link>
                </div>

            </div>
        </footer>
    );
}
