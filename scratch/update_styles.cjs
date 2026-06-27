const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replacement 1: Hero Overlay and Cursor
const targetOverlay = `.hero-cta-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 22px;
    padding: 120px 40px 40px; /* Shifted down slightly */
    background: radial-gradient(ellipse at 58% 52%, rgba(60, 5, 35, 0.62) 0%, transparent 68%);
    text-align: center;
    pointer-events: none;
}

.hero-cta-title {
    font-family: var(--font-heading);
    font-size: 6.5rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-indent: 0.22em; /* Compensate for letter-spacing to center it perfectly */
    margin: 0;
    line-height: 1;
    min-height: 1.1em;
    
    /* Luxury Gold Shimmer & Glow */
    background: linear-gradient(
        to right,
        #D0AA6C 20%,
        #FFF6E5 40%,
        #FFF6E5 60%,
        #D0AA6C 80%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: goldShimmer 4s linear infinite;
    filter: drop-shadow(0 0 15px rgba(208, 170, 108, 0.5)) 
            drop-shadow(0 4px 20px rgba(0, 0, 0, 0.6));
}

@keyframes goldShimmer {
    0% {
        background-position: 0% center;
    }
    100% {
        background-position: -200% center;
    }
}

.typewriter-cursor {
    display: inline-block;
    color: var(--color-gold, #d0aa6c);
    font-weight: 300;
    margin-left: 2px;
    animation: twBlink 0.85s step-end infinite;
}

.typewriter-cursor.done {
    animation: none;
    opacity: 0;
    transition: opacity 0.4s ease 0.6s;
}

@keyframes twBlink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}`;

const replacementOverlay = `.hero-cta-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 22px;
    padding: 120px 40px 40px; /* Shifted down slightly */
    background: radial-gradient(ellipse at 58% 52%, rgba(60, 5, 35, 0.62) 0%, transparent 68%);
    text-align: center;
    pointer-events: none;
    transform: translateX(60px); /* shift slightly to the right on desktop */
    transition: transform 0.5s ease;
}

.hero-cta-title {
    font-family: var(--font-heading);
    font-size: 6.5rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-indent: 0.22em; /* Compensate for letter-spacing to center it perfectly */
    margin: 0;
    line-height: 1;
    min-height: 1.1em;
    
    /* Luxury Gold Shimmer & Glow */
    background: linear-gradient(
        to right,
        #D0AA6C 20%,
        #FFF6E5 40%,
        #FFF6E5 60%,
        #D0AA6C 80%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: goldShimmer 4s linear infinite;
    filter: drop-shadow(0 0 15px rgba(208, 170, 108, 0.5)) 
            drop-shadow(0 4px 20px rgba(0, 0, 0, 0.6));
}

@keyframes goldShimmer {
    0% {
        background-position: 0% center;
    }
    100% {
        background-position: -200% center;
    }
}

.typewriter-cursor {
    display: inline-block;
    color: var(--color-gold, #d0aa6c);
    margin-left: 8px;
    font-size: 0.85em;
    filter: drop-shadow(0 0 8px var(--color-gold));
    animation: twSparkle 1.2s ease-in-out infinite alternate;
}

.typewriter-cursor.done {
    animation: none;
    opacity: 0;
    transition: opacity 0.4s ease 0.6s;
}

@keyframes twSparkle {
    0% {
        opacity: 0.35;
        transform: scale(0.8) rotate(0deg);
    }
    100% {
        opacity: 1;
        transform: scale(1.25) rotate(45deg);
        filter: drop-shadow(0 0 15px rgba(208, 170, 108, 0.95));
    }
}`;

if (css.includes(targetOverlay)) {
    css = css.replace(targetOverlay, replacementOverlay);
    console.log('Overlay replaced successfully');
} else {
    // Fallback: search with a simpler key
    console.log('Overlay target not found, trying fallback matching');
    const oldCursorRule = `.typewriter-cursor {
    display: inline-block;
    color: var(--color-gold, #d0aa6c);
    font-weight: 300;
    margin-left: 2px;
    animation: twBlink 0.85s step-end infinite;
}`;
    const newCursorRule = `.typewriter-cursor {
    display: inline-block;
    color: var(--color-gold, #d0aa6c);
    margin-left: 8px;
    font-size: 0.85em;
    filter: drop-shadow(0 0 8px var(--color-gold));
    animation: twSparkle 1.2s ease-in-out infinite alternate;
}`;
    css = css.replace(oldCursorRule, newCursorRule);
    css = css.replace('padding: 120px 40px 40px; /* Shifted down slightly */\n    background: radial-gradient', 'padding: 120px 40px 40px; /* Shifted down slightly */\n    background: radial-gradient\n    transform: translateX(60px); /* shift slightly to the right on desktop */\n    transition: transform 0.5s ease;');
}

// Replacement 2: Mobile responsive overrides
const targetMedia = `@media (max-width: 768px) {`;
const replacementMedia = `@media (max-width: 768px) {
    .hero-cta-overlay {
        transform: translateX(0) !important; /* Reset horizontal shift on mobile */
        padding-top: 80px !important;
    }
    .hero-cta-title {
        font-size: 3.8rem !important; /* Scale down title size */
        letter-spacing: 0.15em !important;
        text-indent: 0.15em !important;
    }`;

if (css.includes(targetMedia)) {
    css = css.replace(targetMedia, replacementMedia);
    console.log('Media overrides added successfully');
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('style.css updated successfully');
