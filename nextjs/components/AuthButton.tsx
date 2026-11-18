'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AccountPanel() {
    const { user, profile, loading, loginWithGoogle, logout, isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setMounted(true); }, []);

    // Close panel when clicking outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const storageUsed = profile?.storage_used || 0;
    const storageLimit = profile?.storage_limit || 50 * 1024 * 1024;
    const usedMB = (storageUsed / (1024 * 1024)).toFixed(1);
    const limitMB = (storageLimit / (1024 * 1024)).toFixed(0);
    const pct = Math.min(100, (storageUsed / storageLimit) * 100);

    return (
        <div ref={panelRef} style={{ position: 'relative', marginLeft: 'auto' }}>
            {/* Account Tab */}
            <button
                onClick={() => setOpen(o => !o)}
                className={`nav-link ${open ? 'active-nav' : ''}`}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                }}
            >
                {/* Person icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
                Account
            </button>

            {/* Dropdown card */}
            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '280px',
                    background: 'var(--surface)',
                    border: '1px solid var(--muted)',
                    borderRadius: '12px',
                    padding: '20px',
                    zIndex: 9999,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                    {!mounted || loading ? (
                        <div style={{ color: 'var(--silver)', fontSize: '0.85rem', textAlign: 'center' }}>
                            Loading...
                        </div>
                    ) : !isAuthenticated ? (
                        /* Not signed in */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '48px', height: '48px',
                                    borderRadius: '50%',
                                    background: 'var(--muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 12px',
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--silver)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                </div>
                                <p style={{ color: 'var(--light)', fontWeight: '600', fontSize: '0.95rem', margin: '0 0 4px' }}>
                                    Sign in to Watchly
                                </p>
                                <p style={{ color: 'var(--silver)', fontSize: '0.78rem', margin: '0 0 16px' }}>
                                    Sync your watchlist across devices
                                </p>
                            </div>
                            <button
                                onClick={() => { loginWithGoogle(); setOpen(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: '10px',
                                    width: '100%',
                                    padding: '10px',
                                    background: 'var(--muted)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '8px',
                                    color: 'var(--light)',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'var(--muted)')}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                    ) : (
                        /* Signed in */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {/* Avatar + email */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '36px', height: '36px',
                                    borderRadius: '50%',
                                    background: 'var(--accent, #e50914)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.9rem', fontWeight: '700', color: '#fff',
                                    flexShrink: 0,
                                }}>
                                    {user.email?.[0]?.toUpperCase() ?? '?'}
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ color: 'var(--light)', fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {user.email}
                                    </div>
                                    <div style={{ color: 'var(--silver)', fontSize: '0.72rem' }}>
                                        Signed in
                                    </div>
                                </div>
                            </div>

                            {/* Storage bar */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--silver)', marginBottom: '5px' }}>
                                    <span>Cloud Storage</span>
                                    <span>{usedMB}MB / {limitMB}MB</span>
                                </div>
                                <div style={{ height: '5px', background: 'var(--muted)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${pct}%`, height: '100%',
                                        background: pct > 85 ? '#e50914' : 'var(--silver)',
                                        borderRadius: '3px',
                                        transition: 'width 0.3s',
                                    }} />
                                </div>
                            </div>

                            {/* Sign out */}
                            <button
                                onClick={() => { logout(); setOpen(false); }}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    background: 'transparent',
                                    border: '1px solid var(--muted)',
                                    borderRadius: '8px',
                                    color: 'var(--silver)',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#e50914'; e.currentTarget.style.color = '#e50914'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.color = 'var(--silver)'; }}
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
