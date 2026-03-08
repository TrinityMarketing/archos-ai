import { useEffect, useRef, useState } from 'react';
import ParticleText from './ParticleText';
import './ParticleInterlude.css';

export default function ParticleInterlude() {
  const missionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = missionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="particle-interlude">
      <div className="particle-interlude-inner">
        <ParticleText
          text="ARCHOS AI"
          fontSize={140}
          fontFamily="'Space Grotesk', sans-serif"
          particleSize={1.4}
          particleDensity={5}
          dispersionStrength={18}
          returnSpeed={0.07}
          color="#c8a97e"
        />
      </div>
      <p className="particle-interlude-caption">
        Move your cursor to interact
      </p>
      <div
        className={`particle-mission${visible ? ' visible' : ''}`}
        ref={missionRef}
      >
        <div className="particle-mission-inner">
          <span className="particle-mission-label">Our Mission</span>
          <p className="particle-mission-text">
            To demystify artificial intelligence and put its power in the hands
            of every business — regardless of size, industry, or technical
            background. We believe AI should be accessible, actionable, and
            transformative. Archos AI exists to bridge the gap between
            cutting-edge technology and real-world results, guiding
            organizations from curiosity to capability, and from capability to
            competitive advantage.
          </p>
        </div>
      </div>
    </section>
  );
}
