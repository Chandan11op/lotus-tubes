import React from 'react';
import { BLOG_POSTS, createProductSVG } from '../data/siteData';
import PageHero from '../components/common/PageHero';

export const BlogView = ({ slug, onOpenEnquiry }) => {
  if (slug) {
    const post = BLOG_POSTS.find((p) => p.slug === slug || p.id === slug) || BLOG_POSTS[0];
    return (
      <>
        <PageHero
          badge={`${post.category} • ${post.readTime}`}
          title={post.title}
          subtitle={`Technical Article • Published on ${post.date}`}
          description="In-depth analysis and technical insights from the Lotus Tubes Engineering & Quality desk in Mumbai."
          slides={[
            {
              image: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-005.jpg',
              badge: `${post.category} • ${post.readTime}`,
              title: post.title,
              subtitle: `Technical Article • Published on ${post.date}`,
              description: 'In-depth analysis and technical insights from the Lotus Tubes Engineering & Quality desk in Mumbai.'
            }
          ]}
          actions={[
            <a key="back" href="#blog" className="btn btn--outline">
              &larr; Back to All Articles
            </a>,
            <button
              key="rfq"
              type="button"
              onClick={() => onOpenEnquiry && onOpenEnquiry(null, post.title)}
              className="btn btn--primary"
            >
              Discuss Your Project &rarr;
            </button>
          ]}
        />

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
      <PageHero
        badge="Lotus Tubes Knowledge Center"
        title="Technical Engineering Blog"
        subtitle="Sanitary Metallurgy, Surface Finish Guidelines & Process Insights"
        description="Authoritative technical insights into stainless steel grades, surface roughness Ra standards, ASME BPE requirements, and orbital welding best practices."
        slides={[
          {
            image: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-002.jpg',
            badge: 'Lotus Tubes Knowledge Center',
            title: 'Technical Engineering Blog',
            subtitle: 'Sanitary Metallurgy, Surface Finish Guidelines & Process Insights',
            description: 'Authoritative technical insights into stainless steel grades, surface roughness Ra standards, ASME BPE requirements, and orbital welding best practices.'
          },
          {
            image: '/assets/images/company/lotus-tubes-facility.jpg',
            badge: 'Direct Industry Experience',
            title: 'Hygienic Process Engineering Articles',
            subtitle: 'Practical Solutions for Pharma, Dairy, and Biotech Equipment Builders',
            description: 'Learn how to prevent rouging in WFI loops, select certified elastomer gaskets, and choose between EP and MP finishes.'
          }
        ]}
        stats={[
          { value: 'ASME BPE', label: 'Technical Guidelines' },
          { value: 'Ra Roughness', label: 'Surface Finish Guides' },
          { value: 'WFI Loops', label: 'Pharma Case Studies' },
          { value: 'Weekly', label: 'Engineering Updates' }
        ]}
      />

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
                  {post.category} • {post.readTime}
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
