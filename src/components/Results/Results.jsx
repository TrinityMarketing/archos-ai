import { useEffect, useRef, useState, useCallback } from 'react';
import './Results.css';

const CASES = [
  {
    id: 'financial',
    sector: 'Financial Services',
    headline: 'Underwriting, automated.',
    desc: 'We replaced an entire manual underwriting pipeline with AI-driven document processing and decision automation. 14-week deployment. Zero downtime. The system paid for itself in under 90 days.',
    heroValue: 73,
    heroSuffix: '%',
    heroLabel: 'Faster Processing',
    metrics: [
      { display: '$18M', label: 'Annual Savings' },
      { display: '99.2%', label: 'Accuracy' },
      { display: '14wk', label: 'To Deploy' },
      { display: '90d', label: 'To ROI' },
    ],
  },
  {
    id: 'healthcare',
    sector: 'Healthcare',
    headline: 'Clinical ops, transformed.',
    desc: 'AI-powered clinical documentation and prior-authorization automation for a national payer. Eliminated hours of manual processing per case and freed clinical staff to focus on patient outcomes.',
    heroValue: 4,
    heroSuffix: 'x',
    heroLabel: 'Throughput Increase',
    metrics: [
      { display: '340K', label: 'Cases Processed' },
      { display: '96%', label: 'Accuracy' },
      { display: '8wk', label: 'To Deploy' },
      { display: '67%', label: 'Cost Reduction' },
    ],
  },
  {
    id: 'ecommerce',
    sector: 'E-Commerce',
    headline: 'Revenue, engineered.',
    desc: 'Integrated AI-driven personalization and recommendation systems across catalog, search, and checkout. Every touchpoint optimized. Measurable revenue lift within 60 days of launch.',
    heroValue: 52,
    heroSuffix: 'M',
    heroPrefix: '$',
    heroLabel: 'Revenue Impact',
    metrics: [
      { display: '34%', label: 'AOV Increase' },
      { display: '2M+', label: 'Users Served' },
      { display: '11wk', label: 'To Deploy' },
      { display: '18x', label: 'ROI' },
    ],
  },
];

function CountUp({ value, active }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) { setDisplay(0); return; }
    let start = null;
    let raf;
    function animate(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1800, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(eased * value));
      if (p < 1) raf = requestAnimationFrame(animate);
      else setDisplay(value);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [active, value]);

  return <>{display}</>;
}

export default function Results() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);

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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const switchCase = useCallback((i) => {
    if (i === activeIndex || fading) return;
    setFading(true);
    setTimeout(() => {
      setActiveIndex(i);
      setTimeout(() => setFading(false), 50);
    }, 250);
  }, [activeIndex, fading]);

  const c = CASES[activeIndex];

  return (
    <section className="results" id="results" ref={sectionRef}>
      <div className={`results-inner${visible ? ' visible' : ''}`}>
        {/* Section label + tab switcher */}
        <div className="results-top">
          <h2 className="section-heading">Results</h2>
          <nav className="results-nav">
            {CASES.map((item, i) => (
              <button
                key={item.id}
                className={`results-nav-btn${i === activeIndex ? ' active' : ''}`}
                onClick={() => switchCase(i)}
              >
                {item.sector}
              </button>
            ))}
          </nav>
        </div>

        {/* Case study content */}
        <div className={`results-content${fading ? ' fading' : ''}`}>
          {/* Hero metric */}
          <div className="results-hero">
            <span className="results-hero-value" key={`v-${activeIndex}`}>
              {c.heroPrefix || ''}
              <CountUp value={c.heroValue} active={visible && !fading} key={`c-${activeIndex}`} />
              {c.heroSuffix}
            </span>
            <span className="results-hero-label">{c.heroLabel}</span>
          </div>

          {/* Description */}
          <div className="results-desc-area">
            <span className="results-sector-label">{c.sector}</span>
            <h3 className="results-headline">{c.headline}</h3>
            <p className="results-desc">{c.desc}</p>
          </div>
        </div>

        {/* Supporting metrics row */}
        <div className={`results-metrics${fading ? ' fading' : ''}`}>
          {c.metrics.map((m, i) => (
            <div
              className="results-metric"
              key={`${activeIndex}-${m.label}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="results-metric-value">{m.display}</span>
              <span className="results-metric-label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
