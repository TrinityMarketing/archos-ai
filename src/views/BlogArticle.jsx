import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ARTICLES } from '../data/articles';
import Logo from '../components/Logo/Logo';
import './BlogPages.css';

export default function BlogArticle() {
  const { slug } = useParams();
  const article = ARTICLES.find((a) => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) return <Navigate to="/blog" replace />;

  // Update document title and meta for SEO
  useEffect(() => {
    document.title = `${article.title} | Archos AI`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', article.metaDescription);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', article.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', article.metaDescription);

    return () => {
      document.title = 'Archos AI | Enterprise AI Consulting & Automation';
      if (metaDesc) metaDesc.setAttribute('content', 'Archos AI delivers enterprise AI consulting and intelligent automation for businesses doing $1M+ annually. Strategy, integration, and deployment that drives measurable ROI.');
    };
  }, [article]);

  return (
    <div className="blog-page">
      <header className="blog-page-nav">
        <div className="blog-page-nav-inner">
          <Link to="/" className="blog-page-logo">
            <Logo />
            <span className="logo-wordmark">ARCHOS AI</span>
          </Link>
          <Link to="/blog" className="blog-page-back">All Articles</Link>
        </div>
      </header>

      <article className="article">
        <div className="article-header">
          <div className="article-meta">
            <span className="article-category">{article.category}</span>
            <span className="article-date">{formatDate(article.date)}</span>
            <span className="article-read">{article.readTime}</span>
          </div>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-excerpt">{article.excerpt}</p>
        </div>

        <div className="article-body">
          {article.content.map((block, i) => {
            if (block.type === 'heading') {
              return <h2 key={i} className="article-h2">{block.text}</h2>;
            }
            return <p key={i} className="article-p">{block.text}</p>;
          })}
        </div>

        <div className="article-footer">
          <div className="article-author">
            <div className="article-author-avatar">A</div>
            <div className="article-author-info">
              <span className="article-author-name">{article.author}</span>
              <span className="article-author-role">Enterprise AI Consulting</span>
            </div>
          </div>
          <Link to="/blog" className="article-back-link">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M13 7H1M6 2L1 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
            Back to all articles
          </Link>
        </div>
      </article>

      <footer className="blog-page-footer">
        <span>&copy; 2026 Archos AI. All rights reserved.</span>
      </footer>
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
