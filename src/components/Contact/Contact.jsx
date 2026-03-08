import { useState, useCallback, useEffect, useRef } from 'react';
import './Contact.css';

const REVENUE_OPTIONS = [
  { value: '', label: 'Select range' },
  { value: '1-5', label: '$1M \u2013 $5M' },
  { value: '5-10', label: '$5M \u2013 $10M' },
  { value: '10-25', label: '$10M \u2013 $25M' },
  { value: '25-50', label: '$25M \u2013 $50M' },
  { value: '50-100', label: '$50M \u2013 $100M' },
  { value: '100-250', label: '$100M \u2013 $250M' },
  { value: '250-500', label: '$250M \u2013 $500M' },
  { value: '500+', label: '$500M+' },
];

const EXPECTATIONS = [
  { label: 'Response', value: 'Within 24 hours' },
  { label: 'First call', value: '30-min discovery' },
  { label: 'Proposal', value: 'Within 1 week' },
];

const FORM_SUCCESS_DURATION_MS = 4000;

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

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

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), FORM_SUCCESS_DURATION_MS);
  }, []);

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className={`contact-wrapper${visible ? ' visible' : ''}`}>
        {/* Hero CTA area */}
        <div className="contact-hero">
          <div className="contact-hero-inner">
            <span className="contact-label">Start a Conversation</span>
            <h2 className="contact-headline">
              Ready to see what<br />
              AI can do for <span className="contact-headline-accent">your business</span>?
            </h2>
            <p className="contact-subtitle">
              Tell us about your challenges. We'll tell you exactly how we'd solve them — no pitch decks, no fluff.
            </p>
          </div>
        </div>

        {/* Content area */}
        <div className="contact-body">
          {/* Left — details */}
          <div className="contact-details">
            <div className="contact-detail-block">
              <span className="contact-detail-label">Email us directly</span>
              <a href="mailto:engage@archos.ai" className="contact-email-link">
                engage@archos.ai
              </a>
            </div>

            <div className="contact-expectations">
              <span className="contact-detail-label">What to expect</span>
              <div className="contact-expect-list">
                {EXPECTATIONS.map((item) => (
                  <div key={item.label} className="contact-expect-item">
                    <span className="contact-expect-key">{item.label}</span>
                    <span className="contact-expect-divider" />
                    <span className="contact-expect-val">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="contact-detail-block">
              <span className="contact-detail-label">Engagement minimum</span>
              <span className="contact-detail-value">$1M+ annual revenue</span>
            </div>
          </div>

          {/* Right — form */}
          <div className="contact-form-card">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="form-field">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" placeholder="John Smith" required />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Work Email</label>
                  <input type="email" id="email" name="email" placeholder="john@company.com" required />
                </div>
              </div>
              <div className="contact-form-row">
                <div className="form-field">
                  <label htmlFor="company">Company</label>
                  <input type="text" id="company" name="company" placeholder="Company Inc." required />
                </div>
                <div className="form-field">
                  <label htmlFor="revenue">Annual Revenue</label>
                  <select id="revenue" name="revenue" required>
                    {REVENUE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="message">How can we help?</label>
                <textarea id="message" name="message" rows={4} placeholder="Tell us about your current challenges and what you're looking to achieve..." required />
              </div>
              <div className="contact-form-footer">
                <button
                  type="submit"
                  className={`btn btn-primary btn-submit${sent ? ' sent' : ''}`}
                  disabled={sent}
                >
                  {sent ? "Sent \u2014 We'll be in touch" : 'Request a Briefing'}
                </button>
                <span className="contact-form-note">
                  No commitment required. NDA available on request.
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
