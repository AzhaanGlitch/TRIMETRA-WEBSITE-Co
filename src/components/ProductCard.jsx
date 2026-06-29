import { imageUrl } from '../utils/assets.js';

export default function ProductCard({ product, featured = false, compactMaterials = false }) {
    const materials = compactMaterials ? product.materials[0] : product.materials.join(', ');

    return (
        <div className="product-card fade-in-section">
            {featured && <div className="product-card-badge">Featured</div>}
            <div className="product-card-img-wrap">
                <img
                    src={imageUrl(product.images[0])}
                    alt={product.name}
                    className="product-card-img"
                    loading="lazy"
                    style={{ objectPosition: product.objectPosition || 'center' }}
                />
            </div>
            <div className="product-card-info">
                <span className="product-card-collection">{product.collection}</span>
                <h3 className="product-card-title">{product.name}</h3>
                <p className="product-card-materials">{materials}</p>
            </div>
            <div className="product-card-footer">
                <a href={`#/product/${product.id}`} className="product-card-btn">
                    Details <i className="fas fa-arrow-right" />
                </a>
            </div>
        </div>
    );
}
