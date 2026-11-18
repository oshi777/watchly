import { TMDBResult, TMDBDetail, TMDBSearchResponse } from './types';

const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YTgzYTQ5NWFiMTg0ZGQzMjEzYmVjMjVkMzE2MDc3NiIsIm5iZiI6MTc0OTk1NDQ3Ni44MTcsInN1YiI6IjY4NGUyZmFjNGEzZTQ0Y2Y2ODI5NGM2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OGP__W2OeeziBS4zsFtFWxcqnSwb7-IZ_7XUGGLGcGE';

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

const headers = {
    'Authorization': `Bearer ${TMDB_TOKEN}`,
    'Content-Type': 'application/json',
};

export async function searchTmdb(query: string): Promise<TMDBResult[]> {
    const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false`,
        { headers }
    );
    const data: TMDBSearchResponse = await res.json();
    return (data.results || [])
        .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
        .slice(0, 8);
}

export async function getTmdbDetail(id: number, type: 'movie' | 'tv'): Promise<TMDBDetail> {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}`, { headers });
    return res.json();
}

export async function getTrending(): Promise<TMDBResult[]> {
    const res = await fetch('https://api.themoviedb.org/3/trending/all/week', { headers });
    const data: TMDBSearchResponse = await res.json();
    return data.results || [];
}

export async function getPopularMovies(): Promise<TMDBResult[]> {
    const res = await fetch('https://api.themoviedb.org/3/movie/popular', { headers });
    const data: TMDBSearchResponse = await res.json();
    return data.results || [];
}

export async function getPopularTV(): Promise<TMDBResult[]> {
    const res = await fetch('https://api.themoviedb.org/3/tv/popular', { headers });
    const data: TMDBSearchResponse = await res.json();
    return data.results || [];
}

export function getSection(title: string): string {
    const firstChar = title.charAt(0).toUpperCase();
    if (/[0-9]/.test(firstChar)) return '0-9';
    return firstChar;
}
