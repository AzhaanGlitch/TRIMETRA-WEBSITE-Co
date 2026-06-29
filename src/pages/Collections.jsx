import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { imageUrl } from '../utils/assets.js';

const filters = [
    { id: 'all', label: 'All' },
    { id: 'rings', label: 'Rings' },
    { id: 'necklaces', label: 'Necklaces' },
    { id: 'earrings', label: 'Earrings' },
    { id: 'bracelets', label: 'Bracelets' },
    { id: 'sets', label: 'Sets' }
];

export default function Collections({ products, content, initialFilter }) {
    const [currentFilter, setCurrentFilter] = useState(initialFilter);

    useEffect(() => {
        setCurrentFilter(initialFilter);
    }, [initialFilter]);

    const meta = content.collectionMetadata[currentFilter] || content.collectionMetadata.all;
    const filteredProducts = useMemo(() => {
        if (currentFilter === 'all') return products;
        return products.filter((product) => product.collection === currentFilter);
    }, [currentFilter, products]);

    const handleFilter = (filter) => {
        setCurrentFilter(filter);
        window.location.hash = `#/collections?filter=${filter}`;
    };

    return (
        <div className="collections-page-global-wrapper">
            <div className="collections-page-wrapper fade-in-section">
                <div
                    className="collection-hero-banner"
                    style={{
                        backgroundImage: `linear-gradient(rgba(26, 26, 26, 0.45), rgba(26, 26, 26, 0.65)), url('${imageUrl(meta.image)}')`,
                        backgroundPosition: meta.backgroundPosition || 'center'
                    }}
                >
                    <div className="collection-banner-content fade-in-text">
                        <span className="collection-banner-subtitle">Trimetra Signature</span>
                        <h1 className="collection-banner-title">{meta.title}</h1>
                        <p className="collection-banner-desc">{meta.description}</p>
                    </div>
                </div>

                <div className="filter-tabs-container">
                    {filters.map((filter) => (
                        <button
                            type="button"
                            className={`filter-tab${currentFilter === filter.id ? ' active' : ''}`}
                            key={filter.id}
                            onClick={() => handleFilter(filter.id)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <div className="product-catalog-grid">
                    {filteredProducts.length === 0 ? (
                        <div className="empty-catalog">
                            <i className="far fa-gem" />
                            <h3>No jewelry pieces found</h3>
                            <p>We are currently updating our collection. Please select another category.</p>
                        </div>
                    ) : (
                        filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
                    )}
                </div>
            </div>
        </div>
    );
}
