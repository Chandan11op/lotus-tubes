import React from 'react';
import { BLOG_POSTS, createProductSVG } from '../data/siteData';

export const BlogView = ({ slug, onOpenEnquiry }) => {
  if (slug) {
    const post = BLOG_POSTS.find((p) => p.slug === slug || p.id === slug) || BLOG_POSTS[0];
    return (
      <>
        <section className="page-hero">
          <div className="site-container">
            <span className="badge badge--pink mb-2">
              {post.category} &bull; {post.readTime}
            </span>
            <h1 className="page-hero-title">{post.title}</h1>
            <p className="page-hero-subtitle">Published on {post.date} by Lotus Tubes Technical Desk</p>
          </div>
        </section>

        <div className="site-container section" style={{ maxWidth: '860px' }}>
          <article className="form-card" style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            <div
              className="mt-3 pt-3"
              style={{
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <a href="#blog" className="btn btn--outline-dark">
                &larr; Back to All Articles
              </a>
              <button
                type="button"
                onClick={() => onOpenEnquiry && onOpenEnquiry(null, post.title)}
                className="btn btn--primary"
              >
                Discuss Your Piping Project &rarr;
              </button>
            </div>
          </article>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="site-container">
          <h1 className="page-hero-title">Technical Engineering Blog</h1>
          <p className="page-hero-subtitle">
            Insights into stainless steel metallurgy, sanitary standards, roughness guidelines, and hygienic process engineering.
          </p>
        </div>
      </section>

      <div className="site-container section">
        <div className="resource-grid">
          {BLOG_POSTS.map((post) => (
            <article className="range-card" key={post.slug}>
              <div className="range-card__img-wrap">
                <img
                  src={createProductSVG(post.title, post.category, '#10263D')}
                  alt={post.title}
                  className="range-card__img"
                />
              </div>
              <div className="range-card__body">
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--primary-blue)',
                    textTransform: 'uppercase',
                    marginBottom: '6px'
                  }}
                >
                  {post.category} &bull; {post.readTime}
                </div>
                <h3 className="range-card__title">
                  <a href={`#blog/${post.slug}`}>{post.title}</a>
                </h3>
                <p className="range-card__desc">{post.excerpt}</p>
                <div className="range-card__footer">
                  <a href={`#blog/${post.slug}`} className="range-card__link">
                    Read Article <span>&rarr;</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogView;
