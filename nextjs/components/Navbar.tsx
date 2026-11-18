'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AccountPanel from '@/components/AuthButton';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/search', label: 'Browse' },
        { href: '/leaderboard', label: 'Leaderboard' },
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
                {/* Left — brand */}
                <div className="nav-brand">Watchly</div>

                {/* Center — nav links (inline on desktop) */}
                <div className="nav-links-inline">
                    {visibleLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${pathname === link.href ? 'active-nav' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile hamburger */}
                <button
                    className={`hamburger ${menuOpen ? 'open' : ''}`}
                    aria-label="Menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-expanded={menuOpen}
                >
                    <span></span><span></span><span></span>
                </button>

                {/* Mobile dropdown */}
                <div className={`nav-links ${menuOpen ? 'open' : ''}`} id="navLinks">
                    <div className="nav-menu-container">
                        {visibleLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-link ${pathname === link.href ? 'active-nav' : ''}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right — Account tab */}
                <AccountPanel />
            </nav>
            <div
                className={`site-blur-overlay ${menuOpen ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
            ></div>
        </>
    );
}
