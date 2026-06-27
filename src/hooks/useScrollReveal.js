import { useEffect } from 'react';

export function useScrollReveal() {
    useEffect(() => {
        const elements = Array.from(document.querySelectorAll('.reveal-on-scroll'));

        if (!('IntersectionObserver' in window)) {
            elements.forEach((element) => element.classList.add('is-visible'));
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '0px 0px -12% 0px',
                threshold: 0.16
            }
        );

        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, []);
}
