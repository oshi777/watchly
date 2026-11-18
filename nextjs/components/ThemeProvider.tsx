'use client';
import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Theme is already set by inline script in layout.tsx head
        // Just ensure it stays in sync
        const theme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    return <>{children}</>;
}
