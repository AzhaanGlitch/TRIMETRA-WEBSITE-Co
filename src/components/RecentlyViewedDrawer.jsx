import { useState, useEffect } from 'react';
import { imageUrl, whatsappLink } from '../utils/assets.js';

export default function RecentlyViewedDrawer({ recentlyViewedIds, products, content, clearRecentlyViewed, currentPath }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolledPast, setScrolledPast] = useState(true);

    // Map IDs to actual product objects in order
    const viewedProducts = recentlyViewedIds
        .map((id) => products.find((item) => item.id === id))
        .filter(Boolean);

    // Hide drawer trigger on home page when scroll position is at the very top (above 300px)
    useEffect(() => {
        const isHome = currentPath === '/' || currentPath === '/home';
        
        if (!isHome) {
            setScrolledPast(true);
            return;
        }

        const handleScroll = () => {
            setScrolledPast(window.scrollY > 300);
        };

        // Initialize state
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPath]);

    // Close drawer when escape key is pressed
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            // Prevent background scrolling when drawer is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const getWhatsAppLink = (product) => {
        const message = `Hi Trimetra, I'm interested in the "${product.name}" that I recently viewed.\n\n`
            + `Reference: ${product.id}\n`
            + `Composition: ${product.materials.join(', ')}\n\n`
            + 'Please advise on its availability. Thank you!';
        return whatsappLink(content.contact.whatsapp.number, message);
    };

    return (
        <>
            {/* Floating Trigger Tab on the Right Edge */}
            <button
                type="button"
                className={`recently-viewed-trigger${isOpen ? ' hidden' : ''}${!scrolledPast ? ' hidden' : ''}`}
                onClick={() => setIsOpen(true)}
                aria-label="Open recently viewed items panel"
            >
                <div className="trigger-content">
                    <i className="fas fa-history" />
                    <span className="trigger-text">Recently Viewed</span>
                    {viewedProducts.length > 0 && (
                        <span className="trigger-badge">{viewedProducts.length}</span>
                    )}
                </div>
            </button>

            {/* Backdrop Overlay */}
            <div
                className={`recently-viewed-backdrop${isOpen ? ' active' : ''}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />

            {/* Slide-out Drawer */}
            <aside className={`recently-viewed-drawer${isOpen ? ' open' : ''}`}>
                <div className="drawer-header">
                    <div className="header-title-area">
                        <h2>Recently Viewed</h2>
                        {viewedProducts.length > 0 && (
                            <button
                                type="button"
                                className="clear-all-btn"
                                onClick={clearRecentlyViewed}
                                aria-label="Clear all recently viewed items"
                            >
                                <i className="far fa-trash-alt" /> Clear All
                            </button>
                        )}
                    </div>
                    <button
                        type="button"
                        className="close-drawer-btn"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close drawer"
                    >
                        <i className="fas fa-times" />
                    </button>
                </div>

                <div className="drawer-body">
                    {viewedProducts.length === 0 ? (
                        <div className="drawer-empty-state">
                            <div className="empty-icon-wrap">
                                <i className="far fa-eye" />
                            </div>
                            <p>You haven't viewed any products yet.</p>
                            <a
                                href="#/collections"
                                className="explore-btn"
                                onClick={() => setIsOpen(false)}
                            >
                                Explore Collections
                            </a>
                        </div>
                    ) : (
                        <div className="drawer-products-list">
                            {viewedProducts.map((product) => (
                                <div className="drawer-product-card animate-list-item" key={product.id}>
                                    <a
                                        href={`#/product/${product.id}`}
                                        className="drawer-product-img-wrap"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <img
                                            src={imageUrl(product.images[0])}
                                            alt={product.name}
                                            loading="lazy"
                                            style={{ objectPosition: product.objectPosition || 'center' }}
                                        />
                                    </a>
                                    <div className="drawer-product-info">
                                        <span className="drawer-product-collection">{product.collection}</span>
                                        <a
                                            href={`#/product/${product.id}`}
                                            className="drawer-product-title"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {product.name}
                                        </a>
                                        <span className="drawer-product-price">{product.price}</span>
                                    </div>
                                    <div className="drawer-product-actions">
                                        <a
                                            href={getWhatsAppLink(product)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="drawer-whatsapp-btn"
                                            aria-label={`Enquire about ${product.name} on WhatsApp`}
                                            title="Enquire on WhatsApp"
                                        >
                                            <i className="fab fa-whatsapp" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
