/**
 * Intersection Observer helper to reveal elements smoothly as the user scrolls.
 */
export function initScrollReveal() {
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Once revealed, we don't need to observe it anymore
                observerInstance.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with class 'reveal-on-scroll'
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    // Return disconnect function in case we need to clean up
    return () => observer.disconnect();
}
