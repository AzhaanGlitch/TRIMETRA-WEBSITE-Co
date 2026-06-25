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

// DOM Elements (initialized dynamically after header and footer are loaded)
const appRoot = document.getElementById('app-root');
let navMenu = null;
let navToggle = null;
let navLinks = [];
let globalWhatsAppCta = null;
let footerInsta = null;
let footerWa = null;
let footerMail = null;

/* ==========================================================================
   INITIALIZATION & DATA LOADING
   ========================================================================== */

// Dynamically load external header and footer components
async function loadHeaderAndFooter() {
    try {
        const [headerRes, footerRes] = await Promise.all([
            fetch('header.html'),
            fetch('footer.html')
        ]);

        if (!headerRes.ok || !footerRes.ok) {
            throw new Error('Failed to load header or footer components.');
        }

        const headerHtml = await headerRes.text();
        const footerHtml = await footerRes.text();

        // Inject into placeholders
        document.getElementById('header-placeholder').innerHTML = headerHtml;
        document.getElementById('footer-placeholder').innerHTML = footerHtml;

        // Query the DOM elements now that they are injected
        navMenu = document.getElementById('nav-menu');
        navToggle = document.getElementById('nav-toggle');
        navLinks = document.querySelectorAll('.nav-link');
        globalWhatsAppCta = document.getElementById('global-whatsapp-cta');
        footerInsta = document.getElementById('footer-insta');
        footerWa = document.getElementById('footer-wa');
        footerMail = document.getElementById('footer-mail');

        // Set up hamburger toggle and scroll styling
        setupNavEvents();
    } catch (error) {
        console.error('Error loading header/footer components:', error);
    }
}

async function initApp() {
    try {
        // Load header/footer first so DOM elements exist
        await loadHeaderAndFooter();

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
        if (globalWhatsAppCta) {
            globalWhatsAppCta.href = `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(contact.whatsapp.message)}`;
        }

        // Footer links
        if (footerWa) {
            footerWa.href = `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(contact.whatsapp.message)}`;
        }
        if (footerInsta) {
            footerInsta.href = contact.instagram.url;
        }
        if (footerMail) {
            footerMail.href = `mailto:${contact.email.address}`;
        }
    }
}

/* ==========================================================================
   MOBILE NAVIGATION MENU & SCROLL EFFECTS
   ========================================================================== */

function setupNavEvents() {
    if (navToggle && navMenu) {
        // Toggle Hamburger Menu
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
    }

    // Close nav menu on link clicks (Mobile UX)
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('open');
            navMenu.classList.remove('open');
        }
    });

    // Shrink header on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.luxury-header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('shrink');
            } else {
                header.classList.remove('shrink');
            }
        }
    });
}

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
    const { hero, testimonials } = state.content;
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
                            <path d="M 0.05,0.28 C 0.02,0.28 0,0.32 0,0.38 L 0,0.62 C 0,0.68 0.02,0.72 0.05,0.72 L 0.85,0.96 C 0.92,0.98 1,0.8 1,0.5 C 1,0.2 0.92,0.02 0.85,0.04 Z" />
                        </clipPath>
                    </defs>
                </svg>

                <!-- Centered Orbiting Carousel positioned relative to the screen viewport boundary -->
                <div class="carousel-semi-circle">
                    <!-- Central Explore Label -->
                    <div class="explore-label-center">
                        <span>Explore</span>
                        <span>Our</span>
                        <h3>Collection</h3>
                    </div>

                    <!-- Sparkle decorations -->
                    <div class="sparkle sparkle-1"><i class="fas fa-sparkles">✦</i></div>
                    <div class="sparkle sparkle-2"><i class="fas fa-sparkles">✦</i></div>
                    <div class="sparkle sparkle-3"><i class="fas fa-sparkles">✦</i></div>
                    
                    <div class="carousel-track" id="carousel-track">
                        <!-- Dynamic radial items injected in initHeroCarousel -->
                    </div>
                </div>

                <div class="hero-custom-container">
                    <!-- Left Side Column Placeholder (reserves grid column space) -->
                    <div class="hero-left-pane"></div>
                    
                    <!-- Right Side: Glowing Text Header and CTA -->
                    <div class="hero-right-pane">
                        <h1 class="brand-title-glow">TRIMETRA</h1>
                        <p class="hero-subtitle">${hero.subtitle}</p>
                        <a href="#/collections" class="gold-btn-custom">Explore Collections</a>
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

    // Trigger typewriter animation once the view is rendered
    setTimeout(() => {
        const title = document.querySelector('.brand-title-glow');
        if (title) {
            title.classList.add('start-typing');
        }
    }, 100);
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
    const angleSeparation = 45; // 45 degrees separation

    // Position items radially around the track center
    function updateItemPositions() {
        items.forEach((item, index) => {
            const angle = index * angleSeparation;
            item.style.transform = `rotate(${angle}deg)`;
        });
    }

    updateItemPositions();

    // Auto-rotation variables (continuous motion)
    let currentRotation = 0;
    let isHovered = false;
    let isTransitioning = false;
    let transitionTimeout = null;

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

    // Continuous loop step
    function animationStep() {
        if (!isHovered && !isTransitioning) {
            currentRotation -= 0.12; // Extremely smooth slow continuous rotation (degrees per frame)
            track.style.transform = `rotate(${currentRotation}deg)`;
            highlightActive();
        }
        requestAnimationFrame(animationStep);
    }

    // Set initial focus and start animation loop
    rotateTrack(0);
    requestAnimationFrame(animationStep);

    // Listeners for hover pausing
    const leftPane = document.querySelector('.hero-left-pane');
    if (leftPane) {
        leftPane.addEventListener('mouseenter', () => {
            isHovered = true;
        });
        leftPane.addEventListener('mouseleave', () => {
            isHovered = false;
        });
    }

    // Listeners for clicking items to slide them to center focus
    items.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            if (isTransitioning) return;

            isTransitioning = true;

            // Enable smooth transition temporarily for this click centering
            track.style.transition = 'transform 1.8s cubic-bezier(0.1, 0.9, 0.2, 1)';

            // Bring the clicked item to 0 degrees rotation.
            let targetAngle = -(index * angleSeparation);

            // To prevent large spins, normalize targetAngle near currentRotation
            const delta = targetAngle - (currentRotation % (totalItems * angleSeparation));
            targetAngle = currentRotation + delta;

            rotateTrack(targetAngle);

            // After the transition finishes, disable it to restore continuous rendering
            if (transitionTimeout) clearTimeout(transitionTimeout);
            transitionTimeout = setTimeout(() => {
                track.style.transition = 'none';
                isTransitioning = false;
            }, 1800);
        });
    });
}

function renderCollectionsView(initialFilter) {
    state.currentFilter = initialFilter;

    // Outer shell
    appRoot.innerHTML = `
        <div class="collections-page-wrapper fade-in-section">
            <!-- Dynamic Collection Banner -->
            <div class="collection-hero-banner" id="collection-hero-banner">
                <!-- Injected dynamically -->
            </div>

            <!-- Filter tabs -->
            <div class="filter-tabs-container">
                <button class="filter-tab ${state.currentFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                <button class="filter-tab ${state.currentFilter === 'rings' ? 'active' : ''}" data-filter="rings">Rings</button>
                <button class="filter-tab ${state.currentFilter === 'necklaces' ? 'active' : ''}" data-filter="necklaces">Necklaces</button>
                <button class="filter-tab ${state.currentFilter === 'earrings' ? 'active' : ''}" data-filter="earrings">Earrings</button>
                <button class="filter-tab ${state.currentFilter === 'bracelets' ? 'active' : ''}" data-filter="bracelets">Bracelets</button>
                <button class="filter-tab ${state.currentFilter === 'bridal' ? 'active' : ''}" data-filter="bridal">Bridal Collection</button>
            </div>

            <!-- Products Catalog Grid container -->
            <div class="product-catalog-grid" id="catalog-products-container">
                <!-- Injected dynamically -->
            </div>
        </div>
    `;

    // Render initial catalog products and banner
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
            
            // Update hash without page reload
            window.history.pushState(null, '', `#/collections?filter=${selectedFilter}`);
            
            // Re-render grid and banner
            renderFilteredProducts();
        });
    });
}

function renderFilteredProducts() {
    const bannerContainer = document.getElementById('collection-hero-banner');
    const container = document.getElementById('catalog-products-container');
    
    // Update dynamic banner
    const meta = state.content.collectionMetadata[state.currentFilter] || state.content.collectionMetadata['all'];
    bannerContainer.style.backgroundImage = `linear-gradient(rgba(26, 26, 26, 0.45), rgba(26, 26, 26, 0.65)), url('${meta.image}')`;
    bannerContainer.innerHTML = `
        <div class="collection-banner-content fade-in-text">
            <span class="collection-banner-subtitle">Trimetra Signature</span>
            <h1 class="collection-banner-title">${meta.title}</h1>
            <p class="collection-banner-desc">${meta.description}</p>
        </div>
    `;

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
    const waMsgText = `Hi Trimetra, I'm interested in the "${product.name}".\n\n` +
        `Reference: ${product.id}\n` +
        `Composition: ${product.materials.join(', ')}\n` +
        `Listed Price: ${product.price}\n\n` +
        `Please advise on its availability and how I may purchase this piece. Thank you!`;
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
    const { craftsmanship, vision, founderStory, brandJourney, whyChooseUs } = state.content;

    // Why Choose Us cards list
    let whyCardsHtml = '';
    whyChooseUs.items.forEach((item, index) => {
        let iconClass = 'fa-certificate';
        if (index === 0) iconClass = 'fa-leaf'; // Ethical
        else if (index === 1) iconClass = 'fa-shield-halved'; // Quality/Weight
        else if (index === 2) iconClass = 'fa-gem'; // Custom Design
        
        whyCardsHtml += `
            <div class="why-card">
                <div class="why-card-icon"><i class="fas ${iconClass}"></i></div>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            </div>
        `;
    });

    appRoot.innerHTML = `
        <div class="about-page-wrapper fade-in-section">
            <!-- Hero Banner -->
            <div class="about-hero-section">
                <span class="section-subtitle">Since Day One</span>
                <h1 class="section-title">The Spirit of Trimetra</h1>
            </div>

            <!-- Founder Story -->
            <section class="about-intro-grid">
                <div class="about-intro-text">
                    <span class="section-subtitle" style="text-align: left; margin-bottom: 10px;">The Visionary Behind the Brand</span>
                    <h2>${founderStory.title}</h2>
                    ${founderStory.paragraphs.map(p => `<p>${p}</p>`).join('')}
                </div>
                <div class="brand-story-img">
                    <img src="assets/images/hero.png" alt="Trimetra Founder Jewelry Presentation" loading="lazy">
                </div>
            </section>

            <!-- Brand Journey -->
            <section class="brand-journey-section">
                <div class="journey-card">
                    <span class="section-subtitle">Our Heritage</span>
                    <h2>${brandJourney.title}</h2>
                    ${brandJourney.paragraphs.map(p => `<p>${p}</p>`).join('')}
                </div>
            </section>

            <!-- Craftsmanship section -->
            <section class="craftsmanship-section" id="craftsmanship">
                <div class="craftsmanship-grid">
                    <div class="craftsmanship-img">
                        <img src="assets/images/craftsmanship.png" alt="Master Craftsman setting diamonds" loading="lazy">
                    </div>
                    <div class="craftsmanship-text">
                        <span class="section-subtitle" style="text-align: left; margin-bottom: 10px;">Heritage Techniques & Precision</span>
                        <h2>${craftsmanship.title}</h2>
                        ${craftsmanship.paragraphs.map(p => `<p>${p}</p>`).join('')}
                    </div>
                </div>
            </section>

            <!-- Why Choose Trimetra Section -->
            <section class="why-choose-section">
                <div class="section-header">
                    <span class="section-subtitle">Responsible Luxury</span>
                    <h2 class="section-title">${whyChooseUs.title}</h2>
                </div>
                <div class="why-choose-grid">
                    ${whyCardsHtml}
                </div>
            </section>

            <!-- Vision section -->
            <section class="vision-section" id="vision">
                <div class="vision-card">
                    <div class="vision-icon"><i class="far fa-eye"></i></div>
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
