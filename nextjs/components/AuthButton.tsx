'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthButton() {
    const { user, profile, loading, loginWithGoogle, logout, isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || loading) {
        return <button className="add-btn" style={{opacity: 0.5, cursor: 'default'}}>Loading...</button>;
    }

    if (isAuthenticated && user) {
        const storageUsed = profile?.storage_used || 0;
        const storageLimit = profile?.storage_limit || 50 * 1024 * 1024;
        const usedMB = (storageUsed / (1024 * 1024)).toFixed(1);
        const limitMB = (storageLimit / (1024 * 1024)).toFixed(0);
        const pct = Math.min(100, (storageUsed / storageLimit) * 100).toFixed(0);

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--light)', fontWeight: '600' }}>
                        {user.email}
                    </span>
                    <span style={{ color: 'var(--silver)' }}>
                        Cloud: {usedMB}MB / {limitMB}MB
                    </span>
                </div>
                <div style={{ width: '60px', height: '4px', background: 'var(--muted)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--silver)', borderRadius: '2px' }} />
                </div>
                <button className="reset-btn" onClick={logout} style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <button
            className="add-btn"
            onClick={loginWithGoogle}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335"/>
            </svg>
            Sign In
        </button>
    );
}
