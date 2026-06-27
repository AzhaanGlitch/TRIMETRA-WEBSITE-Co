import { whatsappLink } from '../utils/assets.js';

export default function FloatingWhatsApp({ contact }) {
    return (
        <a
            href={whatsappLink(contact.whatsapp.number, contact.whatsapp.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-floating-cta"
            aria-label="Chat on WhatsApp"
        >
            <i className="fab fa-whatsapp" />
            <span className="tooltip-text">Enquire Now</span>
        </a>
    );
}
