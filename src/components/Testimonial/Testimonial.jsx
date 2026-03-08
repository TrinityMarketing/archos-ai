import { useState, useEffect, useRef, useCallback } from 'react';
import './Testimonial.css';

const TESTIMONIALS = [
  {
    quote: 'Archos didn\'t just advise — they transformed how we operate. The team moved fast, stayed in the details, and the results speak for themselves. This is the kind of partner you want when the stakes are high.',
    name: 'James Whitfield',
    title: 'CTO',
    company: '$2.4B Financial Services Firm',
    metric: '73%',
    metricLabel: 'Faster Operations',
  },
  {
    quote: 'We\'d talked to a dozen AI consultants before Archos. They were the only ones who understood our business first and the technology second. The automation they built paid for itself in under 90 days.',
    name: 'Sarah Chen',
    title: 'VP of Operations',
    company: 'National Healthcare Payer',
    metric: '4x',
    metricLabel: 'Throughput Increase',
  },
  {
    quote: 'Most firms sell you a roadmap and disappear. Archos stayed through implementation, through launch, through optimization. They operate like an extension of your team — and they actually ship.',
    name: 'David Park',
    title: 'CEO',
    company: '$180M E-Commerce Platform',
    metric: '$52M',
    metricLabel: 'Revenue Impact',
  },
];

const AUTO_ROTATE_MS = 6000;

export default function Testimonial() {
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((i) => {
    if (i === active || transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setActive(i);
      setTimeout(() => setTransitioning(false), 50);
    }, 300);
  }, [active, transitioning]);

  const next = useCallback(() => {
    goTo((active + 1) % TESTIMONIALS.length);
  }, [active, goTo]);

  useEffect(() => {
    if (!visible) return;
    timerRef.current = setInterval(next, AUTO_ROTATE_MS);
    return () => clearInterval(timerRef.current);
  }, [visible, next]);

  const handleDotClick = (i) => {
    clearInterval(timerRef.current);
    goTo(i);
  };

  const t = TESTIMONIALS[active];

  return (
    <section className="testimonial" id="testimonial" ref={sectionRef}>
      <div className={`section-inner testimonial-layout${visible ? ' visible' : ''}`}>

        <div className="testimonial-left">
          <h2 className="section-heading">What Clients Say</h2>

          <div className="testimonial-nav">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={i}
                className={`testimonial-nav-item${i === active ? ' active' : ''}`}
                onClick={() => handleDotClick(i)}
              >
                <span className="testimonial-nav-number">0{i + 1}</span>
                <div className="testimonial-nav-info">
                  <span className="testimonial-nav-name">{item.name}</span>
                  <span className="testimonial-nav-company">{item.company}</span>
                </div>
                <div className="testimonial-nav-bar">
                  <div
                    className={`testimonial-nav-fill${i === active ? ' running' : ''}`}
                    style={{ animationDuration: `${AUTO_ROTATE_MS}ms` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="testimonial-right">
          <div className={`testimonial-content${transitioning ? ' fading' : ''}`}>
            <div className="testimonial-metric-row">
              <span className="testimonial-metric-value">{t.metric}</span>
              <span className="testimonial-metric-label">{t.metricLabel}</span>
            </div>

            <blockquote className="testimonial-quote">
              {t.quote}
            </blockquote>

            <div className="testimonial-attribution">
              <div className="testimonial-avatar">
                {t.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="testimonial-person">
                <span className="testimonial-person-name">{t.name}</span>
                <span className="testimonial-person-role">{t.title}, {t.company}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
