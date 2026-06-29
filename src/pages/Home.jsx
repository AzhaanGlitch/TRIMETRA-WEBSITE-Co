import { useEffect, useState } from 'react';
import FeaturedCarousel from '../components/FeaturedCarousel.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { whatsappLink } from '../utils/assets.js';

const HERO_TITLE = 'TRIMETRA';

export default function Home({ products, content }) {
    const [typingStarted, setTypingStarted] = useState(false);
    const [typedText, setTypedText] = useState('');
    const featuredProducts = products.filter((product) => product.featured);

    useEffect(() => {
        const timeout = setTimeout(() => setTypingStarted(true), 400);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (!typingStarted) return undefined;
        if (typedText.length >= HERO_TITLE.length) return undefined;
        const timeout = setTimeout(() => {
            setTypedText(HERO_TITLE.slice(0, typedText.length + 1));
        }, 110);
        return () => clearTimeout(timeout);
    }, [typingStarted, typedText]);

    return (
        <div className="fade-in-section">
            <section className="hero-banner-custom">
                <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
                    <defs>
                        <clipPath id="wedge-clip" clipPathUnits="objectBoundingBox">
                            <path d="M 0.05,0.28 C 0.02,0.28 0,0.32 0,0.38 L 0,0.62 C 0,0.68 0.02,0.72 0.05,0.72 L 0.85,0.96 C 0.92,0.98 1,0.8 1,0.5 C 1,0.2 0.92,0.02 0.85,0.04 Z" />
                        </clipPath>
                    </defs>
                </svg>

                <div className="hero-cta-overlay">
                    <h2 className="hero-cta-title">
                        <span className="typewriter-text">{typedText}</span>
                        <span className={`typewriter-cursor${typedText.length >= HERO_TITLE.length ? ' done' : ''}`}>|</span>
                    </h2>
                    <p className="hero-cta-tagline">Trust Transformed into Timeless Elegance</p>
                    <a
                        href="#/collections"
                        className="gold-btn hero-cta-btn"
                    >
                        <i className="fas fa-shopping-bag" /> Check our Collection
                    </a>
                </div>
            </section>

            <section className="featured-carousel-section">
                <SectionHeader eyebrow="Exceptional Masterpieces" title="Featured Creations" />
                <FeaturedCarousel products={featuredProducts} />
            </section>

            <section className="home-cta-banner">
                <div className="home-cta-content">
                    <h2>Bespoke Creations</h2>
                    <p>Looking for a custom length, specific diamond grade, or a completely personalized design? Connect with our master concierge via WhatsApp for dedicated advice.</p>
                    <a
                        href={whatsappLink(content.contact.whatsapp.number, 'Hello Trimetra, I would like to consult on a custom/bespoke jewelry piece.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gold-btn"
                    >
                        <i className="fab fa-whatsapp" /> Chat with Concierge
                    </a>
                </div>
            </section>

            <section className="testimonials-burgundy-section">
                <div className="testimonials-container">
                    <SectionHeader eyebrow="Stories from our clients" title="Testimonials" />
                    <div className="testimonials-grid">
                        {content.testimonials.map((testimonial) => (
                            <div className="testimonial-card" key={testimonial.name}>
                                <div className="testimonial-rating">
                                    {Array.from({ length: testimonial.rating }).map((_, index) => (
                                        <i className="fas fa-star" key={index} />
                                    ))}
                                </div>
                                <p className="testimonial-text">"{testimonial.text}"</p>
                                <div className="testimonial-author">
                                    <h4>{testimonial.name}</h4>
                                    <span>{testimonial.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
