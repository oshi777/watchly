import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata: Metadata = {
    title: 'Watchly - Your Personal Watchlist',
    description: 'Track, Organize, Discover - Your personal entertainment tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <script dangerouslySetInnerHTML={{__html: `
                    (function() {
                        try {
                            var theme = localStorage.getItem('theme') || 'dark';
                            document.documentElement.setAttribute('data-theme', theme);
                            if (!localStorage.getItem('theme')) {
                                localStorage.setItem('theme', 'dark');
                            }
                        } catch(e) {
                            document.documentElement.setAttribute('data-theme', 'dark');
                        }
                    })();
                `}} />
            </head>
            <body>
                <ThemeProvider>
                    <Navbar />
                    {children}
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
