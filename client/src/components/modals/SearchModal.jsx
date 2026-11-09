import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '../../data/siteData';
import { filterAndSearchProducts } from '../../utils/productSearch';

/**
 * LOTUS TUBES - Global Navigation Product Search Modal
 *
 * Full-catalogue search with real-time multi-attribute matching across names,
 * grades, surface finishes, standards, sizes, and applications.
 *
 * Supports:
 * - Real-time autocomplete suggestions
 * - Pressing Enter or clicking "View all results in Catalogue" to navigate to /products?search=...
 * - Esc to close
 * - Mobile responsive without horizontal overflow
 */
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

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const query = searchTerm.trim();

  // Matched products using centralized search engine
  const matchedProducts = useMemo(() => {
    if (!query) return [];
    return filterAndSearchProducts(PRODUCTS, { searchTerm: query });
  }, [query]);

  // Matched categories
  const matchedCategories = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.desc && c.desc.toLowerCase().includes(q)) ||
        (c.subcategories && c.subcategories.some((s) => s.toLowerCase().includes(q)))
    );
  }, [query]);

  if (!isOpen) return null;

  // Navigate to products catalogue with the search term
  const handleViewAllInCatalogue = (e) => {
    if (e) e.preventDefault();
    onClose();
    const targetUrl = `/products?search=${encodeURIComponent(query)}`;
    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      window.location.href = targetUrl;
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && query) {
      handleViewAllInCatalogue(e);
    }
  };

  return (
    <div
      className="modal-overlay open active fixed inset-0 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-950/75 backdrop-blur-sm transition-all"
      id="search-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Product Catalogue Search"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10050,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box modal-box--search w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header Search Input */}
        <div className="modal-search-header p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3 bg-slate-50/70">
          <svg className="w-5 h-5 text-sky-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>

          <input
            ref={inputRef}
            type="search"
            id="site-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search sanitary pipes, SS 316L, 90 bends, ferrules, valves..."
            autoComplete="off"
            className="flex-1 bg-transparent border-0 text-slate-900 text-base sm:text-lg font-medium placeholder:text-slate-400 focus:outline-none focus:ring-0 min-w-0"
            aria-label="Search sanitary products catalogue"
          />

          {searchTerm && (
            <button
              type="button"
              className="text-slate-400 hover:text-slate-700 p-1 text-sm rounded-md transition-colors"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search input"
            >
              ✕
            </button>
          )}

          <button
            type="button"
            className="modal-close-btn p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors text-xl leading-none"
            onClick={onClose}
            aria-label="Close search dialog"
          >
            &times;
          </button>
        </div>

        {/* Modal Search Body */}
        <div className="modal-search-body p-4 sm:p-5 overflow-y-auto flex-1 scrollbar-thin">
          
          {/* Quick Filter Tags / Popular Searches */}
          <div className="search-quick-tags flex flex-wrap items-center gap-1.5 pb-4 mb-4 border-b border-slate-100 text-xs">
            <span className="search-tag-label font-semibold text-slate-400 mr-1">Popular:</span>
            {['SS 316L', 'EP Pipe', '90 Bend', 'Tri-Clamp', 'Butterfly Valve', 'Diaphragm Valve', 'Silicone Gasket', 'ASTM A270'].map((tag) => (
              <button
                key={tag}
                type="button"
                className="quick-filter-tag px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 transition-colors cursor-pointer border border-slate-200/60 font-medium"
                onClick={() => setSearchTerm(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results Summary & Action Bar (when query present) */}
          {query && matchedProducts.length > 0 && (
            <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">
                Found <strong className="text-slate-900">{matchedProducts.length}</strong> matching products
              </span>
              <button
                type="button"
                onClick={handleViewAllInCatalogue}
                className="text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1"
              >
                <span>View all in Catalogue</span>
                <span>&rarr;</span>
              </button>
            </div>
          )}

          {/* Results List */}
          <div id="search-results-list" className="search-results-list flex flex-col gap-2">
            
            {/* Empty State */}
            {query && matchedProducts.length === 0 && matchedCategories.length === 0 && (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-3xl mb-2">🔍</div>
                <h4 className="text-base font-bold text-slate-800 mb-1">
                  No matching products found for "{searchTerm}"
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Try checking for typos or searching by material (e.g. "316L"), component ("ferrule", "valve"), or standard ("ASTM A270").
                </p>
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="btn btn--outline-dark btn--sm text-xs"
                >
                  Clear search query
                </button>
              </div>
            )}

            {/* Matched Categories */}
            {matchedCategories.map((c) => (
              <a
                key={c.id || c.slug}
                href={`/category/${c.slug}`}
                onClick={onClose}
                className="search-result-item flex items-center gap-3.5 p-3 rounded-xl border border-slate-200/80 hover:border-sky-500 hover:bg-sky-50/40 transition-all text-left"
              >
                <span className="text-2xl p-1 bg-slate-100 rounded-lg shrink-0">{c.icon || '📦'}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{c.name}</h4>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 uppercase tracking-wide">
                      Category
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {c.desc || (c.subcategories && c.subcategories.join(', '))}
                  </p>
                </div>
                <span className="text-slate-400 text-sm font-bold">&rarr;</span>
              </a>
            ))}

            {/* Matched Products */}
            {matchedProducts.map((p) => {
              const imageSrc = p.image?.startsWith('assets/') ? `/${p.image}` : (p.image || '/assets/images/products/pipes/electro-polished/ss-316l-electropolished-sanitary-tube-001.jpg');
              const is316 = p.material?.includes('316');

              return (
                <a
                  key={p.id}
                  href={`/product/${p.slug || p.id}`}
                  onClick={onClose}
                  className="search-result-item flex items-center gap-3.5 p-3 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/30 transition-all text-left group"
                >
                  <img
                    src={imageSrc}
                    alt={p.name}
                    className="w-12 h-12 object-contain rounded-lg bg-slate-50 border border-slate-200/70 p-1 shrink-0 group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider truncate">
                        {p.category}
                      </span>
                      {p.has360 && p.video360 && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          360° Video
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-sky-600 transition-colors">
                      {p.name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                        {is316 ? 'SS 316L' : (p.material?.split(' ')[0] || 'SS 304')}
                      </span>
                      {p.finish && (
                        <span className="px-1.5 py-0.5 rounded bg-cyan-50 font-medium text-cyan-800">
                          {p.finish.includes('EP') ? 'EP Mirror' : p.finish.split(' ')[0]}
                        </span>
                      )}
                      {p.sizes && (
                        <span className="truncate max-w-[160px] text-slate-400">
                          • {p.sizes.split('(')[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-slate-400 group-hover:text-sky-600 text-sm font-bold shrink-0 transition-colors">
                    &rarr;
                  </span>
                </a>
              );
            })}

          </div>
        </div>

        {/* Footer CTA */}
        {query && matchedProducts.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">Enter</kbd> to view full catalogue results</span>
            <button
              type="button"
              onClick={handleViewAllInCatalogue}
              className="btn btn--primary btn--sm py-1.5 px-3 text-xs font-bold"
            >
              Browse {matchedProducts.length} Results
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchModal;
