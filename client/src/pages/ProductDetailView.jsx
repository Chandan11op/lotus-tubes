import React, { useState, useEffect, useCallback } from 'react';
import { PRODUCTS, CONFIG } from '../data/siteData';
import { getCategoryFallbackImage, UNIVERSAL_FALLBACK_IMAGE, INLINE_SVG_FAILSAFE } from '../utils/mediaFallback';
import { ProductVideoPlayer } from '../components/common/ProductVideoPlayer';
import { updatePageSEO } from '../utils/seo';

/**
 * ProductDetailView
 * Professional B2B product presentation inspired by high-conversion e-commerce layouts (e.g. Amazon)
 * adapted specifically for hygienic industrial sanitary piping, fittings, and valves.
 *
 * Features:
 * - Two-column desktop layout with left-hand vertical thumbnail gallery and large main viewing stage
 * - Smooth image transitions, distortion-free contain scaling, and responsive horizontal mobile strip
 * - Dedicated video thumbnail and responsive native video player integration
 * - Accessible Fullscreen Lightbox Modal with zoom and keyboard navigation
 * - Structured information hierarchy: Title, Badges, Short Overview, Quick Specs Grid, Key Benefits, CTAs
 * - In-depth tabbed specification sections: About & Construction, Technical Specs, Metallurgy, Compliance, Applications
 * - Complementary related products and direct quotation actions
 */
export const ProductDetailView = ({ slug, onOpenEnquiry }) => {
  const prod = PRODUCTS.find((p) => p.slug === slug || p.id === slug) || PRODUCTS[0];
  const related = PRODUCTS.filter((p) => p.categorySlug === prod.categorySlug && p.id !== prod.id).slice(0, 4);

  // Gallery State: active media index (0..n for images, or 'video')
  const [activeMedia, setActiveMedia] = useState(0);
  const [activeTab, setActiveTab] = useState('about');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imgFallbacks, setImgFallbacks] = useState({});

  // Reset gallery on product change
  useEffect(() => {
    setActiveMedia(0);
    setImgFallbacks({});

    // Update dynamic technical SEO & Structured Data
    updatePageSEO({
      title: prod.seo?.title || `${prod.name} | Lotus Tubes`,
      description: prod.seo?.metaDescription || prod.overview,
      path: `/product/${prod.slug || prod.id}`,
      image: prod.image,
      productData: prod,
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: prod.category, path: `/category/${prod.categorySlug}` },
        { name: prod.name, path: `/product/${prod.slug || prod.id}` }
      ]
    });
  }, [slug, prod?.id]);

  const productImages = prod.images && prod.images.length > 0
    ? prod.images
    : [prod.image || getCategoryFallbackImage(prod.categorySlug, prod.name)];

  const hasVideo = Boolean(prod.video);

  const handleImageError = (key) => {
    setImgFallbacks((prev) => {
      const currentLevel = prev[key] || 0;
      return { ...prev, [key]: currentLevel + 1 };
    });
  };

  const resolveImage = (imgSrc, key) => {
    const level = imgFallbacks[key] || 0;
    if (level === 0) return imgSrc || getCategoryFallbackImage(prod.categorySlug, prod.name);
    if (level === 1) return getCategoryFallbackImage(prod.categorySlug, prod.name);
    if (level === 2) return UNIVERSAL_FALLBACK_IMAGE;
    return INLINE_SVG_FAILSAFE;
  };

  const currentImageSrc = typeof activeMedia === 'number'
    ? resolveImage(productImages[activeMedia] || productImages[0], `main-${activeMedia}`)
    : resolveImage(productImages[0], 'main-default');

  // Lightbox keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight' && typeof activeMedia === 'number') {
        setActiveMedia((prev) => (prev + 1) % productImages.length);
      } else if (e.key === 'ArrowLeft' && typeof activeMedia === 'number') {
        setActiveMedia((prev) => (prev - 1 + productImages.length) % productImages.length);
      }
    },
    [isLightboxOpen, activeMedia, productImages.length]
  );

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, handleKeyDown]);

  const is316 = prod.material?.includes('316');

  return (
    <div className="product-detail-view-container site-container py-8 sm:py-12">
      {/* Upper Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: AMAZON-INSPIRED PRODUCT GALLERY & LIGHTBOX                  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 flex flex-col-reverse lg:flex-row gap-4 items-start w-full">
          
          {/* Vertical Thumbnail Strip (Horizontal on Mobile) */}
          <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-[540px] w-full lg:w-20 shrink-0 scrollbar-none pb-2 lg:pb-0">
            {/* 1. Image Thumbnails */}
            {productImages.map((imgSrc, idx) => {
              const isSelected = activeMedia === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMedia(idx)}
                  className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden bg-white p-1 border-2 transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'border-sky-600 shadow-md ring-2 ring-sky-100 scale-102'
                      : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                  }`}
                  aria-label={`View product image ${idx + 1}`}
                  aria-selected={isSelected}
                >
                  <img
                    src={resolveImage(imgSrc, `thumb-${idx}`)}
                    alt={`${prod.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain"
                    onError={() => handleImageError(`thumb-${idx}`)}
                  />
                </button>
              );
            })}

            {/* 2. Video Thumbnail (if product has video) */}
            {hasVideo && (
              <button
                type="button"
                onClick={() => setActiveMedia('video')}
                className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden bg-slate-900 border-2 transition-all shrink-0 cursor-pointer flex flex-col items-center justify-center text-white ${
                  activeMedia === 'video'
                    ? 'border-sky-600 shadow-md ring-2 ring-sky-100 scale-102'
                    : 'border-slate-700 hover:border-slate-500 opacity-85 hover:opacity-100'
                }`}
                aria-label="View product demonstration video"
                aria-selected={activeMedia === 'video'}
              >
                <div className="w-7 h-7 rounded-full bg-sky-500/90 flex items-center justify-center text-white shadow-sm mb-0.5">
                  <span className="text-xs ml-0.5">▶</span>
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-sky-200">Video</span>
              </button>
            )}
          </div>

          {/* Main Display Stage */}
          <div className="relative flex-1 w-full bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] p-6 group">
            {activeMedia === 'video' && hasVideo ? (
              <div className="w-full h-full flex items-center justify-center">
                <ProductVideoPlayer
                  src={prod.video}
                  poster={productImages[0]}
                  title={`${prod.name} - Technical Overview`}
                />
              </div>
            ) : (
              <div
                className="relative w-full h-full flex items-center justify-center cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
                title="Click to expand high-resolution image"
              >
                <img
                  src={currentImageSrc}
                  alt={prod.name}
                  className="max-h-[420px] max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={() => handleImageError(`main-${activeMedia}`)}
                />

                {/* Floating Fullscreen Lightbox Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-700 hover:text-sky-600 p-2.5 rounded-xl border border-slate-200 shadow-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  aria-label="Open Fullscreen Image View"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span>Fullscreen Zoom</span>
                </button>

                {/* Image Counter Badge */}
                <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[11px] font-mono px-2.5 py-1 rounded-md backdrop-blur-sm pointer-events-none">
                  {typeof activeMedia === 'number' ? `Photo ${activeMedia + 1} of ${productImages.length}` : 'Technical Video'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: INDUSTRIAL PRODUCT HIERARCHY & SPECIFICATIONS              */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          {/* Category Eyebrow & Sourcing Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <a
              href={`#category/${prod.categorySlug}`}
              className="text-xs font-bold text-sky-600 uppercase tracking-wider hover:underline"
            >
              {prod.category}
            </a>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {prod.availability || 'Ready Stock in Mumbai'}
            </span>
          </div>

          {/* Product Headline */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug mb-3">
            {prod.name}
          </h1>

          {/* Trust & Specification Badges Strip */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${is316 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-800'}`}>
              Grade: {prod.material}
            </span>
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-pink-100 text-pink-700 border border-pink-200">
              {prod.finish}
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {prod.standard}
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-sky-50 text-sky-700 border border-sky-200">
              EN 10204 3.1 Traceable
            </span>
          </div>

          {/* Product Concise Overview */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
            {prod.overview}
          </p>

          {/* Quick Technical Overview Table (Amazon B2B Style) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Technical Parameters &amp; Sourcing Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Material Alloy:</span>
                <span className="text-slate-900 font-bold">{prod.material}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Surface Roughness:</span>
                <span className="text-slate-900 font-semibold">{prod.roughness || 'Ra ≤ 0.4 µm'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Manufacturing:</span>
                <span className="text-slate-900 font-semibold">{prod.manufacturingType || 'Seamless / Welded'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Size Range:</span>
                <span className="text-slate-900 font-semibold">{prod.sizes || '1/2" to 4"'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Wall Thickness:</span>
                <span className="text-slate-900 font-semibold">{prod.wallThickness || '1.2mm - 2.0mm'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Standard / Code:</span>
                <span className="text-slate-900 font-semibold">{prod.standard}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">End Connection:</span>
                <span className="text-slate-900 font-semibold">{prod.connection || 'Butt Weld / Plain End'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Test Certificate:</span>
                <span className="text-slate-900 font-semibold">{prod.mtc || 'EN 10204 3.1 MTC'}</span>
              </div>
            </div>
          </div>

          {/* Key Hygienic Engineering Benefits */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Key Process Engineering Advantages:
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Hygienic Internal Bore:</strong> Smooth, crevice-free internal finish preventing product build-up and biofilm growth.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>100% Heat Traceable:</strong> Positive Material Identification (PMI) confirmed with complete mill metallurgy certificates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>CIP/SIP Compatibility:</strong> Resistant to intensive caustic cleaning washdowns, acid circulation, and high-pressure steam.</span>
              </li>
            </ul>
          </div>

          {/* Primary Action Button Cluster */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => onOpenEnquiry && onOpenEnquiry(prod, prod.name)}
              className="btn btn--primary flex-1 py-3.5 px-6 text-sm font-bold shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
            >
              <span>Request Official Quotation</span>
              <span>&rarr;</span>
            </button>

            <a
              href={`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(
                `Hello Lotus Tubes, I would like to enquire about ${prod.name} (Material: ${prod.material}, Standard: ${prod.standard}). Please share pricing and stock availability.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 transition-colors"
            >
              <span>🟢</span>
              <span>Enquire on WhatsApp</span>
            </a>

            <a
              href="#quote"
              className="btn btn--outline py-3.5 px-5 text-sm font-semibold border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Attach BOQ
            </a>
          </div>

          <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500">
            <span>⚡ Typical Quote Turnaround: &lt; 2 Hours</span>
            <span>•</span>
            <span>📍 Mumbai Central Warehouse Dispatch</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* LOWER SECTION: COMPREHENSIVE TABBED INDUSTRIAL SPECIFICATIONS             */}
      {/* ========================================================================= */}
      <div className="mt-14 border-t border-slate-200 pt-10">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-200 scrollbar-none mb-8">
          {[
            { id: 'about', label: 'About & Construction' },
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'metallurgy', label: 'Material & Surface Finish' },
            { id: 'standards', label: 'Standards & Compliance' },
            { id: 'applications', label: 'Applications & Skids' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Tab 1: About & Construction */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Hygienic Engineering Overview</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {prod.overview}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Manufacturing Precision</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Fabricated to stringent dimensional tolerances adhering to ASTM A270, ASME BPE, and 3-A Sanitary Standards. Internal bores are mechanically honed and electro-chemically passivated to ensure an inert, chromium-rich oxide barrier.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Clean-in-Place Cleanability</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Designed without dead legs, deep crevices, or irregular weld margins to facilitate rapid, turbulent CIP fluid contact and complete drainage during Steam-In-Place (SIP) sterilization cycles.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Technical Specifications */}
          {activeTab === 'specs' && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Complete Parameter Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="py-2.5 px-4 font-bold border-b border-slate-200">Specification Parameter</th>
                      <th className="py-2.5 px-4 font-bold border-b border-slate-200">Verified Technical Value</th>
                      <th className="py-2.5 px-4 font-bold border-b border-slate-200">Standard Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-slate-600">Material Grade</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{prod.material}</td>
                      <td className="py-2.5 px-4 text-slate-500">AISI / ASTM</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-slate-600">Surface Finish Quality</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{prod.finish} ({prod.roughness || 'Ra ≤ 0.4 µm'})</td>
                      <td className="py-2.5 px-4 text-slate-500">ASME BPE SF1 / SF4</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-slate-600">Size / Outside Diameter</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{prod.sizes || '1/2" to 4" OD'}</td>
                      <td className="py-2.5 px-4 text-slate-500">ASTM A270 / BS 4825</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-slate-600">Wall Thickness / Gauge</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{prod.wallThickness || '1.2mm - 2.0mm (16G - 14G)'}</td>
                      <td className="py-2.5 px-4 text-slate-500">Standard Sanitary</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-slate-600">Standard Length</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{prod.length || '6.0 Meters (Custom cutting available)'}</td>
                      <td className="py-2.5 px-4 text-slate-500">Factory Standard</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-slate-600">Traceability &amp; Certification</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{prod.mtc || 'EN 10204 3.1 Mill Test Certificate'}</td>
                      <td className="py-2.5 px-4 text-slate-500">EN 10204</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-slate-600">Inspection &amp; Testing</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">Hydrostatic test, Boroscopy, PMI spectro analysis</td>
                      <td className="py-2.5 px-4 text-slate-500">100% Verified</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Material & Surface Finish */}
          {activeTab === 'metallurgy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Alloy Chemistry &amp; Surface Metallurgy</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Sanitary process applications mandate high-purity austenitic stainless steel alloys capable of withstanding corrosive organic acids and aggressive sterilizing agents.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">SS 316L (UNS S31603)</h4>
                  <p className="text-xs text-slate-600 mb-3">
                    Low-carbon austenitic alloy with 2.0–3.0% Molybdenum. Engineered specifically for sterile pharma WFI loops, bio-reactors, and chloride-exposed environments.
                  </p>
                  <ul className="text-xs space-y-1 text-slate-700">
                    <li>• Chromium: 16.0 - 18.0%</li>
                    <li>• Nickel: 10.0 - 14.0%</li>
                    <li>• Molybdenum: 2.0 - 3.0%</li>
                    <li>• Carbon: ≤ 0.03% (Resists intergranular carbide precipitation)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">SS 304 (UNS S30400)</h4>
                  <p className="text-xs text-slate-600 mb-3">
                    High-strength 18/8 austenitic stainless steel delivering outstanding hygienic cleanability for dairy, brewery, and food-grade fluid lines.
                  </p>
                  <ul className="text-xs space-y-1 text-slate-700">
                    <li>• Chromium: 18.0 - 20.0%</li>
                    <li>• Nickel: 8.0 - 10.5%</li>
                    <li>• Molybdenum: Trace</li>
                    <li>• Carbon: ≤ 0.08%</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Standards & Compliance */}
          {activeTab === 'standards' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Recognized Sanitary Compliance Standards</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Lotus Tubes supplies sanitary stainless steel components verified against premier global process standards:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                  <strong>ASTM A270:</strong> Specification for Seamless and Welded Austenitic and Ferritic/Austenitic Stainless Steel Sanitary Tubing.
                </div>
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                  <strong>ASME BPE:</strong> Bio-Processing Equipment standard for high-purity pharmaceutical water, clean steam, and biopharma vessels.
                </div>
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                  <strong>3-A Sanitary Standards:</strong> Hygienic design criteria for milk, dairy products, and food processing lines.
                </div>
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                  <strong>EN 10204 3.1:</strong> Inspection certificate documenting chemical composition, mechanical tests, and heat traceability.
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Applications & Industries */}
          {activeTab === 'applications' && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Process Applications</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                This component is widely deployed across critical fluid transport applications:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(prod.applications || [
                  'Water For Injection (WFI) loops',
                  'Clean-In-Place (CIP) circulation manifolds',
                  'Sterile pharmaceutical bulk manufacturing',
                  'Dairy milk reception and pasteurization',
                  'Brewery cellar transfer piping',
                  'Biotech fermentation process skids'
                ]).map((app, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800">
                    <span className="text-sky-600 font-bold">✓</span>
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RELATED COMPLEMENTARY PRODUCTS                                           */}
      {/* ========================================================================= */}
      {related.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">Complementary Equipment</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                Related Products in {prod.category}
              </h3>
            </div>
            <a href="#products" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
              <span>View Full Catalogue</span>
              <span>&rarr;</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((rel) => (
              <a
                key={rel.id}
                href={`#product/${rel.slug || rel.id}`}
                className="group flex flex-col p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-500 hover:shadow-lg transition-all"
              >
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-50 mb-3 flex items-center justify-center p-3">
                  <img
                    src={rel.image || productImages[0]}
                    alt={rel.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-sky-600 transition-colors">
                  {rel.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Grade: {rel.material} &bull; {rel.finish}
                </div>
                <div className="mt-auto pt-3 text-xs font-semibold text-sky-600 flex items-center gap-1">
                  <span>View Details</span>
                  <span>&rarr;</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN LIGHTBOX MODAL                                                */}
      {/* ========================================================================= */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="High Resolution Lightbox View"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-sky-400 p-2 text-2xl font-bold z-50 transition-colors"
            aria-label="Close fullscreen view"
          >
            ✕
          </button>

          {/* Navigation Controls */}
          {productImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMedia((prev) =>
                    typeof prev === 'number'
                      ? (prev - 1 + productImages.length) % productImages.length
                      : 0
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 text-white hover:bg-sky-600 text-xl z-50 transition-colors"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMedia((prev) =>
                    typeof prev === 'number'
                      ? (prev + 1) % productImages.length
                      : 0
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 text-white hover:bg-sky-600 text-xl z-50 transition-colors"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          {/* Lightbox Image Stage */}
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImageSrc}
              alt={`${prod.name} high resolution preview`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-4 text-center text-white text-xs sm:text-sm">
              <span className="font-bold">{prod.name}</span>
              <span className="text-slate-400 ml-2">
                ({typeof activeMedia === 'number' ? `${activeMedia + 1} of ${productImages.length}` : 'Video'})
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailView;
