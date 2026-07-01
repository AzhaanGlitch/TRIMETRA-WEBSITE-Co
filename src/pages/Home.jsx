import SectionHeader from '../components/SectionHeader.jsx';
import { whatsappLink, imageUrl } from '../utils/assets.js';

export default function Home({ products, content }) {

    return (
        <div className="home-page-wrapper fade-in-section">
            <div className="hero-banner-custom" style={{ position: 'relative' }}>
                <div
                    className="hero-slide active"
                    style={{
                        backgroundImage: `url('${imageUrl('assets/images/Banner.webp')}')`
                    }}
                >
                    <div className="hero-explore-btn-wrap">
                        <a href="#/collections" className="hero-explore-btn">
                            Explore Our Collection
                        </a>
                    </div>
                </div>
            </div>

            <section className="featured-carousel-section">
                <SectionHeader eyebrow="Exceptional Masterpieces" title="Our Collections" />
                <div className="home-categories-grid">
                    {Object.entries(content.collectionMetadata).filter(([key]) => key !== 'all').map(([key, value]) => (
                        <a
                            href={`#/collections?filter=${key}`}
                            className="home-category-card"
                            key={key}
                        >
                            <div className="home-category-img-wrap">
                                <img
                                    src={imageUrl(value.image)}
                                    alt={value.title}
                                    className="home-category-img"
                                    loading="lazy"
                                />
                                <div className="home-category-text-overlay">
                                    <h3>{value.title}</h3>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
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
