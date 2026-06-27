import { imageUrl, whatsappLink } from '../utils/assets.js';

export default function Footer({ content }) {
    const { brand, contact } = content;

    return (
        <footer className="luxury-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <a href="#/home" className="footer-logo">
                        <img src={imageUrl('assets/images/logo.png')} alt="TRIMETRA logo" className="site-logo footer-site-logo" />
                    </a>
                    <p className="footer-tagline">{brand.tagline}</p>
                    <div className="footer-insta-wrap">
                        <a href={contact.instagram.url} target="_blank" rel="noopener noreferrer" className="footer-insta-link">
                            <i className="fab fa-instagram" /> <span>{contact.instagram.handle}</span>
                        </a>
                    </div>
                    <div className="footer-socials">
                        <a href={whatsappLink(contact.whatsapp.number, contact.whatsapp.message)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                            <i className="fab fa-whatsapp" />
                        </a>
                        <a href={`mailto:${contact.email.address}`} aria-label="Email">
                            <i className="far fa-envelope" />
                        </a>
                    </div>
                </div>

                <div className="footer-links-col">
                    <h3>Collections</h3>
                    <ul>
                        <li><a href="#/collections?filter=necklaces">Necklaces</a></li>
                        <li><a href="#/collections?filter=earrings">Earrings</a></li>
                        <li><a href="#/collections?filter=rings">Rings</a></li>
                        <li><a href="#/collections?filter=bridal">Bridal Collection</a></li>
                    </ul>
                </div>

                <div className="footer-links-col">
                    <h3>About</h3>
                    <ul>
                        <li><a href="#/about">Our Story</a></li>
                        <li><a href="#/about#vision">Our Vision</a></li>
                    </ul>
                </div>

                <div className="footer-links-col">
                    <h3>Concierge</h3>
                    <ul>
                        <li><a href="#/contact">Contact Us</a></li>
                        <li><a href="#/contact">Bespoke Consultations</a></li>
                        <li><a href="#/contact">Store Location</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 Trimetra Luxury. All rights reserved. | Handcrafted Authenticity</p>
            </div>
        </footer>
    );
}
