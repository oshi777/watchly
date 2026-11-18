'use client';
import { useState, useEffect, useCallback } from 'react';
import { getSupabase, signInWithGoogle, signOut, getUserProfile, UserProfile } from '@/lib/supabase';

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        
        const supabase = getSupabase();
        
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                getUserProfile(session.user.id).then(p => setProfile(p));
            }
            setLoading(false);
        }).catch(() => setLoading(false));

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    setUser(session.user);
                    const p = await getUserProfile(session.user.id);
                    setProfile(p);
                } else {
                    setUser(null);
                    setProfile(null);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, [mounted]);

    const loginWithGoogle = useCallback(async () => {
        return signInWithGoogle();
    }, []);

    const logout = useCallback(async () => {
        await signOut();
        setUser(null);
        setProfile(null);
    }, []);

    const refreshProfile = useCallback(async (userId: string) => {
        const p = await getUserProfile(userId);
        setProfile(p);
    }, []);

    return {
        user,
        profile,
        loading: !mounted || loading,
        loginWithGoogle,
        logout,
        refreshProfile,
        isAuthenticated: !!user,
    };
}
