import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '../../data/siteData';
import { filterAndSearchProducts } from '../../utils/productSearch';

/**
 * LOTUS TUBES - Global Navigation Product Search Modal
 * Obsidian Precision Engineering Theme
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

  const matchedProducts = useMemo(() => {
    if (!query) return [];
    return filterAndSearchProducts(PRODUCTS, { searchTerm: query });
  }, [query]);

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
      className="fixed inset-0 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-surface-container-lowest/80 backdrop-blur-md transition-all z-[10050]"
      id="search-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Product Catalogue Search"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-surface-container-low rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col max-h-[85vh] font-body-md text-on-surface">
        {/* Header Search Input */}
        <div className="p-4 sm:p-5 border-b border-surface-container-high flex items-center gap-3 bg-surface-container-lowest">
          <span className="text-primary-container text-lg">🔍</span>

          <input
            ref={inputRef}
            type="search"
            id="site-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search sanitary pipes, SS 316L, 90 bends, ferrules, valves..."
            autoComplete="off"
            className="flex-1 bg-transparent border-0 text-on-surface text-base sm:text-lg font-medium placeholder:text-on-surface-variant focus:outline-none min-w-0"
            aria-label="Search sanitary products catalogue"
          />

          {searchTerm && (
            <button
              type="button"
              className="text-on-surface-variant hover:text-on-surface p-1 text-sm rounded-md transition-colors cursor-pointer"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search input"
            >
              ✕
            </button>
          )}

          <button
            type="button"
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-xl leading-none cursor-pointer"
            onClick={onClose}
            aria-label="Close search dialog"
          >
            &times;
          </button>
        </div>

        {/* Modal Search Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* Quick Filter Tags / Popular Searches */}
          <div className="flex flex-wrap items-center gap-1.5 pb-4 border-b border-surface-container-high text-xs">
            <span className="font-label-code-micro uppercase tracking-wider text-on-surface-variant mr-1">Popular:</span>
            {['SS 316L', 'EP Pipe', '90 Bend', 'Tri-Clamp', 'Butterfly Valve', 'Diaphragm Valve', 'Silicone Gasket', 'ASTM A270'].map((tag) => (
              <button
                key={tag}
                type="button"
                className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high hover:text-primary text-on-surface-variant transition-colors cursor-pointer border border-surface-container-high text-xs font-medium"
                onClick={() => setSearchTerm(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results Summary */}
          {query && matchedProducts.length > 0 && (
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-surface-container-high text-xs">
              <span className="text-on-surface-variant">
                Found <strong className="text-primary">{matchedProducts.length}</strong> matching products
              </span>
              <button
                type="button"
                onClick={handleViewAllInCatalogue}
                className="text-primary-container hover:text-primary font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>View all in Catalogue</span>
                <span>→</span>
              </button>
            </div>
          )}

          {/* Results List */}
          <div className="flex flex-col gap-2">
            {/* Empty State */}
            {query && matchedProducts.length === 0 && matchedCategories.length === 0 && (
              <div className="p-8 text-center bg-surface-container rounded-xl border border-surface-container-high">
                <div className="text-3xl mb-2">🔍</div>
                <h4 className="text-base font-bold text-on-surface mb-1">
                  No matching products found for "{searchTerm}"
                </h4>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-4">
                  Try checking for typos or searching by material (e.g. "316L"), component ("ferrule", "valve"), or standard ("ASTM A270").
                </p>
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs text-on-surface cursor-pointer"
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
                className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-container border border-surface-container-high hover:border-primary-container/40 hover:bg-surface-container-high transition-all text-left"
              >
                <span className="text-2xl p-1 bg-surface-container-low rounded-lg shrink-0">{c.icon || '📦'}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-on-surface truncate">{c.name}</h4>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-container text-on-primary-container uppercase tracking-wide">
                      Category
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate mt-0.5">
                    {c.desc || (c.subcategories && c.subcategories.join(', '))}
                  </p>
                </div>
                <span className="text-on-surface-variant text-sm font-bold">→</span>
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
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-container border border-surface-container-high hover:border-primary-container/40 hover:bg-surface-container-high transition-all text-left group"
                >
                  <img
                    src={imageSrc}
                    alt={p.name}
                    className="w-12 h-12 object-contain rounded-lg bg-surface-container-lowest border border-surface-container-high p-1 shrink-0 group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider truncate font-label-code-micro">
                        {p.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                      {p.name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] font-label-code-micro">
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-bold">
                        {is316 ? 'SS 316L' : (p.material?.split(' ')[0] || 'SS 304')}
                      </span>
                      {p.finish && (
                        <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-secondary font-bold">
                          {p.finish.includes('EP') ? 'EP Mirror' : p.finish.split(' ')[0]}
                        </span>
                      )}
                      {p.sizes && (
                        <span className="truncate max-w-[160px] text-on-surface-variant">
                          • {p.sizes.split('(')[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-on-surface-variant group-hover:text-primary text-sm font-bold shrink-0 transition-colors">
                    →
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        {query && matchedProducts.length > 0 && (
          <div className="p-3 bg-surface-container-lowest border-t border-surface-container-high flex items-center justify-between text-xs font-label-code-micro text-on-surface-variant">
            <span>Press <kbd className="px-1.5 py-0.5 bg-surface-container border border-surface-container-high rounded text-on-surface text-[10px]">Enter</kbd> for full catalogue view</span>
            <button
              type="button"
              onClick={handleViewAllInCatalogue}
              className="px-3.5 py-1.5 bg-primary-container text-on-primary-container rounded-lg font-bold hover:bg-primary-fixed cursor-pointer transition-colors"
            >
              Browse {matchedProducts.length} Results →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;