import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS, CATEGORIES } from '../../data/siteData';

export const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const query = searchTerm.toLowerCase().trim();
  const matchedProducts = query
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.material.toLowerCase().includes(query) ||
          (p.sizes && p.sizes.toLowerCase().includes(query)) ||
          (p.finish && p.finish.toLowerCase().includes(query))
      )
    : [];

  const matchedCategories = query
    ? CATEGORIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.desc.toLowerCase().includes(query)
      )
    : [];

  return (
    <div className="modal-overlay active" id="search-modal" role="dialog" aria-modal="true" aria-label="Product Search">
      <div className="modal-box modal-box--search">
        <div className="modal-search-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            type="search"
            id="site-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sanitary pipes, SS 316L bends, ferrules, valves..."
            autoComplete="off"
          />
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close search">
            &times;
          </button>
        </div>

        <div className="modal-search-body">
          <div className="search-quick-tags">
            <span className="search-tag-label">Popular Searches:</span>
            {['EP Pipe', '90 Bend', 'Tri-Clamp', 'Butterfly Valve', 'Diaphragm Valve', 'Silicone Gasket'].map((tag) => (
              <button
                key={tag}
                type="button"
                className="quick-filter-tag"
                onClick={() => setSearchTerm(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div id="search-results-list" className="search-results-list">
            {query && matchedProducts.length === 0 && matchedCategories.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#667085' }}>
                No matching sanitary products found for "{searchTerm}".
              </div>
            )}

            {matchedCategories.map((c) => (
              <a
                key={c.id}
                href={`#category/${c.slug}`}
                onClick={onClose}
                className="search-result-item"
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderBottom: '1px solid #E3E8EF' }}
              >
                <span style={{ fontSize: '24px' }}>{c.icon}</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#10263D' }}>{c.name}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>Category &bull; {c.subcategories?.join(', ')}</p>
                </div>
              </a>
            ))}

            {matchedProducts.map((p) => (
              <a
                key={p.id}
                href={`#product/${p.slug}`}
                onClick={onClose}
                className="search-result-item"
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderBottom: '1px solid #E3E8EF' }}
              >
                <img
                  src={p.image.startsWith('assets/') ? `/${p.image}` : p.image}
                  alt={p.name}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E3E8EF' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#10263D' }}>{p.name}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#667085' }}>
                    {p.category} &bull; {p.material} &bull; {p.finish} &bull; {p.sizes}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
