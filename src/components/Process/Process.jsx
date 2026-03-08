import { useEffect, useRef, useState, useCallback } from 'react';
import './Process.css';

const STEPS = [
  {
    number: '01',
    title: 'Discovery & Audit',
    duration: '2\u20133 weeks',
    desc: 'We map your operations, systems, and pain points to identify exactly where AI can drive the most value. No assumptions — just data.',
    deliverables: ['Operations audit', 'Opportunity map', 'ROI projections'],
    highlight: 'Where does AI fit?',
  },
  {
    number: '02',
    title: 'Solution Design',
    duration: '3\u20134 weeks',
    desc: 'We select the right AI tools and platforms, design integration architecture, and build a detailed implementation plan. Security and compliance are built in from day one.',
    deliverables: ['Architecture blueprint', 'Tool selection', 'Implementation plan'],
    highlight: 'What do we build?',
  },
  {
    number: '03',
    title: 'Implement & Validate',
    duration: '6\u201312 weeks',
    desc: 'We build, integrate, and rigorously test automations against your success metrics. Your team is embedded in the process at every step.',
    deliverables: ['Working integrations', 'Performance benchmarks', 'Team training'],
    highlight: 'Make it real.',
  },
  {
    number: '04',
    title: 'Deploy & Scale',
    duration: 'Ongoing',
    desc: 'Production rollout, monitoring, and continuous optimization. Full handoff and training so your team owns the system completely.',
    deliverables: ['Production deployment', 'Monitoring setup', 'Full documentation'],
    highlight: 'Own it forever.',
  },
];

export default function Process() {
  const sectionRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [cardsRevealed, setCardsRevealed] = useState(() => STEPS.map(() => false));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reveal cards with stagger once section is visible
  useEffect(() => {
    if (!sectionVisible) return;
    const timers = STEPS.map((_, i) =>
      setTimeout(() => {
        setCardsRevealed((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * 150)
    );
    return () => timers.forEach(clearTimeout);
  }, [sectionVisible]);

  // Track active card via scroll — pick whichever card center is closest to viewport center
  useEffect(() => {
    let raf = null;

    function update() {
      const container = cardsContainerRef.current;
      if (!container) return;

      const cards = container.querySelectorAll('.process-card');
      if (!cards.length) return;

      const anchor = window.innerHeight * 0.45;
      let closest = 0;
      let closestDist = Infinity;

      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const dist = Math.abs(cardCenter - anchor);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });

      setActiveIndex(closest);
      raf = null;
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(update, 200);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const activeStep = STEPS[activeIndex];
  const progress = ((activeIndex + 1) / STEPS.length) * 100;

  return (
    <section className="process" id="process" ref={sectionRef}>
      <div className={`process-container${sectionVisible ? ' visible' : ''}`}>
        <div className="process-sticky">
          <div className="process-sticky-inner">
            <h2 className="section-heading">Process</h2>

            <div className="process-active-display">
              <span className="process-active-number" key={activeIndex}>
                {activeStep.number}
              </span>
              <span className="process-active-highlight" key={`h-${activeIndex}`}>
                {activeStep.highlight}
              </span>
            </div>

            <div className="process-nav">
              {STEPS.map((step, i) => (
                <button
                  key={step.number}
                  className={`process-nav-item${i === activeIndex ? ' active' : ''}${i < activeIndex ? ' completed' : ''}`}
                  onClick={() => {
                    const cards = cardsContainerRef.current?.querySelectorAll('.process-card');
                    cards?.[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                >
                  <span className="process-nav-number">{step.number}</span>
                  <span className="process-nav-title">{step.title}</span>
                  <span className="process-nav-duration">{step.duration}</span>
                </button>
              ))}
            </div>

            <div className="process-progress-bar">
              <div
                className="process-progress-fill"
                style={{ height: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="process-cards" ref={cardsContainerRef}>
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`process-card${cardsRevealed[i] ? ' revealed' : ''}${i === activeIndex ? ' focused' : ''}`}
              style={{ transitionDelay: cardsRevealed[i] ? '0ms' : `${i * 100}ms` }}
            >
              <div className="process-card-accent" />
              <div className="process-card-number-bg">{step.number}</div>

              <div className="process-card-body">
                <div className="process-card-header">
                  <span className="process-card-step">Phase {i + 1}</span>
                  <h3 className="process-card-title">{step.title}</h3>
                  <span className="process-card-duration">{step.duration}</span>
                </div>

                <p className="process-card-desc">{step.desc}</p>

                <div className="process-card-deliverables">
                  <span className="process-card-deliverables-label">Deliverables</span>
                  <div className="process-card-tags">
                    {step.deliverables.map((d) => (
                      <span key={d} className="process-card-tag">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
