export type WatchStatus = 'watched' | 'currently-watching' | 'upcoming' | 'pending';

export interface Season {
    season?: number;
    date: string;
}

export interface WatchlistItem {
    id: string;
    title: string;
    status: WatchStatus;
    genres: string[];
    year: string;
    date?: string;
    isMovie: boolean;
    tmdbId?: number;
    poster?: string | null;
    section: string;
    seasons?: Season[];
    note?: string;
    overview?: string;
    addedAt?: number;
}

export interface QuickAccessItem {
    id: string;
    itemId: string;
}

export type Theme = 'dark' | 'light' | 'netflix' | 'prime';

export interface TMDBResult {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    release_date?: string;
    first_air_date?: string;
    media_type: 'movie' | 'tv';
    overview?: string;
    genre_ids?: number[];
}

export interface TMDBSearchResponse {
    results: TMDBResult[];
    total_results: number;
}

export interface TMDBDetail {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    overview: string;
    genres: { id: number; name: string }[];
    first_air_date?: string;
    release_date?: string;
    number_of_seasons?: number;
    number_of_episodes?: number;
    runtime?: number;
    episode_run_time?: number[];
}
