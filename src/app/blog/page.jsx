'use client';

import Link from 'next/link';
import { ARTICLES } from '../../data/articles';
import Logo from '../../components/Logo/Logo';
import '../../components/BlogSection/BlogSection.css';
import '../../views/BlogPages.css';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BlogList() {
  return (
    <div className="blog-page">
      <header className="blog-page-nav">
        <div className="blog-page-nav-inner">
          <Link href="/" className="blog-page-logo">
            <Logo />
            <span className="logo-wordmark">ARCHOS AI</span>
          </Link>
          <Link href="/" className="blog-page-back">Back to Home</Link>
        </div>
      </header>

      <div className="blog-page-hero">
        <span className="blog-page-label">Insights</span>
        <h1 className="blog-page-title">Thinking on AI, automation, and enterprise strategy.</h1>
        <p className="blog-page-subtitle">
          Practical perspectives from the teams building AI systems for the world&apos;s most demanding organizations.
        </p>
      </div>

      <div className="blog-page-content">
        <div className="blog-grid">
          {ARTICLES.map((article) => (
            <Link
              href={`/blog/${article.slug}`}
              key={article.slug}
              className="blog-card"
              style={{ opacity: 1, transform: 'none' }}
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
    </div>
  );
}
