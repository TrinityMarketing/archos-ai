import Link from 'next/link';
import Logo from '../Logo/Logo';
import './Footer.css';

const NAV_LINKS = [
  { href: '#expertise', label: 'Expertise' },
  { href: '#results', label: 'Results' },
  { href: '#process', label: 'Process' },
  { href: '#about', label: 'About' },
  { href: '#insights', label: 'Insights' },
  { href: '#contact', label: 'Contact' },
];

export default function Footer() {
  const handleScroll = (e, href) => {
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="footer">
      <div className="section-inner footer-inner">
        <div className="footer-top">
          <a
            href="#hero"
            className="footer-logo"
            onClick={(e) => handleScroll(e, '#hero')}
          >
            <Logo />
            <span className="logo-wordmark">ARCHOS AI</span>
          </a>
          <nav className="footer-links">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleScroll(e, href)}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">&copy; 2026 Archos AI. All rights reserved.</span>
          <div className="footer-legal">
            <Link href="/privacy">Privacy Policy</Link>
            <span className="footer-legal-sep" />
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
