import { useEffect, useState } from 'react';
import { imageUrl } from '../utils/assets.js';

const navItems = [
    { href: '#/home', label: 'Home', match: '/home' },
    { href: '#/about', label: 'About Us', match: '/about' },
    { href: '#/contact', label: 'Contact', match: '/contact' }
];

function isActive(currentPath, item) {
    if ((currentPath === '/' || currentPath === '/home') && item.match === '/home') return true;
    return item.match !== '/home' && currentPath.startsWith(item.match);
}

export default function Header({ currentPath }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [shrink, setShrink] = useState(false);

    // Mock live rates states that fluctuate realistically
    const [gold24, setGold24] = useState(7245.50);
    const [gold22, setGold22] = useState(6641.80);
    const [silver, setSilver] = useState(91.20);

    useEffect(() => {
        setMenuOpen(false);
    }, [currentPath]);

    useEffect(() => {
        const updateHeader = () => setShrink(window.scrollY > 50);
        updateHeader();
        window.addEventListener('scroll', updateHeader);

        // Fluctuate rates realistically every 4 seconds
        const interval = setInterval(() => {
            setGold24((prev) => +(prev + (Math.random() - 0.5) * 1.5).toFixed(2));
            setGold22((prev) => +(prev + (Math.random() - 0.5) * 1.3).toFixed(2));
            setSilver((prev) => +(prev + (Math.random() - 0.5) * 0.08).toFixed(2));
        }, 4000);

        return () => {
            window.removeEventListener('scroll', updateHeader);
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <div className="live-rates-bar">
                <span className="live-rates-content">
                    <span className="live-pulse">🟢</span> Live Rate (per g) &nbsp;|&nbsp; Silver: <strong>₹{silver.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>|&nbsp; Gold 24K: <strong>₹{gold24.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> &nbsp;|&nbsp; Gold 22K: <strong>₹{gold22.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </span>
            </div>

            <header className={`luxury-header${shrink ? ' shrink' : ''}`}>
                <div className="header-container">
                    <div className="logo-container">
                        <a href="#/home" className="brand-logo">
                            <img src={imageUrl('assets/images/logo.png')} alt="TRIMETRA logo" className="site-logo" />
                        </a>
                    </div>

                    <button
                        className={`nav-toggle${menuOpen ? ' open' : ''}`}
                        aria-label="Toggle navigation menu"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <span className="hamburger" />
                    </button>

                    <nav className={`nav-menu${menuOpen ? ' open' : ''}`}>
                        <ul className="nav-list">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <a href={item.href} className={`nav-link${isActive(currentPath, item) ? ' active' : ''}`}>
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
}
