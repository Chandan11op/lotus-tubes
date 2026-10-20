import React from 'react';
import { BLOG_POSTS } from '../data/siteData';

export const BlogView = ({ slug }) => {
  const currentPost = slug ? BLOG_POSTS.find((b) => b.slug === slug || b.id === slug) : null;

  return (
    <div>
      <section className="page-hero">
        <div className="site-container">
          <h1 className="page-hero-title">Technical Engineering Blog</h1>
          <p className="page-hero-subtitle">
            Insights on stainless steel metallurgy, sanitary standards compliance, electro-polishing mechanics, and fluid process piping.
          </p>
        </div>
      </section>

      <div className="site-container section">
        {currentPost ? (
          <article style={{ maxWidth: '840px', margin: '0 auto' }}>
            <div style={{ marginBottom: '16px' }}>
              <span className="badge badge--pink">{currentPost.category}</span>
              <span style={{ fontSize: '13px', color: '#667085', marginLeft: '12px' }}>{currentPost.date}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--deep-navy)', fontSize: '2.2rem', marginBottom: '20px', lineHeight: 1.3 }}>
              {currentPost.title}
            </h1>
            <div style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8, marginBottom: '24px', fontStyle: 'italic' }}>
              {currentPost.excerpt}
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #E3E8EF', margin: '24px 0' }} />
            <div style={{ color: '#334155', lineHeight: 1.8, fontSize: '1.05rem' }}>
              <p>{currentPost.content || currentPost.excerpt}</p>
              <p style={{ marginTop: '16px' }}>
                For technical specifications, dimensional schedules, and testing certificates for stainless steel sanitary tubes, consult our engineering desk directly.
              </p>
            </div>
            <div style={{ marginTop: '36px' }}>
              <a href="#blog" className="btn btn--secondary">
                &larr; Back to All Articles
              </a>
              <a href="#quote" className="btn btn--primary" style={{ marginLeft: '12px' }}>
                Request Technical Sourcing Quote &rarr;
              </a>
            </div>
          </article>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {BLOG_POSTS.map((post) => (
              <article
                key={post.id}
                className="card"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E3E8EF',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="badge badge--navy">{post.category}</span>
                    <span style={{ fontSize: '12px', color: '#667085' }}>{post.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', color: '#10263D', marginBottom: '12px', lineHeight: 1.4 }}>
                    <a href={`#blog/${post.slug}`}>{post.title}</a>
                  </h3>
                  <p style={{ color: '#667085', lineHeight: 1.6, fontSize: '14px', marginBottom: '20px' }}>
                    {post.excerpt}
                  </p>
                </div>
                <a href={`#blog/${post.slug}`} className="btn btn--outline-dark btn--sm" style={{ alignSelf: 'flex-start' }}>
                  Read Technical Article &rarr;
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogView;
