export default function ErrorPage({ message }) {
    return (
        <div className="page-loader fade-in-section" style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 500, margin: '0 auto', padding: '40px 20px' }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: 'var(--color-gold)', marginBottom: 10 }} />
            <h2>Encountered an Issue</h2>
            <p style={{ marginBottom: 20 }}>{message}</p>
            <a href="#/home" className="gold-btn" style={{ padding: '10px 24px', fontSize: '0.8rem' }}>Return Home</a>
        </div>
    );
}
