import { useRef } from 'react';
import ProductCard from './ProductCard.jsx';

export default function FeaturedCarousel({ products }) {
    const trackRef = useRef(null);

    // Triple the list so the loop is seamless at any viewport width
    const items = [...products, ...products, ...products];

    return (
        <div className="fc-marquee-wrapper">
            <div className="fc-marquee-fade fc-marquee-fade-left" />
            <div className="fc-marquee-fade fc-marquee-fade-right" />

            <div
                ref={trackRef}
                className="fc-marquee-track"
                onMouseEnter={() => { if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'; }}
                onMouseLeave={() => { if (trackRef.current) trackRef.current.style.animationPlayState = 'running'; }}
            >
                {items.map((product, i) => (
                    <div className="fc-marquee-item" key={`${product.id}-${i}`}>
                        <ProductCard product={product} featured={product.featured} compactMaterials />
                    </div>
                ))}
            </div>
        </div>
    );
}
