import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Storage limit per user in bytes (5MB)
export const STORAGE_LIMIT = 5 * 1024 * 1024;

export interface UserProfile {
    id: string;
    email: string;
    storage_used: number;
    storage_limit: number;
    created_at: string;
}

// Lazy singleton - only creates client on first access (client-side)
let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
    if (supabaseInstance) return supabaseInstance;
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
    
    supabaseInstance = createClient(url, key, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
    });
    
    return supabaseInstance;
}

export async function signInWithGoogle() {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });
    return { data, error };
}

export async function signOut() {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function getCurrentUser() {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) return null;
    return data;
}

export async function syncWatchlistToCloud(userId: string, watchlist: any[]) {
    const supabase = getSupabase();

    // Bundle all important localStorage data
    const payload = {
        watchlistData: watchlist,
        watchlistRankings: JSON.parse(localStorage.getItem('watchlistRankings') || '[]'),
        rankings: JSON.parse(localStorage.getItem('rankings') || '[]'),
        quickAccess: JSON.parse(localStorage.getItem('quickAccess') || '[]'),
    };

    const size = JSON.stringify(payload).length;

    const { data, error } = await supabase
        .from('watchlists')
        .upsert({
            user_id: userId,
            data: payload,
            updated_at: new Date().toISOString(),
            size,
        }, { onConflict: 'user_id' });

    // Update storage_used in profile
    if (!error) {
        await supabase
            .from('profiles')
            .update({ storage_used: size })
            .eq('id', userId);
    }

    return { data, error };
}

export async function getWatchlistFromCloud(userId: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('watchlists')
        .select('data, updated_at, size')
        .eq('user_id', userId)
        .single();

    if (error) return null;

    // Handle both old format (plain array) and new format (object with keys)
    const raw = data.data;
    if (Array.isArray(raw)) {
        // Old format — just watchlist array
        return { watchlistData: raw, watchlistRankings: [], rankings: [], quickAccess: [] };
    }
    return raw as {
        watchlistData: any[];
        watchlistRankings: string[];
        rankings: string[];
        quickAccess: any[];
    };
}
