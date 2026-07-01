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
        </div>
    );
}
