import './About.css';

export default function About() {
  return (
    <section className="about" id="about">
      <div className="section-inner about-inner">
        <div className="about-col about-col-left" data-reveal="">
          <h2 className="about-headline">Built by operators, not observers.</h2>
        </div>
        <div className="about-col about-col-right" data-reveal="">
          <p>
            Our team has operated inside FAANG companies, top consulting firms,
            and high-growth ventures. We know what works at scale because we've
            done it ourselves.
          </p>
          <p>
            We don't build AI from scratch — we identify the best technology
            available and deploy it where it matters most. Strategy without
            implementation is just a slide deck. We do both.
          </p>
          <p>
            15+ years average experience. 100% client retention. We take on a
            small number of engagements so every client gets our full attention.
          </p>
        </div>
      </div>
    </section>
  );
}
