import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'lotus_news_posts';

export const CRMNewsSocialView = ({ isSuperAdmin = false }) => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Company News');
  const [author, setAuthor] = useState('Lotus Tubes Editorial');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('/assets/images/products images/cover page/TPM-202.jpg');
  const [successMsg, setSuccessMsg] = useState('');

  // Load posts
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPosts(JSON.parse(stored));
      } else {
        setPosts([]);
      }
    } catch {
      setPosts([]);
    }
  }, []);

  const savePosts = (newPosts) => {
    setPosts(newPosts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts));
      window.dispatchEvent(new Event('lotus-news-updated'));
    } catch (e) {
      console.error('Failed to save news posts:', e);
    }
  };

  const handleOpenAdd = () => {
    setEditingPost(null);
    setTitle('');
    setCategory('Company News');
    setAuthor('Lotus Tubes Editorial');
    setDate(new Date().toISOString().split('T')[0]);
    setSummary('');
    setContent('');
    setImageUrl('/assets/images/products images/cover page/TPM-202.jpg');
    setShowModal(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setAuthor(post.author || 'Lotus Tubes Editorial');
    setDate(post.date);
    setSummary(post.summary);
    setContent(post.content || '');
    setImageUrl(post.imageUrl || '');
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    const filtered = posts.filter((p) => p.id !== id);
    savePosts(filtered);
    setSuccessMsg('Article deleted successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      alert('Title and Summary are required.');
      return;
    }

    if (editingPost) {
      const updated = posts.map((p) =>
        p.id === editingPost.id
          ? {
              ...p,
              title,
              category,
              author,
              date,
              summary,
              content,
              imageUrl,
              updatedAt: new Date().toISOString()
            }
          : p
      );
      savePosts(updated);
      setSuccessMsg('Article updated successfully.');
    } else {
      const newPost = {
        id: `news-${Date.now()}`,
        title,
        category,
        author,
        date,
        summary,
        content,
        imageUrl,
        createdAt: new Date().toISOString()
      };
      savePosts([newPost, ...posts]);
      setSuccessMsg('New article published to News & Social section.');
    }

    setShowModal(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="crm-view-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* View Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#E93984', fontWeight: 700, letterSpacing: '1px' }}>
            Website Content Management
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '4px 0 0 0' }}>
            News &amp; Social Activities Manager
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
            Publish official company news, product releases, trade fair exhibitions, and CSR activities for the public homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          style={{
            background: 'linear-gradient(135deg, #E93984 0%, #FC63A7 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            padding: '10px 22px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(233, 57, 132, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>＋</span>
          <span>Add News / Article</span>
        </button>
      </div>

      {successMsg && (
        <div style={{ padding: '12px 18px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', color: '#065F46', marginBottom: '20px', fontSize: '13px', fontWeight: 600 }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#F8FAFC', border: '2px dashed #CBD5E1', borderRadius: '16px', color: '#64748B' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📰</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
            No News or Social Articles Published
          </h3>
          <p style={{ fontSize: '13px', maxWidth: '440px', margin: '0 auto 16px auto', lineHeight: '1.5' }}>
            The public News &amp; Social Activities section on the homepage is currently kept clean and empty as requested. Click below to publish your first article.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ＋ Add First Article
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {post.imageUrl && (
                <div style={{ height: '160px', overflow: 'hidden', background: '#F1F5F9' }}>
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div style={{ padding: '16px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', background: '#FDF2F8', color: '#E93984', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    {post.category}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>{post.date}</span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', lineHeight: 1.3 }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>
                  {post.summary}
                </p>
              </div>

              <div style={{ padding: '12px 16px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(post)}
                  style={{ background: 'transparent', border: '1px solid #CBD5E1', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  style={{ background: '#FEE2E2', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#DC2626', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {editingPost ? 'Edit News / Article' : 'Publish New Article'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Article Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lotus Tubes Expands High-Purity Sanitary Piping Warehouse in Mumbai"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="Company News">Company News</option>
                    <option value="Factory & Warehouse">Factory &amp; Warehouse</option>
                    <option value="Exhibition & Events">Exhibition &amp; Events</option>
                    <option value="Social Activity">Social Activity</option>
                    <option value="Quality & Certifications">Quality &amp; Certifications</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Image URL / Asset Path
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/assets/images/products images/cover page/TPM-202.jpg"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Short Summary / Excerpt *
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="A concise 1-2 sentence overview of this announcement..."
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Full Content (Optional)
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Complete article details, quotes, and specifications..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: '#F1F5F9', border: 'none', padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #E93984 0%, #FC63A7 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {editingPost ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMNewsSocialView;
