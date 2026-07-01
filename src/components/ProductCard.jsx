import { useState, useEffect } from 'react';
import { imageUrl } from '../utils/assets.js';

export default function ProductCard({ product, featured = false, compactMaterials = false }) {
    const [isRecentlyViewed, setIsRecentlyViewed] = useState(false);
    const [aspectRatio, setAspectRatio] = useState('square');
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

    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        if (naturalWidth > naturalHeight * 1.1) {
            setAspectRatio('landscape');
        } else {
            setAspectRatio('cover-style');
        }
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
                        className={`product-card-img is-${aspectRatio}`}
                        loading="lazy"
                        onLoad={handleImageLoad}
                    />
                </div>
                <div className="product-card-info">
                    <span className="product-card-collection">{product.collection}</span>
                    <h3 className="product-card-title">{product.name}</h3>
                    <p className="product-card-materials">{materials}</p>
                </div>
            </a>
            <div className="product-card-footer">
                <a href={`#/product/${product.id}`} className="product-card-btn">
                    Details <i className="fas fa-arrow-right" />
                </a>
            </div>
        </div>
    );
}

