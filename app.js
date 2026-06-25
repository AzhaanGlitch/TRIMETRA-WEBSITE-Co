/**
 * TRIMETRA LUXURY JEWELRY - CORE SPA APP
 * Handles loading static JSON data, hash routing, and view template renders.
 */

// App State
const state = {
    products: [],
    content: {},
    loading: true,
    currentFilter: 'all'
};

// DOM Elements
const appRoot = document.getElementById('app-root');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const globalWhatsAppCta = document.getElementById('global-whatsapp-cta');
const footerInsta = document.getElementById('footer-insta');
const footerWa = document.getElementById('footer-wa');
const footerMail = document.getElementById('footer-mail');

/* ==========================================================================
   INITIALIZATION & DATA LOADING
   ========================================================================== */

async function initApp() {
    try {
        // Fetch static JSON databases
        const [productsResponse, contentResponse] = await Promise.all([
            fetch('data/products.json'),
            fetch('data/content.json')
        ]);

        if (!productsResponse.ok || !contentResponse.ok) {
            throw new Error('Failed to load website configuration data files.');
        }

        state.products = await productsResponse.json();
        state.content = await contentResponse.json();
        state.loading = false;

        // Configure global CTAs and links from static contents
        setupGlobalLinks();

        // Initialize Router
        window.addEventListener('hashchange', router);
        window.addEventListener('load', router);
        
        // Initial route handling
        router();
        
    } catch (error) {
        console.error('Initialization Error:', error);
        renderErrorState(error.message);
    }
}

// Bind contact credentials globally from content.json
function setupGlobalLinks() {
    const contact = state.content.contact;
    if (contact) {
        // Floating WhatsApp Widget
        globalWhatsAppCta.href = `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(contact.whatsapp.message)}`;
        
        // Footer links
        footerWa.href = `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(contact.whatsapp.message)}`;
        footerInsta.href = contact.instagram.url;
        footerMail.href = `mailto:${contact.email.address}`;
    }
}

/* ==========================================================================
   MOBILE NAVIGATION MENU & SCROLL EFFECTS
   ========================================================================== */

// Toggle Hamburger Menu
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
});

// Close nav menu on link clicks (Mobile UX)
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
    }
});

// Shrink header on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.luxury-header');
    if (window.scrollY > 50) {
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
});

/* ==========================================================================
   ROUTER SYSTEM
   ========================================================================== */

function router() {
    // Close hamburger menu if open
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');

    // Parse URL Hash
    const rawHash = window.location.hash || '#/home';
    const cleanHash = rawHash.split('?')[0];
    
    // Parse Query Parameters
    const queryParams = {};
    if (rawHash.includes('?')) {
        const queryStr = rawHash.split('?')[1];
        const pairs = queryStr.split('&');
        pairs.forEach(pair => {
            const [key, val] = pair.split('=');
            queryParams[key] = decodeURIComponent(val);
        });
    }

    // Scroll to top elegantly
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update active nav highlights
    updateNavHighlight(cleanHash);

    // Route Matching
    // Home View
    if (cleanHash === '#/home' || cleanHash === '#/') {
        renderHomeView();
    }
    // Collections View
    else if (cleanHash === '#/collections') {
        const filter = queryParams.filter || 'all';
        renderCollectionsView(filter);
    }
    // Product Details View
    else if (cleanHash.startsWith('#/product/')) {
        const productId = cleanHash.split('#/product/')[1];
        renderProductDetailsView(productId);
    }
    // About View
    else if (cleanHash === '#/about') {
        renderAboutView();
    }
    // Contact View
    else if (cleanHash === '#/contact') {
        renderContactView();
    }
    // Fallback/Not Found
    else {
        renderErrorState("We couldn't find the page you are looking for. Navigate back to Trimetra.");
    }
}

// Sync Navigation links active class
function updateNavHighlight(hash) {
    navLinks.forEach(link => {
        const linkHash = link.getAttribute('href').split('?')[0];
        
        // Match home equivalents
        if ((hash === '#/' || hash === '#/home') && linkHash === '#/home') {
            link.classList.add('active');
        } else if (hash.startsWith(linkHash) && linkHash !== '#/home' && linkHash !== '#/') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* ==========================================================================
   VIEW RENDERERS
   ========================================================================== */

function renderHomeView() {
    const { hero, brandStory, testimonials } = state.content;
    const featuredProducts = state.products.filter(p => p.featured);

    let productsHtml = '';
    featuredProducts.forEach(product => {
        productsHtml += `
            <div class="product-card">
                <div class="product-card-badge">Featured</div>
                <div class="product-card-img-wrap">
                    <img src="${product.images[0]}" alt="${product.name}" class="product-card-img" loading="lazy">
                </div>
                <div class="product-card-info">
                    <span class="product-card-collection">${product.collection}</span>
                    <h3 class="product-card-title">${product.name}</h3>
                    <p class="product-card-materials">${product.materials[0]}</p>
                </div>
                <div class="product-card-footer">
                    <span class="product-card-price">${product.price}</span>
                    <a href="#/product/${product.id}" class="product-card-btn">
                        Details <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    });

    let testimonialsHtml = '';
    testimonials.forEach(t => {
        let stars = '';
        for (let i = 0; i < t.rating; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        testimonialsHtml += `
            <div class="testimonial-card">
                <div class="testimonial-rating">${stars}</div>
                <p class="testimonial-text">"${t.text}"</p>
                <div class="testimonial-author">
                    <h4>${t.name}</h4>
                    <span>${t.role}</span>
                </div>
            </div>
        `;
    });

    appRoot.innerHTML = `
        <div class="fade-in-section">
            <!-- Hero Banner - Custom split pane design with semi-circle carousel -->
            <section class="hero-banner-custom">
                <!-- SVG Clip Path Definition -->
                <svg width="0" height="0" style="position: absolute;">
                    <defs>
                        <clipPath id="wedge-clip" clipPathUnits="objectBoundingBox">
                            <path d="M 0.05,0.2 C 0.02,0.2 0,0.24 0,0.28 L 0,0.72 C 0,0.76 0.02,0.8 0.05,0.8 L 0.85,0.98 C 0.92,1 1,0.95 1,0.85 L 1,0.15 C 1,0.05 0.92,0 0.85,0.02 Z" />
                        </clipPath>
                    </defs>
                </svg>

                <div class="hero-custom-container">
                    <!-- Left Side: Semi-circular Carousel -->
                    <div class="hero-left-pane">
                        <div class="explore-label">
                            <span>E&nbsp;X&nbsp;P&nbsp;L&nbsp;O&nbsp;R&nbsp;E</span>
                            <span>O&nbsp;U&nbsp;R</span>
                            <span>C&nbsp;O&nbsp;L&nbsp;L&nbsp;E&nbsp;C&nbsp;T&nbsp;I&nbsp;O&nbsp;N</span>
                        </div>
                        
                        <div class="carousel-semi-circle">
                            <!-- Sparkle decorations -->
                            <div class="sparkle sparkle-1"><i class="fas fa-sparkles">✦</i></div>
                            <div class="sparkle sparkle-2"><i class="fas fa-sparkles">✦</i></div>
                            <div class="sparkle sparkle-3"><i class="fas fa-sparkles">✦</i></div>
                            
                            <div class="carousel-track" id="carousel-track">
                                <!-- Dynamic radial items injected in initHeroCarousel -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right Side: Glowing Text Header and CTA -->
                    <div class="hero-right-pane">
                        <h1 class="brand-title-glow">TRIMETRA</h1>
                        <p class="hero-subtitle">${hero.subtitle}</p>
                        <a href="#/collections" class="gold-btn-custom">Explore Collections</a>
                    </div>
                </div>
            </section>

            <!-- Brand Story -->
            <section class="brand-story-sec">
                <div class="brand-story-text">
                    <h2>${brandStory.title}</h2>
                    ${brandStory.paragraphs.map(p => `<p>${p}</p>`).join('')}
                    <div>
                        <a href="#/about" class="outline-btn">Read Our Heritage</a>
                    </div>
                </div>
                <div class="brand-story-img">
                    <img src="assets/images/hero.png" alt="Trimetra Fine Jewelry Presentation" loading="lazy">
                </div>
            </section>

            <!-- Featured Collections Showcase -->
            <section class="featured-collections-sec">
                <div class="section-header">
                    <span class="section-subtitle">Curated Categories</span>
                    <h2 class="section-title">The Collections</h2>
                </div>
                
                <div class="collections-grid">
                    <div class="collection-card">
                        <img src="assets/images/necklace_1.png" alt="Necklaces Collection" class="collection-card-img" loading="lazy">
                        <div class="collection-card-overlay">
                            <h3>Necklaces</h3>
                            <a href="#/collections?filter=necklaces" class="collection-card-link">View Collection</a>
                        </div>
                    </div>
                    
                    <div class="collection-card">
                        <img src="assets/images/earrings_1.png" alt="Earrings Collection" class="collection-card-img" loading="lazy">
                        <div class="collection-card-overlay">
                            <h3>Earrings</h3>
                            <a href="#/collections?filter=earrings" class="collection-card-link">View Collection</a>
                        </div>
                    </div>
                    
                    <div class="collection-card">
                        <img src="assets/images/ring_1.png" alt="Rings Collection" class="collection-card-img" loading="lazy">
                        <div class="collection-card-overlay">
                            <h3>Rings</h3>
                            <a href="#/collections?filter=rings" class="collection-card-link">View Collection</a>
                        </div>
                    </div>
                    
                    <div class="collection-card">
                        <img src="assets/images/bridal_1.png" alt="Bridal Collection" class="collection-card-img" loading="lazy">
                        <div class="collection-card-overlay">
                            <h3>Bridal Set</h3>
                            <a href="#/collections?filter=bridal" class="collection-card-link">View Collection</a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Featured Products Catalog Grid -->
            <section class="testimonials-sec" style="padding-bottom: 0;">
                <div class="section-header">
                    <span class="section-subtitle">Exceptional Masterpieces</span>
                    <h2 class="section-title">Featured Creations</h2>
                </div>
                
                <div class="product-catalog-grid">
                    ${productsHtml}
                </div>
            </section>

            <!-- Testimonials Section -->
            <section class="testimonials-sec">
                <div class="section-header">
                    <span class="section-subtitle">Stories from our clients</span>
                    <h2 class="section-title">Testimonials</h2>
                </div>
                
                <div class="testimonials-grid">
                    ${testimonialsHtml}
                </div>
            </section>

            <!-- WhatsApp Call To Action Banner -->
            <section class="home-cta-banner">
                <div class="home-cta-content">
                    <h2>Bespoke Creations</h2>
                    <p>Looking for a custom length, specific diamond grade, or a completely personalized design? Connect with our master concierge via WhatsApp for dedicated advice.</p>
                    <a href="https://wa.me/${state.content.contact.whatsapp.number}?text=${encodeURIComponent('Hello Trimetra, I would like to consult on a custom/bespoke jewelry piece.')}" target="_blank" rel="noopener noreferrer" class="gold-btn">
                        <i class="fab fa-whatsapp"></i> Chat with Concierge
                    </a>
                </div>
            </section>
        </div>
    `;

    // Initialize custom homepage carousel
    initHeroCarousel();
}

function initHeroCarousel() {
    const track = document.getElementById('carousel-track');
    if (!track) return;

    // Use products images for the carousel
    const images = [
        'assets/images/necklace_1.png',
        'assets/images/necklace_2.png',
        'assets/images/earrings_1.png',
        'assets/images/earrings_2.png',
        'assets/images/ring_1.png',
        'assets/images/ring_2.png',
        'assets/images/bridal_1.png',
        'assets/images/bridal_2.png'
    ];

    let carouselHtml = '';
    images.forEach((img, index) => {
        carouselHtml += `
            <div class="carousel-item" data-index="${index}">
                <img src="${img}" alt="Trimetra Fine Jewelry Collection item ${index + 1}" loading="lazy">
            </div>
        `;
    });
    track.innerHTML = carouselHtml;

    const items = track.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    
    // Determine separation angle
    const angleSeparation = 30; // 30 degrees separation
    
    // Position items radially around the track center
    function updateItemPositions() {
        items.forEach((item, index) => {
            const angle = index * angleSeparation;
            item.style.transform = `rotate(${angle}deg)`;
        });
    }
    
    updateItemPositions();

    // Auto-rotation variables
    let currentRotation = 0;
    let autoRotateInterval = null;

    // Highlight the active item currently at focus (angle 0 relative to viewport)
    function highlightActive() {
        // Calculate which item index is currently closest to angle 0 in layout coordinates
        // normalized to 0..totalItems-1
        let targetIndex = Math.round((-currentRotation) / angleSeparation) % totalItems;
        if (targetIndex < 0) {
            targetIndex += totalItems;
        }
        
        items.forEach((item, index) => {
            if (index === targetIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Move track to specific rotation angle
    function rotateTrack(angle) {
        currentRotation = angle;
        track.style.transform = `rotate(${currentRotation}deg)`;
        highlightActive();
    }

    // Set initial focus on first item
    rotateTrack(0);

    // Auto rotation loop
    function startAutoRotate() {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            // Spin track counterclockwise to bring bottom items up
            rotateTrack(currentRotation - angleSeparation);
        }, 4000);
    }

    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }

    // Listeners for hover pausing
    const leftPane = document.querySelector('.hero-left-pane');
    if (leftPane) {
        leftPane.addEventListener('mouseenter', stopAutoRotate);
        leftPane.addEventListener('mouseleave', startAutoRotate);
    }

    // Listeners for clicking items to slide them to center focus
    items.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            stopAutoRotate();
            
            // We want to bring the clicked item to 0 degrees rotation.
            // That means the track should be rotated by - (index * angleSeparation) degrees
            // (modulo 360/total items rotation)
            let targetAngle = -(index * angleSeparation);
            
            // To prevent large spins, normalize targetAngle near currentRotation
            const delta = targetAngle - (currentRotation % (totalItems * angleSeparation));
            targetAngle = currentRotation + delta;
            
            rotateTrack(targetAngle);
        });
    });

    // Start carousel auto rotation
    startAutoRotate();
}

function renderCollectionsView(initialFilter) {
    state.currentFilter = initialFilter;

    // Outer shell
    appRoot.innerHTML = `
        <div class="collections-page-wrapper fade-in-section">
            <div class="section-header">
                <span class="section-subtitle">The Trimetra Catalog</span>
                <h2 class="section-title">Fine Jewelry Collections</h2>
            </div>

            <!-- Filter tabs -->
            <div class="filter-tabs-container">
                <button class="filter-tab ${state.currentFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                <button class="filter-tab ${state.currentFilter === 'necklaces' ? 'active' : ''}" data-filter="necklaces">Necklaces</button>
                <button class="filter-tab ${state.currentFilter === 'earrings' ? 'active' : ''}" data-filter="earrings">Earrings</button>
                <button class="filter-tab ${state.currentFilter === 'rings' ? 'active' : ''}" data-filter="rings">Rings</button>
                <button class="filter-tab ${state.currentFilter === 'bridal' ? 'active' : ''}" data-filter="bridal">Bridal Collection</button>
            </div>

            <!-- Products Catalog Grid container -->
            <div class="product-catalog-grid" id="catalog-products-container">
                <!-- Injected dynamically -->
            </div>
        </div>
    `;

    // Render initial catalog products
    renderFilteredProducts();

    // Hook up tab click events
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Remove active classes
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Set active class
            tab.classList.add('active');
            
            const selectedFilter = tab.getAttribute('data-filter');
            state.currentFilter = selectedFilter;
            
            // Update hash silently/without page refresh if possible, but hash route update is safer
            window.history.pushState(null, '', `#/collections?filter=${selectedFilter}`);
            
            // Re-render grid
            renderFilteredProducts();
        });
    });
}

function renderFilteredProducts() {
    const container = document.getElementById('catalog-products-container');
    const filtered = state.currentFilter === 'all' 
        ? state.products 
        : state.products.filter(p => p.collection === state.currentFilter);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-catalog">
                <i class="far fa-gem"></i>
                <h3>No jewelry pieces found</h3>
                <p>We are currently updating our collection. Please select another category.</p>
            </div>
        `;
        return;
    }

    let catalogHtml = '';
    filtered.forEach(product => {
        catalogHtml += `
            <div class="product-card fade-in-section">
                <div class="product-card-img-wrap">
                    <img src="${product.images[0]}" alt="${product.name}" class="product-card-img" loading="lazy">
                </div>
                <div class="product-card-info">
                    <span class="product-card-collection">${product.collection}</span>
                    <h3 class="product-card-title">${product.name}</h3>
                    <p class="product-card-materials">${product.materials.join(', ')}</p>
                </div>
                <div class="product-card-footer">
                    <span class="product-card-price">${product.price}</span>
                    <a href="#/product/${product.id}" class="product-card-btn">
                        Details <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    });

    container.innerHTML = catalogHtml;
}

function renderProductDetailsView(productId) {
    const product = state.products.find(p => p.id === productId);

    if (!product) {
        renderErrorState("Product details could not be found. Check if the code is correct.");
        return;
    }

    // Build gallery thumbnails
    let thumbsHtml = '';
    product.images.forEach((img, index) => {
        thumbsHtml += `
            <div class="gallery-thumbnail ${index === 0 ? 'active' : ''}" data-img-index="${index}">
                <img src="${img}" alt="${product.name} detail view ${index + 1}" loading="lazy">
            </div>
        `;
    });

    // Materials list bullets
    const materialsHtml = product.materials.map(m => `<li>${m}</li>`).join('');

    // Pre-filled WhatsApp Enquiry Message builder
    const waNumber = state.content.contact.whatsapp.number;
    const waMsgText = `Hi Trimetra, I'm visiting your website and would like to enquire about the following piece:\n\n` + 
                      `Product: ${product.name}\n` +
                      `Reference Code: ${product.id}\n` +
                      `Materials: ${product.materials.join(', ')}\n` +
                      `Listed Price: ${product.price}\n\n` +
                      `Please let me know its availability and customisation options. Thank you!`;
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMsgText)}`;

    appRoot.innerHTML = `
        <div class="product-details-container fade-in-section">
            <a href="#/collections?filter=${product.collection}" class="back-link">
                <i class="fas fa-arrow-left"></i> Back to ${product.collection}
            </a>

            <div class="product-details-grid">
                <!-- Gallery Section -->
                <div class="product-gallery">
                    <div class="main-image-viewport">
                        <img src="${product.images[0]}" alt="${product.name}" id="main-product-image">
                    </div>
                    <div class="gallery-thumbnails">
                        ${thumbsHtml}
                    </div>
                </div>

                <!-- Info Section -->
                <div class="product-info-panel">
                    <div class="product-meta-header">
                        <span class="product-detail-collection">${product.collection}</span>
                        <h1 class="product-detail-title">${product.name}</h1>
                        <span class="product-detail-id">REF: ${product.id}</span>
                    </div>

                    <span class="product-detail-price">${product.price}</span>
                    
                    <div class="divider"></div>

                    <!-- Description -->
                    <div class="product-desc-wrap">
                        <h3>Description</h3>
                        <p>${product.description}</p>
                    </div>

                    <div class="divider"></div>

                    <!-- Material Details -->
                    <div class="product-materials-wrap">
                        <h3>Composition & Materials</h3>
                        <ul class="materials-list">
                            ${materialsHtml}
                        </ul>
                    </div>

                    <div class="divider"></div>

                    <!-- WhatsApp CTA -->
                    <div class="product-actions">
                        <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="whatsapp-enquiry-btn">
                            <i class="fab fa-whatsapp"></i> Enquire on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Hook up Thumbnail click handler to switch Main Image Viewport
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    const mainImg = document.getElementById('main-product-image');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Remove active classes
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Set active class
            thumb.classList.add('active');
            
            // Swap source image
            const imgIndex = thumb.getAttribute('data-img-index');
            mainImg.style.opacity = 0;
            setTimeout(() => {
                mainImg.src = product.images[imgIndex];
                mainImg.style.opacity = 1;
            }, 150);
        });
    });
}

function renderAboutView() {
    const { brandStory, craftsmanship, vision } = state.content;

    appRoot.innerHTML = `
        <div class="about-page-wrapper fade-in-section">
            <!-- Hero banner text -->
            <div class="about-hero-section">
                <span class="section-subtitle">Since Day One</span>
                <h1 class="section-title">The Spirit of Trimetra</h1>
            </div>

            <!-- Brand Story -->
            <section class="about-intro-grid">
                <div class="about-intro-text">
                    <h2>${brandStory.title}</h2>
                    ${brandStory.paragraphs.map(p => `<p>${p}</p>`).join('')}
                </div>
                <div class="brand-story-img">
                    <img src="assets/images/hero.png" alt="Trimetra Heritage Jewelry Display" loading="lazy">
                </div>
            </section>

            <!-- Craftsmanship section -->
            <section class="craftsmanship-section" id="craftsmanship">
                <div class="craftsmanship-grid">
                    <div class="craftsmanship-img">
                        <img src="assets/images/craftsmanship.png" alt="Master Craftsman setting diamonds" loading="lazy">
                    </div>
                    <div class="craftsmanship-text">
                        <h2>${craftsmanship.title}</h2>
                        <span class="section-subtitle" style="text-align: left; margin-bottom: 20px;">${craftsmanship.subtitle}</span>
                        ${craftsmanship.paragraphs.map(p => `<p>${p}</p>`).join('')}
                    </div>
                </div>
            </section>

            <!-- Vision section -->
            <section class="vision-section" id="vision">
                <div class="vision-card">
                    <i class="far fa-eye"></i>
                    <h2>${vision.title}</h2>
                    ${vision.paragraphs.map(p => `<p>${p}</p>`).join('')}
                </div>
            </section>
        </div>
    `;
}

function renderContactView() {
    const { contact } = state.content;

    appRoot.innerHTML = `
        <div class="contact-page-wrapper fade-in-section">
            <div class="section-header">
                <span class="section-subtitle">Private Concierge</span>
                <h1 class="section-title">Connect With Us</h1>
            </div>

            <div class="contact-grid">
                <!-- Methods Info -->
                <div class="contact-info-panel">
                    <div class="contact-intro">
                        <h2>Dedicated Assistance</h2>
                        <p>Our client advisors are available to guide you through bespoke customisations, collection queries, and private showroom visits. Please reach out via your preferred method.</p>
                    </div>

                    <div class="contact-methods">
                        <!-- WhatsApp -->
                        <div class="contact-method-item">
                            <div class="contact-method-icon"><i class="fab fa-whatsapp"></i></div>
                            <div class="contact-method-details">
                                <h4>WhatsApp Chat</h4>
                                <a href="https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(contact.whatsapp.message)}" target="_blank" rel="noopener noreferrer">
                                    ${contact.whatsapp.display}
                                </a>
                                <p style="font-size: 0.8rem; margin-top: 4px; color: var(--text-muted);">Instant advice & queries</p>
                            </div>
                        </div>

                        <!-- Instagram -->
                        <div class="contact-method-item">
                            <div class="contact-method-icon"><i class="fab fa-instagram"></i></div>
                            <div class="contact-method-details">
                                <h4>Instagram DM</h4>
                                <a href="${contact.instagram.url}" target="_blank" rel="noopener noreferrer">
                                    ${contact.instagram.handle}
                                </a>
                                <p style="font-size: 0.8rem; margin-top: 4px; color: var(--text-muted);">Daily showcases & features</p>
                            </div>
                        </div>

                        <!-- Email -->
                        <div class="contact-method-item">
                            <div class="contact-method-icon"><i class="far fa-envelope"></i></div>
                            <div class="contact-method-details">
                                <h4>Email Enquiries</h4>
                                <a href="mailto:${contact.email.address}">${contact.email.address}</a>
                                <p style="font-size: 0.8rem; margin-top: 4px; color: var(--text-muted);">Corporate & custom orders</p>
                            </div>
                        </div>

                        <!-- Location -->
                        <div class="contact-method-item">
                            <div class="contact-method-icon"><i class="fas fa-map-marker-alt"></i></div>
                            <div class="contact-method-details">
                                <h4>Showroom Address</h4>
                                <p>${contact.location.address}</p>
                                <p style="font-size: 0.85rem; color: var(--color-gold); margin-top: 6px;">${contact.location.hours}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Form Panel -->
                <div class="contact-form-panel">
                    <h3>Request an Appointment</h3>
                    <form id="showroom-appointment-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="form-name">First & Last Name</label>
                                <input type="text" id="form-name" required placeholder="Jane Doe">
                            </div>
                            <div class="form-group">
                                <label for="form-email">Email Address</label>
                                <input type="email" id="form-email" required placeholder="jane@example.com">
                            </div>
                        </div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="form-phone">Phone Number</label>
                                <input type="tel" id="form-phone" placeholder="+1 (555) 000-0000">
                            </div>
                            <div class="form-group">
                                <label for="form-interest">Collection Interest</label>
                                <input type="text" id="form-interest" placeholder="e.g. Bridal Tiara Set">
                            </div>
                        </div>
                        <div class="form-group full-width" style="margin-bottom: 25px;">
                            <label for="form-message">Special Notes / Desired Booking Date</label>
                            <textarea id="form-message" rows="5" placeholder="Let us know your availability, custom needs, and preferred schedule..."></textarea>
                        </div>
                        
                        <button type="submit" class="gold-btn form-submit-btn">Send Request</button>
                        <div class="form-status-msg" id="form-status-feedback">
                            Request received successfully. Our concierge team will reach out to you shortly.
                        </div>
                    </form>
                </div>
            </div>

            <!-- Map Location -->
            <section class="map-section">
                <div class="map-container">
                    <iframe 
                        src="${contact.location.mapEmbedUrl}" 
                        allowfullscreen="" 
                        loading="lazy">
                    </iframe>
                </div>
            </section>
        </div>
    `;

    // Hook up form submission handler
    const form = document.getElementById('showroom-appointment-form');
    const feedback = document.getElementById('form-status-feedback');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show status feedback
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.style.opacity = 1;
        }, 10);
        
        // Reset form
        form.reset();

        // Fade status feedback out after 5 seconds
        setTimeout(() => {
            feedback.style.opacity = 0;
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 300);
        }, 5000);
    });
}

function renderErrorState(message) {
    appRoot.innerHTML = `
        <div class="page-loader fade-in-section" style="color: var(--text-secondary); text-align: center; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--color-gold); margin-bottom: 10px;"></i>
            <h2>Encountered an Issue</h2>
            <p style="margin-bottom: 20px;">${message}</p>
            <a href="#/home" class="gold-btn" style="padding: 10px 24px; font-size: 0.8rem;">Return Home</a>
        </div>
    `;
}

/* ==========================================================================
   APP BOOTSTRAP
   ========================================================================== */

initApp();
