'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const supabase = getSupabase();
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                router.push('/');
            } else {
                router.push('/');
            }
        });
    }, [router]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--silver)',
        }}>
            Signing in...
        </div>
    );
}
