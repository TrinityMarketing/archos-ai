import { useEffect } from 'react';

const REVEAL_STAGGER_MS = 120;

export function useScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = el.parentElement
          ? el.parentElement.querySelectorAll('[data-reveal]')
          : [el];
        const index = Array.prototype.indexOf.call(siblings, el);
        const delay = index * REVEAL_STAGGER_MS;
        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);
        observer.unobserve(el);
      });
    }, observerOptions);

    const targets = document.querySelectorAll('[data-reveal]');
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
