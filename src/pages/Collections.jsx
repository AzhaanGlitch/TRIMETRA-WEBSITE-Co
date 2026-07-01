import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { imageUrl } from '../utils/assets.js';

export default function Collections({ products, content, initialFilter }) {
    const [currentFilter, setCurrentFilter] = useState(initialFilter || 'all');

    useEffect(() => {
        setCurrentFilter(initialFilter || 'all');
    }, [initialFilter]);

    const meta = content.collectionMetadata[currentFilter] || content.collectionMetadata.all;

    const filteredProducts = useMemo(() => {
        if (currentFilter === 'all') return products;
        return products.filter((product) => product.collection === currentFilter);
    }, [currentFilter, products]);

    return (
        <div className="collections-page-global-wrapper">
            <div className="collections-page-wrapper fade-in-section">
                <div
                    className="collection-hero-banner"
                    style={{
                        backgroundImage: `radial-gradient(circle at top left, rgba(234, 181, 199, 0.25) 0%, rgba(98, 3, 53, 0.75) 55%, rgba(98, 3, 53, 0.92) 100%), url('${imageUrl(meta.image)}')`,
                        backgroundPosition: meta.backgroundPosition || 'center'
                    }}
                >
                    <div className="collection-banner-content fade-in-text">
                        <span className="collection-banner-subtitle">Trimetra Signature</span>
                        <h1 className="collection-banner-title">{meta.title}</h1>
                        <p className="collection-banner-desc">{meta.description}</p>
                    </div>
                </div>

                <div className="product-catalog-grid" style={{ marginTop: '50px' }}>
                    {filteredProducts.length === 0 ? (
                        <div className="empty-catalog">
                            <i className="far fa-gem" />
                            <h3>No jewelry pieces found</h3>
                            <p>We are currently updating our collection.</p>
                        </div>
                    ) : (
                        filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
                    )}
                </div>
            </div>
        </div>
    );
}
