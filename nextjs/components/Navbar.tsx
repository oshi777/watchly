'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AuthButton from '@/components/AuthButton';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/search', label: 'Browse' },
        { href: '/leaderboard', label: 'Leaderboard' },
        { href: '/backup', label: 'Backup' },
        { href: '/guide', label: 'Guide' },
        { href: '/history', label: 'History' },
        { href: '/settings', label: 'Settings' },
    ];

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [menuOpen]);

    // Hide leaderboard link if disabled
    const [leaderboardEnabled, setLeaderboardEnabled] = useState(true);
    useEffect(() => {
        setLeaderboardEnabled(localStorage.getItem('leaderboardEnabled') !== 'false');
    }, []);

    const visibleLinks = navLinks.filter(link => {
        if (link.label === 'Leaderboard' && !leaderboardEnabled) return false;
        return true;
    });

    return (
        <>
            <nav className="navbar">
                <div className="nav-brand" style={{fontSize: '0.75rem'}}>Watchly</div>
                <div style={{marginLeft: 'auto', marginRight: '12px'}}>
                    <AuthButton />
                </div>
                <button
                    className={`hamburger ${menuOpen ? 'open' : ''}`}
                    aria-label="Menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-expanded={menuOpen}
                >
                    <span></span><span></span><span></span>
                </button>
                <div className={`nav-links ${menuOpen ? 'open' : ''}`} id="navLinks">
                    <div className="nav-menu-container">
                        {visibleLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-link ${pathname === link.href ? 'active-nav' : ''}`}
                                style={{fontSize: '0.7rem'}}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
            <div
                className={`site-blur-overlay ${menuOpen ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
            ></div>
        </>
    );
}
