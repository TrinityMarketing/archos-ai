import { useState, useEffect, useCallback } from 'react';
import Logo from '../Logo/Logo';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import './Navbar.css';

const NAV_ITEMS = [
  { href: '#expertise', label: 'Expertise' },
  { href: '#results', label: 'Results' },
  { href: '#process', label: 'Process' },
  { href: '#about', label: 'About' },
  { href: '#insights', label: 'Insights' },
];

export default function Navbar() {
  const scrolled = useScrollPosition(60);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    function updateActive() {
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.scrollY;
      let current = null;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollY >= sections[i].offsetTop - 100) {
          current = sections[i].id;
          break;
        }
      }
      setActiveSection(current);
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
    return () => window.removeEventListener('scroll', updateActive);
  }, []);

  const handleSmoothScroll = useCallback((e, href) => {
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <a
          href="#hero"
          className="nav-logo"
          onClick={(e) => handleSmoothScroll(e, '#hero')}
        >
          <Logo />
          <span className="logo-wordmark">ARCHOS AI</span>
        </a>

        <nav className="nav-links">
          {NAV_ITEMS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`nav-link${activeSection === href.slice(1) ? ' active' : ''}`}
              onClick={(e) => handleSmoothScroll(e, href)}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className={`nav-cta${activeSection === 'contact' ? ' active' : ''}`}
            onClick={(e) => handleSmoothScroll(e, '#contact')}
          >
            Start a Conversation
          </a>
        </nav>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`nav-overlay${menuOpen ? ' open' : ''}`}>
        <nav className="nav-overlay-links">
          {[...NAV_ITEMS, { href: '#contact', label: 'Start a Conversation' }].map(
            ({ href, label }, i) => (
              <a
                key={href}
                href={href}
                className="nav-overlay-link"
                style={{
                  transitionDelay: menuOpen ? `${i * 80}ms` : '0ms',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
                }}
                onClick={(e) => handleSmoothScroll(e, href)}
              >
                {label}
              </a>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
