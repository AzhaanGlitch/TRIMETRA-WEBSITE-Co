import SectionHeader from '../components/SectionHeader.jsx';
import { whatsappLink, imageUrl } from '../utils/assets.js';

function TestimonialSpotlightCard({ testimonial }) {
    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
    };

    return (
        <article className="testimonial-spotlight-card" onMouseMove={handleMouseMove}>
            <div className="testimonial-quote-mark">“</div>
            <div className="testimonial-rating">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <i className="fas fa-star" key={index} />
                ))}
            </div>
            <p className="testimonial-text">{testimonial.text}</p>
            <div className="testimonial-author">
                <div className="testimonial-author-seal">{testimonial.name.charAt(0)}</div>
                <div>
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.role}</span>
                </div>
            </div>
        </article>
    );
}

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

            <div className="home-trust-strip">
                <div className="trust-strip-marquee">
                    <div className="trust-strip-track">
                        {/* First Set */}
                        <div className="trust-strip-item">
                            <i className="fas fa-award" />
                            <span>925 Sterling Silver</span>
                        </div>
                        <div className="trust-strip-divider" />
                        <div className="trust-strip-item">
                            <i className="fas fa-gem" />
                            <span>Gold Plated Jewellery</span>
                        </div>
                        <div className="trust-strip-divider" />
                        <div className="trust-strip-item">
                            <i className="fas fa-certificate" />
                            <span>BIS Hallmarked</span>
                        </div>
                        <div className="trust-strip-divider" />
                        <div className="trust-strip-item">
                            <i className="fas fa-feather-alt" />
                            <span>Handcrafted Designs</span>
                        </div>
                        <div className="trust-strip-divider" />

                        {/* Second Set (Duplicated for infinite marquee loop) */}
                        <div className="trust-strip-item">
                            <i className="fas fa-award" />
                            <span>925 Sterling Silver</span>
                        </div>
                        <div className="trust-strip-divider" />
                        <div className="trust-strip-item">
                            <i className="fas fa-gem" />
                            <span>Gold Plated Jewellery</span>
                        </div>
                        <div className="trust-strip-divider" />
                        <div className="trust-strip-item">
                            <i className="fas fa-certificate" />
                            <span>BIS Hallmarked</span>
                        </div>
                        <div className="trust-strip-divider" />
                        <div className="trust-strip-item">
                            <i className="fas fa-feather-alt" />
                            <span>Handcrafted Designs</span>
                        </div>
                        <div className="trust-strip-divider" />
                    </div>
                </div>
            </div>

            <section className="featured-carousel-section">
                <SectionHeader eyebrow="Exceptional Masterpieces" title="Our Collections" />
                <div className="home-collections-circle-wrapper">
                    {Object.entries(content.collectionMetadata).filter(([key]) => key !== 'all').map(([key, value]) => (
                        <a
                            href={`#/collections?filter=${key}`}
                            className="home-collection-circle-card"
                            key={key}
                        >
                            <div className="circle-image-wrap">
                                <img
                                    src={imageUrl(key === 'sets' ? 'assets/images/set_2_a.webp' : value.image)}
                                    alt={value.title}
                                    className="circle-image"
                                    loading="lazy"
                                    style={{ objectPosition: value.backgroundPosition || 'center' }}
                                />
                            </div>
                            <span className="circle-label">{value.title}</span>
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
                            <TestimonialSpotlightCard testimonial={testimonial} key={testimonial.name} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
