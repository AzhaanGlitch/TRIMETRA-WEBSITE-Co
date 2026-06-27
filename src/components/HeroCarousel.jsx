import { useEffect, useRef } from 'react';
import { imageUrl } from '../utils/assets.js';

const carouselImages = [
    'assets/images/necklace_1.png',
    'assets/images/necklace_2.png',
    'assets/images/earrings_1.png',
    'assets/images/earrings_2.png',
    'assets/images/ring_1.png',
    'assets/images/ring_2.png',
    'assets/images/bridal_1.png',
    'assets/images/bridal_2.png'
];

export default function HeroCarousel() {
    const trackRef = useRef(null);
    const pausedRef = useRef(false);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return undefined;

        const items = Array.from(track.querySelectorAll('.carousel-item'));
        const totalItems = items.length;
        const angleSeparation = 45;
        let currentRotation = 0;
        let isTransitioning = false;
        let frameId = null;
        let transitionTimeout = null;

        items.forEach((item, index) => {
            item.style.transform = `rotate(${index * angleSeparation}deg)`;
        });

        const highlightActive = () => {
            let targetIndex = Math.round((-currentRotation) / angleSeparation) % totalItems;
            if (targetIndex < 0) targetIndex += totalItems;

            items.forEach((item, index) => {
                item.classList.toggle('active', index === targetIndex);
            });
        };

        const rotateTrack = (angle) => {
            currentRotation = angle;
            track.style.transform = `rotate(${currentRotation}deg)`;
            highlightActive();
        };

        const animate = () => {
            if (!pausedRef.current && !isTransitioning) {
                currentRotation -= 0.12;
                track.style.transform = `rotate(${currentRotation}deg)`;
                highlightActive();
            }
            frameId = requestAnimationFrame(animate);
        };

        const clickHandlers = items.map((item, index) => {
            const handleClick = () => {
                if (isTransitioning) return;

                isTransitioning = true;
                track.style.transition = 'transform 1.8s cubic-bezier(0.1, 0.9, 0.2, 1)';

                let targetAngle = -(index * angleSeparation);
                const delta = targetAngle - (currentRotation % (totalItems * angleSeparation));
                targetAngle = currentRotation + delta;
                rotateTrack(targetAngle);

                if (transitionTimeout) clearTimeout(transitionTimeout);
                transitionTimeout = setTimeout(() => {
                    track.style.transition = 'none';
                    isTransitioning = false;
                }, 1800);
            };

            item.addEventListener('click', handleClick);
            return () => item.removeEventListener('click', handleClick);
        });

        rotateTrack(0);
        frameId = requestAnimationFrame(animate);

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
            if (transitionTimeout) clearTimeout(transitionTimeout);
            clickHandlers.forEach((remove) => remove());
        };
    }, []);

    return (
        <div className="carousel-semi-circle">
            <div className="explore-label-center">
                <span>Explore</span>
                <span>Our</span>
                <h3>Collection</h3>
            </div>

            <div className="sparkle sparkle-1"><i className="fas fa-sparkles">✦</i></div>
            <div className="sparkle sparkle-2"><i className="fas fa-sparkles">✦</i></div>
            <div className="sparkle sparkle-3"><i className="fas fa-sparkles">✦</i></div>

            <div
                className="carousel-track"
                ref={trackRef}
                onMouseEnter={() => {
                    pausedRef.current = true;
                }}
                onMouseLeave={() => {
                    pausedRef.current = false;
                }}
            >
                {carouselImages.map((img, index) => (
                    <div className="carousel-item" key={img}>
                        <img src={imageUrl(img)} alt={`Trimetra Fine Jewelry Collection item ${index + 1}`} loading="lazy" />
                    </div>
                ))}
            </div>
        </div>
    );
}
