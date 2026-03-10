import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ARTICLES } from '../../data/articles';
import './BlogSection.css';

export default function BlogSection() {
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
    <section className="blog-section" id="insights" ref={sectionRef}>
      <div className={`blog-section-inner${visible ? ' visible' : ''}`}>
        <div className="blog-section-top">
          <h2 className="section-heading">Insights</h2>
          <Link href="/blog" className="blog-section-all">
            View all articles
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          </Link>
        </div>

        <div className="blog-grid">
          {ARTICLES.map((article, i) => (
            <Link
              href={`/blog/${article.slug}`}
              key={article.slug}
              className="blog-card"
              style={{ transitionDelay: visible ? `${i * 100}ms` : '0ms' }}
            >
              <div className="blog-card-meta">
                <span className="blog-card-category">{article.category}</span>
                <span className="blog-card-date">{formatDate(article.date)}</span>
              </div>
              <h3 className="blog-card-title">{article.title}</h3>
              <p className="blog-card-excerpt">{article.excerpt}</p>
              <div className="blog-card-footer">
                <span className="blog-card-read">{article.readTime}</span>
                <span className="blog-card-arrow">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
