import { useEffect, useState } from 'react';
import { imageUrl } from '../utils/assets.js';

const navItems = [
    { href: '#/home', label: 'Home', match: '/home' },
    { href: '#/collections', label: 'Collections', match: '/collections' },
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

    useEffect(() => {
        setMenuOpen(false);
    }, [currentPath]);

    useEffect(() => {
        const updateHeader = () => setShrink(window.scrollY > 50);
        updateHeader();
        window.addEventListener('scroll', updateHeader);

        return () => window.removeEventListener('scroll', updateHeader);
    }, []);

    return (
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
    );
}
