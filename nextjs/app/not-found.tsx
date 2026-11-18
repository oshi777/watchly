import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="container" style={{
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
        }}>
            <h1 style={{fontSize: '5rem', fontWeight: '900', color: 'var(--light)', marginBottom: '10px'}}>404</h1>
            <p style={{fontSize: '1.3rem', color: 'var(--silver)', marginBottom: '30px'}}>
                This page doesn&apos;t exist
            </p>
            <Link href="/" className="btn-primary" style={{
                padding: '12px 32px',
                border: '2px solid var(--muted)',
                borderRadius: '10px',
                color: 'var(--light)',
                textDecoration: 'none',
                fontWeight: '700',
                transition: 'all 0.3s ease',
            }}>
                Back to Watchly
            </Link>
        </div>
    );
}
