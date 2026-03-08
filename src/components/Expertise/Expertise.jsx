import './Expertise.css';

const CARDS = [
  {
    number: '01',
    title: 'AI Strategy & Consulting',
    desc: 'We assess your operations, identify high-impact opportunities, and build a clear roadmap for AI adoption that aligns with your business goals.',
    tags: ['Opportunity mapping', 'Technology selection', 'ROI modeling'],
  },
  {
    number: '02',
    title: 'Workflow Automation',
    desc: 'We implement end-to-end automations that eliminate manual bottlenecks, reduce overhead, and let your team focus on what matters.',
    tags: ['Process automation', 'System integration', 'Operational efficiency'],
  },
  {
    number: '03',
    title: 'AI Integration & Deployment',
    desc: 'We connect best-in-class AI tools directly into your existing stack. No rebuilding from scratch — just seamless, production-ready integration.',
    tags: ['Platform integration', 'API orchestration', 'Data pipelines'],
  },
  {
    number: '04',
    title: 'AI Agents & Intelligent Systems',
    desc: 'We design and deploy autonomous agents that handle complex tasks, make decisions, and scale your team without adding headcount.',
    tags: ['AI agents', 'Decision automation', 'Human-in-the-loop'],
  },
];

export default function Expertise() {
  return (
    <section className="expertise" id="expertise">
      <div className="section-inner">
        <h2 className="section-heading">Expertise</h2>
        <div className="expertise-grid">
          {CARDS.map((card) => (
            <article key={card.number} className="expertise-card" data-reveal="">
              <span className="expertise-number">{card.number}</span>
              <h3 className="expertise-title">{card.title}</h3>
              <p className="expertise-desc">{card.desc}</p>
              <div className="expertise-tags">
                {card.tags.map((tag) => (
                  <span key={tag} className="expertise-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
