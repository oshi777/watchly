'use client';
import { useState, useEffect, useRef } from 'react';
import { getTrending, getPopularMovies, getPopularTV, TMDB_IMAGE_BASE } from '@/lib/tmdb';
import { TMDBResult } from '@/lib/types';

export default function PreviewPage() {
    const [posters, setPosters] = useState<TMDBResult[]>([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchPosters() {
            try {
                const [trending, movies, tv] = await Promise.all([
                    getTrending(),
                    getPopularMovies(),
                    getPopularTV(),
                ]);
                const all = [...trending, ...movies, ...tv]
                    .filter(item => item.poster_path)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 80);
                setPosters(all);
            } catch (e) {
                console.error('Error fetching posters:', e);
            }
            setLoading(false);
        }
        fetchPosters();
    }, []);

    const columns = typeof window !== 'undefined' && window.innerWidth <= 480 ? 3 :
                    typeof window !== 'undefined' && window.innerWidth <= 768 ? 4 : 8;

    return (
        <div style={{position: 'relative', minHeight: '100vh', overflow: 'hidden', background: 'var(--bg)'}}>
            {/* Background poster grid */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0, width: '100%', height: '100%',
                zIndex: 0, overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: '8px', padding: '8px',
                    animation: 'scrollUp 120s linear infinite',
                }}>
                    {[...posters, ...posters].map((item, i) => (
                        <div key={i} style={{
                            width: '100%',
                            aspectRatio: '2/3',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            opacity: 0.4,
                        }}>
                            {item.poster_path && (
                                <img
                                    src={TMDB_IMAGE_BASE + item.poster_path}
                                    alt={item.title || item.name || ''}
                                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                    loading="lazy"
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(180deg, rgba(11,12,14,0.3) 0%, rgba(11,12,14,0.85) 50%, rgba(11,12,14,0.98) 100%)',
                    zIndex: 2,
                }} />
            </div>

            {/* Hero content */}
            <div ref={containerRef} style={{
                position: 'relative', zIndex: 10,
                minHeight: '100vh',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '60px 20px',
            }}>
                <div style={{maxWidth: '900px', textAlign: 'center', animation: 'fadeIn 0.8s ease'}}>
                    <h1 style={{
                        fontSize: '6rem', fontWeight: 900,
                        letterSpacing: '-4px', marginBottom: '24px',
                        color: 'var(--silver)', lineHeight: 1,
                    }}>
                        Watchly
                    </h1>
                    <p style={{
                        fontSize: '1.8rem', fontWeight: 300,
                        color: 'var(--silver)', marginBottom: '16px', lineHeight: 1.4,
                    }}>
                        Your personal entertainment tracker
                    </p>
                    <p style={{
                        fontSize: '1.1rem',
                        color: 'rgba(195,199,206,0.7)',
                        marginBottom: '48px', lineHeight: 1.7,
                        maxWidth: '700px', margin: '0 auto 48px',
                    }}>
                        Keep track of every movie and TV show you watch. Create rankings, sync across devices, and never lose your watchlist again.
                    </p>

                    <div style={{display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '80px', flexWrap: 'wrap'}}>
                        <a href="/" style={{
                            padding: '16px 48px',
                            background: 'transparent',
                            color: 'var(--light)',
                            border: '2px solid var(--muted)',
                            borderRadius: '10px',
                            fontSize: '1.1rem', fontWeight: 700,
                            textDecoration: 'none', display: 'inline-block',
                            transition: 'all 0.3s ease',
                        }}>
                            Get Started
                        </a>
                        <a href="/guide" style={{
                            padding: '16px 48px',
                            background: 'transparent',
                            color: 'var(--light)',
                            border: '2px solid var(--muted)',
                            borderRadius: '10px',
                            fontSize: '1.1rem', fontWeight: 700,
                            textDecoration: 'none', display: 'inline-block',
                            transition: 'all 0.3s ease',
                        }}>
                            Learn More
                        </a>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', maxWidth: '1100px', width: '100%'}}>
                        {[
                            { title: 'Keep Track', desc: 'Organize all your movies and TV shows in one beautiful, easy-to-use interface with powerful search and filters.' },
                            { title: 'Create Rankings', desc: 'Build your personal leaderboard and rank your favorites. See your top picks at a glance and share with friends.' },
                            { title: 'Auto Sync', desc: 'Your watchlist automatically backs up to GitHub Gist. Access from any device, anytime, anywhere.' },
                        ].map((feature, i) => (
                            <div key={i} style={{
                                background: 'rgba(30, 33, 38, 0.4)',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(195,199,206,0.1)',
                                borderRadius: '20px',
                                padding: '48px 36px',
                                textAlign: 'center',
                            }}>
                                <h3 style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--light)', marginBottom: '16px'}}>
                                    {feature.title}
                                </h3>
                                <p style={{fontSize: '1.05rem', color: 'rgba(195,199,206,0.85)', lineHeight: 1.8}}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {loading && (
                <div style={{
                    position: 'fixed', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1.1rem', color: 'var(--muted)', zIndex: 1,
                }}>
                    Loading amazing content...
                </div>
            )}

            <style>{`
                @keyframes scrollUp {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (max-width: 768px) {
                    .features { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
