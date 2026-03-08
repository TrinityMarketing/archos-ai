import { useEffect, useRef } from 'react';
import AnimatedStat from '../AnimatedStat/AnimatedStat';
import './Hero.css';

const STATS = [
  { value: 340, prefix: '$', suffix: 'M+', label: 'Client Impact', duration: 2200 },
  { value: 47, suffix: '', label: 'Engagements', duration: 1800 },
  { value: 12, suffix: 'x', label: 'Average ROI', duration: 1600 },
  { value: 100, suffix: '%', label: 'Client Retention', duration: 2000 },
];

export default function Hero() {
  const linesRef = useRef([]);

  useEffect(() => {
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      line.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      }, 400 + i * 180);
    });
  }, []);

  const handleScroll = (e, href) => {
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <p className="hero-eyebrow">
            <span className="hero-eyebrow-line"></span>
            Enterprise AI Consulting
          </p>
          <h1 className="hero-headline">
            {['We don\'t just talk', 'about AI.', 'We deploy it.'].map(
              (text, i) => (
                <span
                  key={i}
                  className={`hero-line${i === 2 ? ' hero-line-3' : ''}`}
                  ref={(el) => (linesRef.current[i] = el)}
                >
                  {text}
                </span>
              )
            )}
          </h1>
          <p className="hero-subtitle">
            We partner with high-end businesses to implement AI-driven systems
            and automations that drive measurable impact. No hype. No science
            projects. Just results.
          </p>
          <div className="hero-buttons">
            <a
              href="#contact"
              className="btn btn-primary"
              onClick={(e) => handleScroll(e, '#contact')}
            >
              Schedule a Briefing
            </a>
            <a
              href="#results"
              className="btn btn-ghost"
              onClick={(e) => handleScroll(e, '#results')}
            >
              View Case Studies
            </a>
          </div>
        </div>
        <div className="hero-stats">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="hero-stat-block" style={{ transitionDelay: `${i * 150}ms` }}>
              <AnimatedStat
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                label={stat.label}
                duration={stat.duration}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
