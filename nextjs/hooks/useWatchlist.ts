'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { WatchlistItem, WatchStatus, Season } from '@/lib/types';
import { syncWatchlistToCloud, getWatchlistFromCloud } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function useWatchlist() {
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [genreFilter, setGenreFilter] = useState('all');
    const { user, isAuthenticated, refreshProfile } = useAuth();

    // Track whether we've already loaded from cloud for this session
    const cloudLoadedRef = useRef(false);
    // Debounce timer for cloud sync
    const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('watchlistData');
            if (saved) {
                const data: WatchlistItem[] = JSON.parse(saved);
                data.forEach((item, i) => {
                    if (!item.id) item.id = 'item_' + Date.now() + '_' + i;
                });
                setItems(data);
            }
        } catch (e) {
            console.error('Failed to load watchlist data');
        }
        setMounted(true);
    }, []);

    // Auto-load from cloud when user logs in (once per session)
    useEffect(() => {
        if (!isAuthenticated || !user || cloudLoadedRef.current || !mounted) return;
        cloudLoadedRef.current = true;

        // Skip cloud pull if user just imported — local data is already correct
        if (localStorage.getItem('justImported') === 'true') {
            localStorage.removeItem('justImported');
            return;
        }

        getWatchlistFromCloud(user.id).then(cloudData => {
            if (cloudData?.watchlistData && Array.isArray(cloudData.watchlistData) && cloudData.watchlistData.length > 0) {
                const data: WatchlistItem[] = cloudData.watchlistData;
                data.forEach((item, i) => {
                    if (!item.id) item.id = 'item_' + Date.now() + '_' + i;
                    if (!item.section) {
                        const c = item.title.charAt(0).toUpperCase();
                        item.section = /[0-9]/.test(c) ? '0-9' : c;
                    }
                });
                localStorage.setItem('watchlistData', JSON.stringify(data));
                // Restore rankings and quick access
                if (cloudData.watchlistRankings?.length) {
                    localStorage.setItem('watchlistRankings', JSON.stringify(cloudData.watchlistRankings));
                }
                if (cloudData.rankings?.length) {
                    localStorage.setItem('rankings', JSON.stringify(cloudData.rankings));
                }
                if (cloudData.quickAccess?.length) {
                    localStorage.setItem('quickAccess', JSON.stringify(cloudData.quickAccess));
                }
                // Restore settings
                if (cloudData.settings) {
                    const s = cloudData.settings;
                    if (s.theme) { localStorage.setItem('theme', s.theme); document.documentElement.setAttribute('data-theme', s.theme); }
                    if (s.posterDisplayMode) localStorage.setItem('posterDisplayMode', s.posterDisplayMode);
                    if (s.listGroupingMode) localStorage.setItem('listGroupingMode', s.listGroupingMode);
                    if (s.quickAccessEnabled !== undefined) localStorage.setItem('quickAccessEnabled', s.quickAccessEnabled);
                    if (s.leaderboardEnabled !== undefined) localStorage.setItem('leaderboardEnabled', s.leaderboardEnabled);
                    if (s.syncMode) localStorage.setItem('syncMode', s.syncMode);
                    if (s.appTimezone) localStorage.setItem('appTimezone', s.appTimezone);
                }
                setItems(data);
            } else {
                const local: WatchlistItem[] = JSON.parse(localStorage.getItem('watchlistData') || '[]');
                if (local.length > 0) {
                    syncWatchlistToCloud(user.id, local).catch(() => {});
                }
            }
        }).catch(() => {});
    }, [isAuthenticated, user, mounted]);

    // Reset cloudLoaded when user logs out
    useEffect(() => {
        if (!isAuthenticated) {
            cloudLoadedRef.current = false;
        }
    }, [isAuthenticated]);

    const saveToStorage = useCallback((newItems: WatchlistItem[]) => {
        localStorage.setItem('watchlistData', JSON.stringify(newItems));
    }, []);

    // Debounced cloud sync — fires 800ms after last change
    const scheduleSyncToCloud = useCallback((newItems: WatchlistItem[]) => {
        if (!isAuthenticated || !user) return;
        if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
        syncTimerRef.current = setTimeout(() => {
            syncWatchlistToCloud(user.id, newItems)
                .then(() => refreshProfile(user.id))
                .catch(() => {});
        }, 800);
    }, [isAuthenticated, user, refreshProfile]);

    const save = useCallback((newItems: WatchlistItem[]) => {
        saveToStorage(newItems);
        scheduleSyncToCloud(newItems);
    }, [saveToStorage, scheduleSyncToCloud]);

    const formatDate = (dateStr: string, dateType: 'full' | 'year'): string => {
        if (!dateStr) return '';
        if (dateType === 'year') return dateStr;
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const addItem = useCallback((item: Omit<WatchlistItem, 'id' | 'section'>) => {
        const sectionChar = item.title.charAt(0).toUpperCase();
        const sectionKey = /[0-9]/.test(sectionChar) ? '0-9' : sectionChar;
        const newItem: WatchlistItem = {
            ...item,
            id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            section: sectionKey,
            seasons: item.seasons || [],
            addedAt: Date.now(),
        };
        if (newItem.status === 'watched' && !newItem.date) {
            newItem.date = new Date().toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        }
        setItems(prev => {
            const updated = [...prev, newItem];
            save(updated);
            return updated;
        });
    }, [save]);

    const deleteItem = useCallback((id: string) => {
        setItems(prev => {
            const updated = prev.filter(item => item.id !== id);
            save(updated);
            return updated;
        });
    }, [save]);

    const updateItem = useCallback((id: string, updates: Partial<WatchlistItem>) => {
        setItems(prev => {
            const updated = prev.map(item =>
                item.id === id ? { ...item, ...updates } : item
            );
            save(updated);
            return updated;
        });
    }, [save]);

    const toggleWatchStatus = useCallback((id: string) => {
        setItems(prev => {
            const updated = prev.map(item => {
                if (item.id === id) {
                    if (item.status === 'watched') {
                        return { ...item, status: 'pending' as WatchStatus, date: undefined };
                    } else {
                        return {
                            ...item,
                            status: 'watched' as WatchStatus,
                            date: new Date().toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric'
                            }),
                            addedAt: Date.now(),
                        };
                    }
                }
                return item;
            });
            save(updated);
            return updated;
        });
    }, [save]);

    const addSeason = useCallback((id: string, season: Season) => {
        setItems(prev => {
            const updated = prev.map(item => {
                if (item.id === id) {
                    const seasons = [...(item.seasons || [])];
                    const existing = seasons.findIndex(s => s.season === season.season);
                    if (existing >= 0) {
                        seasons[existing] = season;
                    } else {
                        seasons.push(season);
                        seasons.sort((a, b) => (a.season || 0) - (b.season || 0));
                    }
                    return { ...item, seasons };
                }
                return item;
            });
            save(updated);
            return updated;
        });
    }, [save]);

    const deleteSeason = useCallback((id: string, seasonIndex: number) => {
        setItems(prev => {
            const updated = prev.map(item => {
                if (item.id === id) {
                    const seasons = (item.seasons || []).filter((_, i) => i !== seasonIndex);
                    return { ...item, seasons };
                }
                return item;
            });
            save(updated);
            return updated;
        });
    }, [save]);

    const editItem = useCallback((id: string, updates: Omit<WatchlistItem, 'id' | 'section'>) => {
        setItems(prev => {
            const updated = prev.map(item => {
                if (item.id === id) {
                    return { ...item, ...updates, seasons: item.seasons || [] };
                }
                return item;
            });
            save(updated);
            return updated;
        });
    }, [save]);

    const resetAll = useCallback(() => {
        setItems([]);
        localStorage.removeItem('watchlistData');
        localStorage.removeItem('watchlistRankings');
        if (isAuthenticated && user) {
            syncWatchlistToCloud(user.id, []).catch(() => {});
        }
    }, [isAuthenticated, user]);

    const importData = useCallback((watchlistItems: WatchlistItem[]) => {
        // Just set the watchlist items and push to cloud
        // All other localStorage keys (rankings, quickAccess) are written by handleImport in page.tsx
        setItems(watchlistItems);
        localStorage.setItem('watchlistData', JSON.stringify(watchlistItems));
        localStorage.setItem('justImported', 'true');

        if (isAuthenticated && user) {
            syncWatchlistToCloud(user.id, watchlistItems)
                .then(() => {
                    refreshProfile(user.id);
                    window.location.reload();
                })
                .catch(() => window.location.reload());
        } else {
            window.location.reload();
        }
    }, [isAuthenticated, user, refreshProfile]);

    const filtered = items.filter(item => {
        const searchNoSpaces = searchTerm.toLowerCase().replace(/\s+/g, '');
        const titleNoSpaces = item.title.toLowerCase().replace(/\s+/g, '');
        const matchesSearch = !searchNoSpaces ||
            titleNoSpaces.includes(searchNoSpaces) ||
            (item.genres || []).some(g => g.toLowerCase().replace(/\s+/g, '').includes(searchNoSpaces));
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesGenre = genreFilter === 'all' || (item.genres || []).includes(genreFilter);
        return matchesSearch && matchesStatus && matchesGenre;
    });

    const stats = {
        total: items.length,
        watched: items.filter(i => i.status === 'watched').length,
        upcoming: items.filter(i => i.status === 'upcoming').length,
    };

    const allGenres = Array.from(new Set(items.flatMap(i => i.genres || []))).sort();

    return {
        items, filtered, stats, allGenres,
        searchTerm, setSearchTerm,
        statusFilter, setStatusFilter,
        genreFilter, setGenreFilter,
        addItem, deleteItem, updateItem, editItem,
        toggleWatchStatus, addSeason, deleteSeason,
        resetAll, importData, mounted,
        formatDate,
    };
}
