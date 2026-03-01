/**
 * Scroll Reveal Animation Logic
 * Uses Intersection Observer to trigger animations when elements enter viewport
 */

document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a slight delay based on data-delay attribute if present
                const delay = entry.target.getAttribute('data-delay') || 0;

                setTimeout(() => {
                    entry.target.classList.add('reveal-active');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: '0px 0px -50px 0px' // Slightly offset the bottom trigger
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
