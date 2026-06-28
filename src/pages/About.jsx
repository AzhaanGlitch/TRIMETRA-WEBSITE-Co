import { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { imageUrl } from '../utils/assets.js';

const icons = ['fa-handshake', 'fa-certificate', 'fa-infinity', 'fa-gem', 'fa-heart', 'fa-seedling'];

export default function About({ content }) {
    const { vision, founderStory, whyChooseUs } = content;
    const [activeIndex, setActiveIndex] = useState(2);
    useScrollReveal();

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % 5);
        }, 4000); // 4 seconds interval for a slower, continuous rotation speed

        return () => clearInterval(timer);
    }, [activeIndex]);



    const handleCardClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <div className="about-page-wrapper fade-in-section">
            <div className="about-hero-section about-hero-animated reveal-on-scroll">
                <span className="section-subtitle">Since Day One</span>
                <h1 className="section-title">The Spirit of Trimetra</h1>
            </div>

            <section className="about-intro-grid reveal-on-scroll">
                <div className="about-intro-text reveal-on-scroll reveal-slide-left" style={{ '--reveal-delay': '120ms' }}>
                    <span className="section-subtitle" style={{ textAlign: 'left', marginBottom: 10 }}>The Visionary Behind the Brand</span>
                    <h2>{founderStory.title}</h2>
                    {founderStory.paragraphs.map((paragraph, index) => (
                        <p className="text-reveal-line" style={{ '--reveal-delay': `${220 + index * 120}ms` }} key={paragraph}>{paragraph}</p>
                    ))}
                </div>
                <div className="brand-story-img image-lift reveal-on-scroll reveal-slide-right" style={{ '--reveal-delay': '220ms' }}>
                    <img src={imageUrl('assets/images/hero.webp')} alt="Trimetra Founder Jewelry Presentation" loading="lazy" />
                </div>
            </section>

            <section className="why-choose-section reveal-on-scroll">
                <div className="reveal-on-scroll">
                    <SectionHeader eyebrow="Responsible Luxury" title={whyChooseUs.title} />
                </div>
                
                <div className="why-choose-carousel-container">
                    <div className="why-choose-carousel-track">
                        {whyChooseUs.items.map((item, index) => {
                            let diff = index - activeIndex;
                            if (diff < -2) diff += 5;
                            if (diff > 2) diff -= 5;

                            const isActive = diff === 0;

                            return (
                                <div
                                    className={`why-choose-carousel-card-wrap position-diff-${diff} ${isActive ? 'active' : ''}`}
                                    key={item.title}
                                    onClick={() => handleCardClick(index)}
                                    style={{
                                        '--card-diff': diff
                                    }}
                                >
                                    <div className="why-card">
                                        <div className="why-card-icon">
                                            <i className={`fas ${icons[index] || 'fa-certificate'}`} />
                                        </div>
                                        <h3>{item.title}</h3>
                                        <p>{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="carousel-dots">
                    {whyChooseUs.items.map((_, index) => (
                        <button
                            type="button"
                            key={index}
                            className={`carousel-dot${activeIndex === index ? ' active' : ''}`}
                            onClick={() => handleCardClick(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            <section className="vision-section reveal-on-scroll" id="vision">
                <div className="vision-card">
                    <h2 className="vision-title">
                        <span className="vision-icon"><i className="far fa-eye" /></span>
                        {vision.title}
                    </h2>
                    {vision.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
            </section>
        </div>
    );
}
