'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { syncWatchlistToCloud, getWatchlistFromCloud, STORAGE_LIMIT } from '@/lib/supabase';
import { WatchlistItem } from '@/lib/types';

export default function BackupPage() {
    const { user, profile, isAuthenticated, loginWithGoogle } = useAuth();
    const [status, setStatus] = useState('');
    const [syncing, setSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const ls = localStorage.getItem('lastCloudSync');
        if (ls) setLastSync(ls);
    }, []);

    const handleSyncUp = async () => {
        if (!user) return;
        setSyncing(true);
        setStatus('Uploading to cloud...');
        try {
            const watchlist: WatchlistItem[] = JSON.parse(localStorage.getItem('watchlistData') || '[]');
            const size = JSON.stringify(watchlist).length;
            
            if (size > (profile?.storage_limit || STORAGE_LIMIT)) {
                setStatus('Storage limit exceeded. Delete some items and try again.');
                setSyncing(false);
                return;
            }

            const { error } = await syncWatchlistToCloud(user.id, watchlist);
            if (error) {
                setStatus('Sync failed: ' + error.message);
            } else {
                const now = new Date().toLocaleString();
                localStorage.setItem('lastCloudSync', now);
                setLastSync(now);
                setStatus('Successfully synced to cloud!');
            }
        } catch (e) {
            setStatus('Sync failed: ' + (e as Error).message);
        }
        setSyncing(false);
        setTimeout(() => setStatus(''), 4000);
    };

    const handleSyncDown = async () => {
        if (!user) return;
        setSyncing(true);
        setStatus('Downloading from cloud...');
        try {
            const cloudData = await getWatchlistFromCloud(user.id);
            if (cloudData && cloudData.data) {
                localStorage.setItem('watchlistData', JSON.stringify(cloudData.data));
                setStatus('Successfully restored from cloud! Reloading...');
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setStatus('No cloud backup found.');
            }
        } catch (e) {
            setStatus('Restore failed: ' + (e as Error).message);
        }
        setSyncing(false);
        setTimeout(() => setStatus(''), 4000);
    };

    if (!mounted) return <div className="container"><div style={{padding: '40px', textAlign: 'center', color: 'var(--silver)'}}>Loading...</div></div>;

    const storageUsed = profile?.storage_used || 0;
    const storageLimit = profile?.storage_limit || STORAGE_LIMIT;
    const usedKB = (storageUsed / 1024).toFixed(0);
    const limitMB = (storageLimit / (1024 * 1024)).toFixed(0);
    const pct = Math.min(100, (storageUsed / storageLimit) * 100).toFixed(0);

    return (
        <div className="container">
            <header>
                <h1>Cloud Sync</h1>
                <p>Backup and sync your watchlist across devices</p>
            </header>

            <main style={{maxWidth: '600px', margin: '0 auto', padding: '0 20px 40px'}}>
                {status && (
                    <div style={{
                        background: 'var(--muted)',
                        color: 'var(--light)',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        textAlign: 'center',
                    }}>
                        {status}
                    </div>
                )}

                {!isAuthenticated ? (
                    <div style={{
                        background: 'var(--surface)',
                        borderRadius: '12px',
                        padding: '32px',
                        textAlign: 'center',
                        border: '1px solid rgba(195,199,206,0.08)',
                    }}>
                        <h2 style={{fontSize: '1.3rem', fontWeight: '700', color: 'var(--light)', marginBottom: '12px'}}>
                            Sign In to Sync
                        </h2>
                        <p style={{color: 'var(--silver)', marginBottom: '24px', lineHeight: '1.6'}}>
                            Sign in with Google to backup your watchlist to the cloud and sync across all your devices.
                        </p>
                        <button
                            className="add-btn"
                            onClick={loginWithGoogle}
                            style={{display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 32px'}}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335"/>
                            </svg>
                            Sign in with Google
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Account info */}
                        <div style={{
                            background: 'var(--surface)',
                            borderRadius: '12px',
                            padding: '24px',
                            marginBottom: '16px',
                            border: '1px solid rgba(195,199,206,0.08)',
                        }}>
                            <h2 style={{fontSize: '1.2rem', fontWeight: '700', color: 'var(--light)', marginBottom: '16px'}}>
                                Account
                            </h2>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                <span style={{color: 'var(--silver)'}}>Email</span>
                                <span style={{color: 'var(--light)', fontWeight: '600'}}>{user?.email}</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
                                <span style={{color: 'var(--silver)'}}>Storage Used</span>
                                <span style={{color: 'var(--light)', fontWeight: '600'}}>{usedKB} KB / {limitMB} MB</span>
                            </div>
                            <div style={{width: '100%', height: '8px', background: 'var(--muted)', borderRadius: '4px', overflow: 'hidden'}}>
                                <div style={{
                                    width: `${pct}%`,
                                    height: '100%',
                                    background: pct > '90' ? '#ff4444' : 'var(--silver)',
                                    borderRadius: '4px',
                                    transition: 'width 0.3s ease',
                                }} />
                            </div>
                        </div>

                        {/* Sync info */}
                        <div style={{
                            background: 'var(--surface)',
                            borderRadius: '12px',
                            padding: '24px',
                            marginBottom: '16px',
                            border: '1px solid rgba(195,199,206,0.08)',
                        }}>
                            <p style={{color: 'var(--silver)', fontSize: '0.85rem', marginBottom: '4px'}}>
                                Last synced: <strong style={{color: 'var(--light)'}}>{lastSync || 'Never'}</strong>
                            </p>
                        </div>

                        {/* Sync buttons */}
                        <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                            <button
                                className="add-btn"
                                onClick={handleSyncUp}
                                disabled={syncing}
                                style={{flex: 1, minWidth: '150px'}}
                            >
                                {syncing ? 'Syncing...' : 'Sync to Cloud'}
                            </button>
                            <button
                                className="reset-btn"
                                onClick={handleSyncDown}
                                disabled={syncing}
                                style={{flex: 1, minWidth: '150px'}}
                            >
                                Restore from Cloud
                            </button>
                        </div>

                        <div style={{
                            marginTop: '24px',
                            padding: '16px',
                            background: 'rgba(195,199,206,0.05)',
                            borderRadius: '8px',
                            color: 'var(--silver)',
                            fontSize: '0.85rem',
                            lineHeight: '1.6',
                        }}>
                            <strong style={{color: 'var(--light)'}}>How cloud sync works:</strong><br/>
                            • <strong>Sync to Cloud</strong> uploads your current watchlist to your account<br/>
                            • <strong>Restore from Cloud</strong> downloads your cloud backup (replaces local data)<br/>
                            • Storage limit: {limitMB} MB per account<br/>
                            • Your data is private and only accessible with your Google account
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
