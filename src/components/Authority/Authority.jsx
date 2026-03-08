import './Authority.css';

const TAGS = [
  'Fortune 500',
  'Series C+',
  'Global Enterprise',
  'Government',
  'Healthcare',
  'Financial Services',
];

export default function Authority() {
  return (
    <section className="authority" id="authority">
      <div className="authority-inner">
        <p className="authority-label">Trusted by teams at</p>
      </div>
      <div className="authority-marquee">
        <div className="authority-marquee-track">
          {[...TAGS, ...TAGS, ...TAGS, ...TAGS].map((tag, i) => (
            <span key={i} className="authority-tag">
              <span className="authority-tag-dot"></span>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="authority-partner">
        <div className="authority-partner-inner">
          <span className="authority-partner-label">Strategic Partner</span>
          <a
            href="https://www.bobfi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="authority-partner-link"
          >
            <span className="authority-partner-name">BobFi</span>
            <span className="authority-partner-desc">
              Financial Operations & Advisory
            </span>
            <span className="authority-partner-arrow">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
