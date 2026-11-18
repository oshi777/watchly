'use client';
import { useState, useEffect, useCallback } from 'react';
import { WatchlistItem, WatchStatus, Season } from '@/lib/types';
import { getSection } from '@/lib/tmdb';

export function useWatchlist() {
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [genreFilter, setGenreFilter] = useState('all');

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

    const saveToStorage = useCallback((newItems: WatchlistItem[]) => {
        localStorage.setItem('watchlistData', JSON.stringify(newItems));
    }, []);

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
        // Auto-set date if watched and no date
        if (newItem.status === 'watched' && !newItem.date) {
            newItem.date = new Date().toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        }
        setItems(prev => {
            const updated = [...prev, newItem];
            saveToStorage(updated);
            return updated;
        });
    }, [saveToStorage]);

    const deleteItem = useCallback((id: string) => {
        setItems(prev => {
            const updated = prev.filter(item => item.id !== id);
            saveToStorage(updated);
            return updated;
        });
    }, [saveToStorage]);

    const updateItem = useCallback((id: string, updates: Partial<WatchlistItem>) => {
        setItems(prev => {
            const updated = prev.map(item =>
                item.id === id ? { ...item, ...updates } : item
            );
            saveToStorage(updated);
            return updated;
        });
    }, [saveToStorage]);

    const toggleWatchStatus = useCallback((id: string) => {
        setItems(prev => {
            const updated = prev.map(item => {
                if (item.id === id) {
                    if (item.status === 'watched') {
                        // Unwatch - set to pending, clear date
                        return { ...item, status: 'pending' as WatchStatus, date: undefined };
                    } else {
                        // Mark as watched - set date to today AND update addedAt for history time
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
            saveToStorage(updated);
            return updated;
        });
    }, [saveToStorage]);

    const addSeason = useCallback((id: string, season: Season) => {
        setItems(prev => {
            const updated = prev.map(item => {
                if (item.id === id) {
                    const seasons = item.seasons || [];
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
            saveToStorage(updated);
            return updated;
        });
    }, [saveToStorage]);

    const deleteSeason = useCallback((id: string, seasonIndex: number) => {
        setItems(prev => {
            const updated = prev.map(item => {
                if (item.id === id) {
                    const seasons = (item.seasons || []).filter((_, i) => i !== seasonIndex);
                    return { ...item, seasons };
                }
                return item;
            });
            saveToStorage(updated);
            return updated;
        });
    }, [saveToStorage]);

    const editItem = useCallback((id: string, updates: Omit<WatchlistItem, 'id' | 'section'>) => {
        setItems(prev => {
            const updated = prev.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        ...updates,
                        seasons: item.seasons || [],
                    };
                }
                return item;
            });
            saveToStorage(updated);
            return updated;
        });
    }, [saveToStorage]);

    const resetAll = useCallback(() => {
        setItems([]);
        localStorage.removeItem('watchlistData');
        localStorage.removeItem('watchlistRankings');
    }, []);

    const importData = useCallback((data: any) => {
        let newItems: WatchlistItem[] = [];
        if (Array.isArray(data)) {
            newItems = data;
        } else if (data.watchlistData) {
            newItems = data.watchlistData;
            // Handle rankings import
            if (data.rankings) {
                const rankings = data.rankings;
                let rankingIds: string[] = [];
                if (rankings.length > 0) {
                    if (typeof rankings[0] === 'string') {
                        rankingIds = rankings;
                    } else if (rankings[0].id) {
                        rankingIds = rankings.map((r: any) => r.id);
                    }
                }
                localStorage.setItem('watchlistRankings', JSON.stringify(rankingIds));
            }
        }
        newItems.forEach((item, i) => {
            if (!item.id) item.id = 'item_' + Date.now() + '_' + i;
            if (!item.section) {
                const sectionChar = item.title.charAt(0).toUpperCase();
                item.section = /[0-9]/.test(sectionChar) ? '0-9' : sectionChar;
            }
        });
        setItems(newItems);
        saveToStorage(newItems);
    }, [saveToStorage]);

    // Filter: search includes title AND genres (spaces removed for matching)
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
