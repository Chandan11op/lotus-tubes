import React, { useState, useEffect, useMemo } from 'react';
import {
  fetchGoogleFontsCatalog,
  applyTypography,
  saveAndApplyTypography,
  resetTypography,
  STORAGE_KEY_FONT,
  STORAGE_KEY_CATEGORY
} from '../../utils/typography';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'sans-serif', label: 'Sans Serif' },
  { id: 'serif', label: 'Serif' },
  { id: 'display', label: 'Display' },
  { id: 'handwriting', label: 'Handwriting' },
  { id: 'monospace', label: 'Monospace' }
];

export const TypographyCustomizer = ({ isOpen, onClose }) => {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity' | 'az'
  const [activeFont, setActiveFont] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_FONT) || 'Default (Plus Jakarta Sans & Inter)';
    }
    return 'Default';
  });
  const [appliedNotification, setAppliedNotification] = useState('');

  // Fetch fonts catalog on mount
  useEffect(() => {
    let isMounted = true;
    fetchGoogleFontsCatalog().then((catalog) => {
      if (isMounted) {
        setFonts(catalog);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync activeFont state from localStorage when modal opens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_FONT);
      setActiveFont(saved || 'Default (Plus Jakarta Sans & Inter)');
    }
  }, [isOpen]);

  // Filter and sort fonts
  const filteredFonts = useMemo(() => {
    let result = fonts;

    if (selectedCategory !== 'all') {
      result = result.filter((f) => f.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((f) => f.family.toLowerCase().includes(q));
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'az') {
        return a.family.localeCompare(b.family);
      }
      return (a.popularity || 999) - (b.popularity || 999);
    });
  }, [fonts, selectedCategory, searchQuery, sortBy]);

  const handlePreview = (font) => {
    applyTypography(font.family, font.category);
    setActiveFont(`${font.family} (Preview)`);
    setAppliedNotification(`Previewing "${font.family}" across website`);
    setTimeout(() => setAppliedNotification(''), 3000);
  };

  const handleApply = (font) => {
    saveAndApplyTypography(font.family, font.category);
    setActiveFont(font.family);
    setAppliedNotification(`Applied "${font.family}" as global typography!`);
    setTimeout(() => setAppliedNotification(''), 4000);
  };

  const handleReset = () => {
    resetTypography();
    setActiveFont('Default (Plus Jakarta Sans & Inter)');
    setAppliedNotification('Reset typography to Lotus Tubes default.');
    setTimeout(() => setAppliedNotification(''), 3000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="typography-customizer-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800">
        {/* Sticky Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#0284C7]/10 text-[#0284C7]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </span>
              <h2 id="typography-customizer-title" className="text-xl font-bold text-slate-900">
                Website Typography Customizer
              </h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-[#0284C7] border border-blue-200">
                Design Evaluation
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Preview different Google Fonts across the Lotus Tubes website and select the typography that best represents the brand.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close typography customizer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current Active Status & Notification Bar */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Active Website Font:</span>
            <span className="px-2.5 py-1 rounded bg-white border border-slate-300 font-bold text-[#0284C7] shadow-sm">
              {activeFont}
            </span>
          </div>
          {appliedNotification && (
            <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 animate-fadeIn">
              ✓ {appliedNotification}
            </div>
          )}
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-white flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="sm:col-span-8 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Google Font family name (e.g. Inter, Roboto, Poppins, Montserrat)..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-4 flex items-center gap-2">
              <label htmlFor="sort-fonts" className="text-xs font-semibold text-slate-600 shrink-0">
                Sort:
              </label>
              <select
                id="sort-fonts"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
              >
                <option value="popularity">Most Popular (Default)</option>
                <option value="az">Alphabetical (A to Z)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0284C7] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
            <span className="text-xs text-slate-400 ml-auto self-center">
              Showing {filteredFonts.length} {filteredFonts.length === 1 ? 'font' : 'fonts'}
            </span>
          </div>
        </div>

        {/* Scrollable Font Catalog List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              Loading Google Fonts catalog...
            </div>
          ) : filteredFonts.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm font-semibold">No fonts match &quot;{searchQuery}&quot;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching another family name or select &quot;All Categories&quot;.</p>
            </div>
          ) : (
            filteredFonts.map((font) => {
              const isCurrent =
                activeFont === font.family || activeFont.startsWith(`${font.family} (`);

              return (
                <div
                  key={font.family}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-50/60 border-[#0284C7] shadow-sm ring-1 ring-[#0284C7]/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-slate-900">{font.family}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                          {font.category}
                        </span>
                        {font.popularity <= 10 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            ★ Top 10
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0284C7] text-white">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Font Specimen Preview */}
                      <p
                        className="mt-2 text-sm text-slate-700 tracking-wide line-clamp-1"
                        style={{ fontFamily: `'${font.family}', ${font.category}` }}
                      >
                        Lotus Tubes — Sanitary Stainless Steel Pipes, Tri-Clamp Fittings &amp; Valves
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handlePreview(font)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        title={`Preview ${font.family} on live page`}
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApply(font)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-[#0284C7] text-white hover:bg-[#0284C7]/90'
                        }`}
                        title={`Save and apply ${font.family} across site`}
                      >
                        {isCurrent ? 'Applied ✓' : 'Apply Font'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
              title="Reset website typography back to Plus Jakarta Sans & Inter"
            >
              Reset to Default Font
            </button>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Default: Plus Jakarta Sans / Inter
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 text-center sm:text-right">
              Evaluation choices persist in browser storage.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypographyCustomizer;
