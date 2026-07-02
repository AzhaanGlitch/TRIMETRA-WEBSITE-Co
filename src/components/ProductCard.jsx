import { useState, useEffect } from 'react';
import { imageUrl } from '../utils/assets.js';

export default function ProductCard({ product, featured = false, compactMaterials = false }) {
    const [isRecentlyViewed, setIsRecentlyViewed] = useState(false);
    const materials = compactMaterials ? product.materials[0] : product.materials.join(', ');

    useEffect(() => {
        try {
            const saved = localStorage.getItem('trimetra_recently_viewed');
            if (saved) {
                const ids = JSON.parse(saved);
                setIsRecentlyViewed(ids.includes(product.id));
            }
        } catch (e) {
            // Ignore
        }
    }, [product.id]);

    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className="product-card fade-in-section">
            <a href={`#/product/${product.id}`} className="product-card-link-wrapper">
                <div className="product-card-img-wrap">
                    {featured && <div className="product-card-badge">Featured</div>}
                    {isRecentlyViewed && (
                        <div className="product-card-badge recently-viewed-badge">
                            <i className="far fa-clock" /> Recently Viewed
                        </div>
                    )}
                    <img
                        src={imageUrl(product.images[0])}
                        alt={product.name}
                        className={`product-card-img primary-image ${product.images[1] ? 'has-hover' : ''}`}
                        loading="lazy"
                        style={{ objectPosition: product.objectPosition || 'center' }}
                    />
                    {product.images[1] && (
                        <img
                            src={imageUrl(product.images[1])}
                            alt={`${product.name} alternate view`}
                            className="product-card-img hover-image"
                            loading="lazy"
                            style={{ objectPosition: product.objectPosition || 'center' }}
                        />
                    )}
                    
                    {/* Wishlist Heart Icon */}
                    <button 
                        className={`product-card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                        onClick={handleWishlistClick}
                        aria-label="Add to wishlist"
                    >
                        <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`} />
                    </button>
                </div>
                <div className="product-card-info">
                    <span className="product-card-collection">{product.collection}</span>
                    <h3 className="product-card-title">{product.name}</h3>
                    <p className="product-card-materials">{materials}</p>
                </div>
            </a>
        </div>
    );
}
