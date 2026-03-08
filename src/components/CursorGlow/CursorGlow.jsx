import { useEffect, useRef } from 'react';
import './CursorGlow.css';

export default function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

    function updateVisibility() {
      el.style.display = isDesktop() ? 'block' : 'none';
    }

    updateVisibility();

    let raf = null;
    let x = 0;
    let y = 0;

    function update() {
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      raf = null;
    }

    function onMouseMove(e) {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    }

    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', updateVisibility);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', updateVisibility);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
}
