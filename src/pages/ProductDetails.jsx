import { useState, useEffect } from 'react';
import ErrorPage from './ErrorPage.jsx';
import { imageUrl, whatsappLink } from '../utils/assets.js';

export default function ProductDetails({ products, content, productId, addToRecentlyViewed }) {
    const product = products.find((item) => item.id === productId);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (product && addToRecentlyViewed) {
            addToRecentlyViewed(product.id);
        }
    }, [product, addToRecentlyViewed]);

    if (!product) {
        return <ErrorPage message="Product details could not be found. Check if the code is correct." />;
    }

    const message = `Hi Trimetra, I'm interested in the "${product.name}".\n\n`
        + `Reference: ${product.id}\n`
        + `Composition: ${product.materials.join(', ')}\n\n`
        + 'Please advise on its availability and how I may purchase this piece. Thank you!';

    return (
        <div className="product-details-page-wrapper">
            <div className="product-details-container fade-in-section">
                <a href={`#/collections?filter=${product.collection}`} className="back-link">
                    <i className="fas fa-arrow-left" /> Back to {product.collection}
                </a>

                <div className="product-details-grid">
                    <div className="product-gallery">
                        <div className="main-image-viewport">
                            <img src={imageUrl(product.images[selectedImage])} alt={product.name} id="main-product-image" />
                        </div>
                        <div className="gallery-thumbnails">
                            {product.images.map((img, index) => (
                                <button
                                    type="button"
                                    className={`gallery-thumbnail${selectedImage === index ? ' active' : ''}`}
                                    key={img}
                                    onClick={() => setSelectedImage(index)}
                                    aria-label={`Show ${product.name} image ${index + 1}`}
                                >
                                    <img src={imageUrl(img)} alt={`${product.name} detail view ${index + 1}`} loading="lazy" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="product-info-panel">
                        <div className="product-meta-header">
                            <span className="product-detail-collection">{product.collection}</span>
                            <h1 className="product-detail-title">{product.name}</h1>
                            <span className="product-detail-id">REF: {product.id}</span>
                        </div>

                        <div className="divider" />

                        <div className="product-desc-wrap">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        <div className="divider" />

                        <div className="product-materials-wrap">
                            <h3>Composition & Materials</h3>
                            <ul className="materials-list">
                                {product.materials.map((material) => <li key={material}>{material}</li>)}
                            </ul>
                        </div>

                        <div className="divider" />

                        <div className="product-actions">
                            <a href={whatsappLink(content.contact.whatsapp.number, message)} target="_blank" rel="noopener noreferrer" className="whatsapp-enquiry-btn">
                                <i className="fab fa-whatsapp" /> Enquire on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaigns Collage Section */}
            <section className="campaigns-collage-section fade-in-section">
                <div className="campaigns-header">
                    <span className="campaigns-subtitle">Editorial Campaigns</span>
                    <h2 className="campaigns-title">The Victorian Heirloom</h2>
                </div>
                
                <div className="campaigns-grid-collage">
                    <div className="collage-item item-large">
                        <div className="collage-img-wrap">
                            <img src={imageUrl('assets/images/craftsmanship.webp')} alt="Victorian Heirloom" />
                        </div>
                        <div className="collage-content-overlay">
                            <span className="collage-tag">Exclusive Edition</span>
                            <h3>The Victorian Heirloom</h3>
                            <p>A tribute to royal heritage and intricate craftsmanship, meticulously designed for timeless elegance.</p>
                        </div>
                    </div>

                    <a href="#/collections?filter=sets" className="collage-item item-medium">
                        <div className="collage-img-wrap">
                            <img src={imageUrl('assets/images/set_a.webp')} alt="Bridal Sets" />
                        </div>
                        <div className="collage-content-overlay">
                            <h3>Signature Sets</h3>
                            <span className="collage-link-label">Explore Collection <i className="fas fa-chevron-right" /></span>
                        </div>
                    </a>

                    <a href="#/collections?filter=earrings" className="collage-item item-small">
                        <div className="collage-img-wrap">
                            <img src={imageUrl('assets/images/earrings_1.webp')} alt="Fine Earrings" />
                        </div>
                        <div className="collage-content-overlay">
                            <h3>Earrings</h3>
                            <span className="collage-link-label">Explore <i className="fas fa-chevron-right" /></span>
                        </div>
                    </a>

                    <a href="#/collections?filter=rings" className="collage-item item-small">
                        <div className="collage-img-wrap">
                            <img src={imageUrl('assets/images/ring_1.webp')} alt="Bespoke Rings" />
                        </div>
                        <div className="collage-content-overlay">
                            <h3>Rings</h3>
                            <span className="collage-link-label">Explore <i className="fas fa-chevron-right" /></span>
                        </div>
                    </a>

                    <a href="#/collections?filter=bracelets" className="collage-item item-medium-b">
                        <div className="collage-img-wrap">
                            <img src={imageUrl('assets/images/bracelet_11.webp')} alt="Luxury Bracelets" />
                        </div>
                        <div className="collage-content-overlay">
                            <h3>Bangles & Bracelets</h3>
                            <span className="collage-link-label">Explore Collection <i className="fas fa-chevron-right" /></span>
                        </div>
                    </a>

                    <a href="#/collections?filter=necklaces" className="collage-item item-medium">
                        <div className="collage-img-wrap">
                            <img src={imageUrl('assets/images/necklace_3.webp')} alt="Heritage Necklaces" />
                        </div>
                        <div className="collage-content-overlay">
                            <h3>Necklaces</h3>
                            <span className="collage-link-label">Explore Collection <i className="fas fa-chevron-right" /></span>
                        </div>
                    </a>
                </div>
            </section>
        </div>
    );
}
