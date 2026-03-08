import { useEffect, useRef, useState } from 'react';
import SplineScene from './SplineScene';
import Spotlight from './Spotlight';
import './SplineShowcase.css';

export default function SplineShowcase() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <section className="spline-showcase" ref={sectionRef}>
      <div className={`spline-showcase-card${visible ? ' visible' : ''}`}>
        <Spotlight
          fill="#c8a97e"
          style={{ top: '-40%', left: '0' }}
        />

        <div className="spline-showcase-inner">
          <div className={`spline-showcase-content${visible ? ' visible' : ''}`}>
            <span className="spline-showcase-eyebrow">
              <span className="spline-showcase-eyebrow-line"></span>
              AI-Powered Solutions
            </span>
            <h2 className="spline-showcase-headline">
              Intelligence,<br />engineered.
            </h2>
            <p className="spline-showcase-desc">
              We harness cutting-edge AI technology and integrate it directly
              into your business operations. From intelligent automation to
              autonomous agents — we build systems that think, adapt, and scale.
            </p>
            <div className="spline-showcase-features">
              <div className="spline-showcase-feature">
                <span className="spline-showcase-feature-dot"></span>
                <span>Autonomous AI agents</span>
              </div>
              <div className="spline-showcase-feature">
                <span className="spline-showcase-feature-dot"></span>
                <span>Workflow automation</span>
              </div>
              <div className="spline-showcase-feature">
                <span className="spline-showcase-feature-dot"></span>
                <span>Real-time decision systems</span>
              </div>
            </div>
          </div>

          <div className="spline-showcase-scene">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
