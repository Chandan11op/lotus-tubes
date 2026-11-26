import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PRODUCTS, CONFIG } from '../data/siteData';
import { useLanguage } from '../context/LanguageContext';
import { getCategoryFallbackImage, UNIVERSAL_FALLBACK_IMAGE, INLINE_SVG_FAILSAFE } from '../utils/mediaFallback';
import { getTransparentProductImage } from '../utils/removeBackground';
import { updatePageSEO } from '../utils/seo';

/**
 * ProductDetailView
 * Strict Figma Design-System Aligned Industrial B2B Product Detail View
 *
 * Media Requirement (Section 5):
 * STRICTLY STATIC PRODUCT PHOTOGRAPHS ONLY.
 * No 3D models, no 360-degree rotation, no simulated rotation, no video players.
 *
 * Features:
 * - Two-column responsive layout with left-hand vertical thumbnail gallery and large main viewing stage
 * - Click-to-change static main image with smooth transitions and distortion-free contain scaling
 * - Fullscreen Lightbox Modal with zoom and previous/next keyboard navigation
 * - Structured information hierarchy: Title, Badges, Overview, Technical Parameters Table, Advantages, CTAs
 * - In-depth tabbed specification sections: About & Construction, Technical Specs, Metallurgy, Compliance, Applications
 * - Direct quotation actions & WhatsApp sales desk integration
 */
export const ProductDetailView = ({ slug, onOpenEnquiry }) => {
  const { t, currentLang, localizePath } = useLanguage();
  const prod = PRODUCTS.find((p) => p.slug === slug || p.id === slug) ||
               PRODUCTS.find((p) => (slug && p.slug.includes(slug)) || (slug && slug.includes(p.slug))) ||
               PRODUCTS[0];
  const related = PRODUCTS.filter((p) => p.categorySlug === prod.categorySlug && p.id !== prod.id).slice(0, 4);

  // Gallery State: active static photograph index (0..n)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('about');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imgFallbacks, setImgFallbacks] = useState({});

  // Reset gallery on product change
  useEffect(() => {
    setActivePhotoIndex(0);
    setImgFallbacks({});

    // Update dynamic technical SEO & Structured Data
    updatePageSEO({
      title: prod.seo?.title || `${prod.name} | Lotus Tubes`,
      description: prod.seo?.metaDescription || prod.overview,
      path: `/product/${prod.slug || prod.id}`,
      lang: currentLang,
      image: prod.image,
      productData: prod,
      breadcrumbs: [
        { name: t('nav_home', 'Home'), path: '/' },
        { name: t('nav_products', 'Products'), path: '/products' },
        { name: prod.category, path: `/category/${prod.categorySlug}` },
        { name: prod.name, path: `/product/${prod.slug || prod.id}` }
      ]
    });
  }, [slug, prod?.id, currentLang]);

  const productImages = prod.images && prod.images.length > 0
    ? prod.images
    : [prod.image || getCategoryFallbackImage(prod.categorySlug, prod.name)];

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

  const currentImageSrc = resolveImage(
    productImages[activePhotoIndex] || productImages[0],
    `main-${activePhotoIndex}`
  );

  // Background-removed studio photograph state
  const [transparentImageSrc, setTransparentImageSrc] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (currentImageSrc) {
      getTransparentProductImage(currentImageSrc).then((transSrc) => {
        if (isMounted) setTransparentImageSrc(transSrc);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [currentImageSrc]);

  // Zero-Latency Amazon-Style Interactive Product Hover Lens Zoom (Direct Ref DOM updates, 0 React re-renders)
  const stageRef = useRef(null);
  const lensRef = useRef(null);
  const zoomWindowRef = useRef(null);

  const handleStageMouseMove = (e) => {
    if (!stageRef.current || !lensRef.current || !zoomWindowRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const lensW = 140;
    const lensH = 140;

    // Cursor position within the product stage
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Center lens on cursor
    let lensX = mouseX - lensW / 2;
    let lensY = mouseY - lensH / 2;

    const maxLensX = rect.width - lensW;
    const maxLensY = rect.height - lensH;

    if (lensX < 0) lensX = 0;
    if (lensY < 0) lensY = 0;
    if (lensX > maxLensX) lensX = maxLensX;
    if (lensY > maxLensY) lensY = maxLensY;

    const xPercent = maxLensX > 0 ? (lensX / maxLensX) * 100 : 50;
    const yPercent = maxLensY > 0 ? (lensY / maxLensY) * 100 : 50;

    // Direct hardware-accelerated transform without React component re-rendering
    lensRef.current.style.transform = `translate3d(${lensX}px, ${lensY}px, 0)`;
    zoomWindowRef.current.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
  };

  const handleStageMouseEnter = () => {
    if (lensRef.current) lensRef.current.style.display = 'block';
    if (zoomWindowRef.current) zoomWindowRef.current.style.display = 'block';
  };

  const handleStageMouseLeave = () => {
    if (lensRef.current) lensRef.current.style.display = 'none';
    if (zoomWindowRef.current) zoomWindowRef.current.style.display = 'none';
  };

  // Industries Where This Product Is Highly Used Data
  const industriesList = [
    {
      id: 'pharmaceutical',
      name: 'Pharmaceutical & Biotechnology',
      shortName: 'Pharma & Biotech',
      icon: '💊',
      badge: 'High-Purity Sterile',
      image: '/assets/images/industries/pharmaceutical.jpg',
      usage: 'Sterile WFI loops, injectable fill-finish lines, bioreactor manifolds, chromatography skids.',
      specs: 'ASME BPE SF4 • Ra ≤ 0.38 µm EP • SS 316L • 100% Boroscopic Weld Traceability'
    },
    {
      id: 'dairy',
      name: 'Dairy & Milk Processing',
      shortName: 'Dairy Processing',
      icon: '🥛',
      badge: 'Aseptic & CIP/SIP',
      image: '/assets/images/industries/dairy.jpg',
      usage: 'Raw milk reception manifolds, HTST pasteurization skids, sterile curd/yogurt tanks, and automatic CIP/SIP cleanability.',
      specs: '3-A Sanitary Standards • FDA CFR 177.2600 EPDM/Silicone • SMS 1145 Unions'
    },
    {
      id: 'food-beverage',
      name: 'Food & Beverage Bottling',
      shortName: 'Food & Beverage',
      icon: '🥤',
      badge: 'Food Grade Contact',
      image: '/assets/images/industries/food-beverage.jpg',
      usage: 'Carbonated beverage blending pipelines, hot-fill juice preparation, aseptic syrup dosing, and sterile process lines.',
      specs: 'DIN 11850 Series • EHEDG Hygienic Geometry • Mirror Satin Polish'
    },
    {
      id: 'breweries',
      name: 'Breweries & Distilleries',
      shortName: 'Breweries & Distilleries',
      icon: '🍺',
      badge: 'Sanitary Fermentation',
      image: '/assets/images/industries/breweries.jpg',
      usage: 'Brewhouse hot wort transfer, fermentation and conditioning cellars, yeast propagation loops, and bright beer filtration.',
      specs: 'Non-Retention TC Clamping • Sight Glass Monitoring • Pressure Relief & Tank Bottom Flush'
    },
    {
      id: 'chemical',
      name: 'High-Purity Chemical & Specialty Fluids',
      shortName: 'Specialty Chemical',
      icon: '🧪',
      badge: 'Corrosion Resistant',
      image: '/assets/images/industries/chemical.jpg',
      usage: 'Aggressive organic chemical batching, acid/alkali transfer, high-purity solvent distribution, and cleanroom reagent piping.',
      specs: 'SS 316L (UNS S31603) • Cavity-Filled PTFE Sealing • EN 10204 3.1 Traceable Metallurgy'
    },
    {
      id: 'data-cooling',
      name: 'Data Centre Liquid Cooling',
      shortName: 'Data Centre Cooling',
      icon: '❄️',
      badge: 'Mission Critical',
      image: '/assets/images/industries/biotechnology.jpg',
      usage: 'Direct-to-chip server liquid cooling headers, high-density AI immersion cooling loops, and high-flow manifold distribution lines.',
      specs: '100% Leak-Free TC Pipe Clamps • Low Pressure Drop • Non-Magnetic SS 304/316L'
    },
    {
      id: 'water-treatment',
      name: 'Water Treatment & Purified Water (PW/WFI)',
      shortName: 'Water Treatment & WFI',
      icon: '💧',
      badge: 'Zero Dead-Leg',
      image: '/assets/images/industries/water-treatment.jpg',
      usage: 'Multi-effect distillation stills, pure steam generation loops, reverse osmosis (RO) systems, and electro-deionization (EDI) skids.',
      specs: 'Zero Dead-Leg Full Drainability • Orbitally Welded SS 316L • ASTM A270 SF1/SF4'
    },
    {
      id: 'cosmetics',
      name: 'Cosmetics & Personal Care Processing',
      shortName: 'Cosmetics & Personal Care',
      icon: '🧴',
      badge: 'Viscous Fluid Transfer',
      image: '/assets/images/industries/food-processing.jpg',
      usage: 'Viscous lotion & cream compounding tanks, perfume and alcohol blending lines, and sterile packaging delivery skids.',
      specs: 'High-Viscosity Flow Clearance • Smooth Ra ≤ 0.4 µm • Quick-Disassembly Tri-Clamps'
    }
  ];

  // Lightbox keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev + 1) % productImages.length);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
      }
    },
    [isLightboxOpen, productImages.length]
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
  const waNumber = (CONFIG.whatsapp || '919867304316').replace(/\D/g, '');
  const waMessage = `Hello Lotus Tubes, I would like to enquire about ${prod.name} (Material: ${prod.material || 'SS 316L'}, Standard: ${prod.standard || 'Sanitary Standard'}). Please share pricing and availability.`;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="product-detail-view-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Upper Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: STATIC PRODUCT PHOTOGRAPHY GALLERY & AMAZON HOVER ZOOM       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 flex flex-col-reverse lg:flex-row gap-4 items-start w-full relative">
          
          {/* Static Thumbnail Selector (Vertical on Desktop, Horizontal on Mobile) */}
          {productImages.length > 1 && (
            <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-[520px] w-full lg:w-20 shrink-0 scrollbar-none pb-2 lg:pb-0">
              {productImages.map((imgSrc, idx) => {
                const isSelected = activePhotoIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden bg-white p-1 border-2 transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'border-[#E93984] shadow-md ring-2 ring-pink-100 scale-102'
                        : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                    }`}
                    aria-label={`View product photo ${idx + 1}`}
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
            </div>
          )}

          {/* Main Stage & Industries Column Wrapper */}
          <div className="flex-1 flex flex-col w-full min-w-0">
            {/* Main Static Photograph Stage with Zero-Latency Amazon-Style Lens Zoom & Cutout Product */}
            <div
              ref={stageRef}
              onMouseEnter={handleStageMouseEnter}
              onMouseLeave={handleStageMouseLeave}
              onMouseMove={handleStageMouseMove}
              className="relative w-full aspect-[4/3] border border-slate-200/90 rounded-3xl overflow-hidden shadow-lg group bg-cover bg-center cursor-crosshair select-none"
              style={{
                backgroundImage: 'url(/product-image-cover.png)',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Strictly Safe Product Stage: Perfectly Confined Between Header Logo and Footer Details */}
              <div
                className="absolute inset-x-[8%] top-[23%] bottom-[19%] flex items-center justify-center pointer-events-auto"
                onClick={() => setIsLightboxOpen(true)}
                title="Click to expand high-resolution photograph"
              >
                <img
                  src={transparentImageSrc || currentImageSrc}
                  alt={prod.name}
                  className="w-full h-full max-h-full max-w-full object-contain transition-transform duration-200 drop-shadow-2xl"
                  style={{
                    mixBlendMode: 'multiply'
                  }}
                  onError={() => handleImageError(`main-${activePhotoIndex}`)}
                />
              </div>

                {/* Zero-Latency Amazon-style Semi-Transparent Zoom Lens Following Cursor (Direct Ref Update) */}
                <div
                  ref={lensRef}
                  className="absolute top-0 left-0 pointer-events-none border-2 border-[#2D8CFF] bg-[#2D8CFF]/25 shadow-[0_0_14px_rgba(45,140,255,0.45)] rounded-xl z-20"
                  style={{
                    display: 'none',
                    width: '140px',
                    height: '140px',
                    willChange: 'transform'
                  }}
                >
                  <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
                  <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
                  <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
                  <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />
                </div>

                {/* Floating Fullscreen Zoom Action */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="absolute bottom-2 right-2 bg-white/95 hover:bg-white text-slate-700 hover:text-[#E93984] p-2.5 rounded-xl border border-slate-200 shadow-md text-xs font-semibold flex items-center gap-1.5 transition-colors z-10 cursor-pointer"
                  aria-label="Open Fullscreen Image View"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span>Full View</span>
                </button>
              </div>

            {/* Highly Used in These Industries Cluster (Placed Directly Down To Image to Fill Space) */}
            <div className="w-full mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0C225E] font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E93984]" />
                  Highly Used in These Industries:
                </span>
                <a
                  href="#industries-section"
                  className="text-[10px] text-[#E93984] hover:underline font-bold"
                >
                  View Detailed Specs ↓
                </a>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {industriesList.map((ind) => (
                  <a
                    key={ind.id}
                    href="#industries-section"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-medium text-slate-700 shadow-xs hover:border-[#E93984] hover:text-[#0C225E] transition-colors"
                  >
                    <span>{ind.icon}</span>
                    <span>{ind.shortName}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Amazon-style Side Zoom Preview Flyout Window (Desktop) - Zero Latency Ref Controlled */}
          <div
            ref={zoomWindowRef}
            className="hidden lg:block absolute left-[calc(100%+24px)] top-0 w-[540px] h-[520px] z-50 bg-white border-2 border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden pointer-events-none"
            style={{
              display: 'none',
              backgroundImage: `url(${transparentImageSrc || currentImageSrc})`,
              backgroundColor: '#ffffff',
              backgroundSize: '280%',
              backgroundPosition: '50% 50%',
              backgroundRepeat: 'no-repeat',
              willChange: 'background-position'
            }}
          >
            <div className="absolute top-3 left-3 bg-[#081D5B]/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E93984] animate-ping" />
              <span>🔍 2.8x Optical Surface Inspection</span>
            </div>
            <div className="absolute bottom-3 right-3 bg-white/95 text-slate-700 text-[10px] font-semibold px-3 py-1.5 rounded-full border border-slate-200 shadow-sm backdrop-blur-sm">
              Move cursor over product to inspect surface finish &amp; metallurgy
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: INDUSTRIAL PRODUCT HIERARCHY & SPECIFICATIONS              */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          {/* Category Eyebrow & Sourcing Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <a
              href={localizePath(`/category/${prod.categorySlug}`, currentLang)}
              className="text-xs font-bold text-[#E93984] uppercase tracking-wider hover:underline"
            >
              {prod.category}
            </a>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {prod.availability || 'Available on request'}
            </span>
          </div>

          {/* Product Headline */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
            {prod.name}
          </h1>

          {/* Trust & Specification Badges Strip */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${is316 ? 'bg-[#081D5B] text-white' : 'bg-slate-200 text-slate-800'}`}>
              Grade: {prod.material || 'Confirm on enquiry'}
            </span>
            {prod.finish && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-pink-50 text-[#E93984] border border-pink-200">
                {prod.finish}
              </span>
            )}
            {prod.standard && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                {prod.standard}
              </span>
            )}
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-sky-50 text-sky-800 border border-sky-200">
              EN 10204 3.1 Traceable
            </span>
          </div>

          {/* Product Overview */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
            {prod.overview}
          </p>

          {/* Technical Specifications Table */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Technical Parameters &amp; Sourcing Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Material Alloy:</span>
                <span className="text-slate-900 font-bold">{prod.material || 'Confirm on enquiry'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Surface Roughness:</span>
                <span className="text-slate-900 font-semibold">{prod.roughness || 'Confirm on enquiry'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Manufacturing:</span>
                <span className="text-slate-900 font-semibold">{prod.manufacturingType || 'Confirm on enquiry'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Size Range:</span>
                <span className="text-slate-900 font-semibold">{prod.sizes || 'Per technical schedule'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Wall Thickness:</span>
                <span className="text-slate-900 font-semibold">{prod.wallThickness || 'Confirm on enquiry'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Standard / Code:</span>
                <span className="text-slate-900 font-semibold">{prod.standard || 'Confirm on enquiry'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">End Connection:</span>
                <span className="text-slate-900 font-semibold">{prod.connection || 'Confirm on enquiry'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Test Certificate:</span>
                <span className="text-slate-900 font-semibold">{prod.mtc || 'Available on enquiry'}</span>
              </div>
            </div>
          </div>

          {/* Key Advantages */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Key Process Engineering Advantages:
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-[#E93984] font-bold">✓</span>
                <span><strong>Hygienic Internal Bore:</strong> Smooth, crevice-free internal finish preventing product build-up and biofilm growth.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E93984] font-bold">✓</span>
                <span><strong>100% Heat Traceable:</strong> Positive Material Identification (PMI) verified with mill metallurgy test certificates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E93984] font-bold">✓</span>
                <span><strong>CIP/SIP Compatibility:</strong> High chemical resistance to caustic cleaning washdowns and high-temperature steam sterilization.</span>
              </li>
            </ul>
          </div>

          {/* Primary Action Button Cluster */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => onOpenEnquiry && onOpenEnquiry(prod, prod.name)}
              className="flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Request Official Quotation</span>
              <span>↗</span>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#20BD5A] shadow-md transition-all cursor-pointer"
            >
              <span>💬</span>
              <span>WhatsApp Price</span>
            </a>

            <a
              href={localizePath('/quote', currentLang)}
              className="py-3.5 px-5 rounded-full text-xs sm:text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 text-center transition-colors"
            >
              Attach BOQ
            </a>
          </div>

          <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500">
            <span>⚡ Typical Quote Turnaround: &lt; 2 Hours</span>
            <span>•</span>
            <span>📍 Mumbai Central Sourcing Hub</span>
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
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all border cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#081D5B] text-white border-[#081D5B] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Tab 1: About & Construction */}
          {activeTab === 'about' && (
            <div className="space-y-6 text-sm text-slate-700">
              <h3 className="text-base font-bold text-slate-900">Manufacturing &amp; Engineering Construction</h3>
              <p className="leading-relaxed">
                {prod.overview}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-xs uppercase text-slate-800 mb-1">Hygienic Design Principle</h4>
                  <p className="text-xs text-slate-600">Zero dead-leg geometry engineered specifically to ensure self-draining in sterile fluid circuits and clean-in-place CIP lines.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-xs uppercase text-slate-800 mb-1">Quality Inspection Verification</h4>
                  <p className="text-xs text-slate-600">100% dimensional check against verified drawings with material test certification EN 10204 3.1 supplied with shipment.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Technical Specifications */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 mb-2">Technical Specification Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="py-2.5 px-4 font-bold text-slate-700">Attribute</th>
                      <th className="py-2.5 px-4 font-bold text-slate-700">Verified Specification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr><td className="py-2.5 px-4 text-slate-500">Material Grade</td><td className="py-2.5 px-4 font-semibold text-slate-800">{prod.material || 'SS 316L / SS 304'}</td></tr>
                    <tr><td className="py-2.5 px-4 text-slate-500">Manufacturing Method</td><td className="py-2.5 px-4 font-semibold text-slate-800">{prod.manufacturingType || 'Welded / Seamless'}</td></tr>
                    <tr><td className="py-2.5 px-4 text-slate-500">Surface Finish</td><td className="py-2.5 px-4 font-semibold text-slate-800">{prod.finish || 'EP / MP'} ({prod.roughness || 'Ra ≤ 0.38µm'})</td></tr>
                    <tr><td className="py-2.5 px-4 text-slate-500">Outside Diameter / Size</td><td className="py-2.5 px-4 font-semibold text-slate-800">{prod.sizes || '1/2" to 4" OD'}</td></tr>
                    <tr><td className="py-2.5 px-4 text-slate-500">Wall Thickness</td><td className="py-2.5 px-4 font-semibold text-slate-800">{prod.wallThickness || '1.2mm, 1.65mm, 2.0mm'}</td></tr>
                    <tr><td className="py-2.5 px-4 text-slate-500">Standard</td><td className="py-2.5 px-4 font-semibold text-slate-800">{prod.standard || 'ASTM A270 / BS 4825'}</td></tr>
                    <tr><td className="py-2.5 px-4 text-slate-500">End Connection</td><td className="py-2.5 px-4 font-semibold text-slate-800">{prod.connection || 'Weld / Tri-Clamp / SMS'}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Material & Surface Finish */}
          {activeTab === 'metallurgy' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <h3 className="text-base font-bold text-slate-900">Alloy Metallurgy &amp; Electropolishing</h3>
              <p className="leading-relaxed">
                Available in low-carbon surgical-grade austenitic stainless steel SS 316L (UNS S31603 / 1.4404) for aggressive organic acids and chloride media, as well as SS 304 (UNS S30400 / 1.4301) for standard food and dairy processing systems.
              </p>
              <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 text-xs text-pink-950">
                <strong>Electropolishing (EP) Finish:</strong> Micro-smooth passive chromium-oxide enriched layer with typical surface roughness Ra ≤ 0.38µm (15 µin), reducing friction, minimizing bacteria adhesion, and facilitating validated CIP cycles.
              </div>
            </div>
          )}

          {/* Tab 4: Standards & Compliance */}
          {activeTab === 'standards' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <h3 className="text-base font-bold text-slate-900">Applicable Codes &amp; Quality Documents</h3>
              <p className="leading-relaxed">
                Manufacturing tolerances and hygienic sanitary design follow ASTM A270, ASTM A269, BS 4825, DIN 11850, and 3-A Sanitary Standards, confirmed against actual product supply.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <strong>Documentation Available:</strong> Mill Test Certificate (MTC) conforming to EN 10204 Type 3.1 with heat number, chemical composition analysis, mechanical test records, and surface roughness verification.
              </div>
            </div>
          )}

          {/* Tab 5: Applications & Skids */}
          {activeTab === 'applications' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <h3 className="text-base font-bold text-slate-900">Industrial Process Applications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                {['Pharmaceutical & Biotech', 'Dairy Processing & Skids', 'Food & Beverage Bottling', 'Brewery & Fermentation', 'WFI High Purity Water Loops', 'Chemical & Aseptic Systems'].map((app, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <span className="text-[#E93984]">●</span>
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INDUSTRIES WHERE THIS PRODUCT IS HIGHLY USED                              */}
      {/* ========================================================================= */}
      <section className="mt-14 border-t border-slate-200 pt-10" id="industries-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-pink-100 text-[#E93984] text-xs font-bold uppercase tracking-wider mb-2">
              Industrial Applications &amp; Sourcing Sectors
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0C225E] tracking-tight">
              Industries Where {prod.name} Is Highly Used
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Precision manufactured to meet stringent sanitary codes, surface roughness requirements, and zero-contamination fluid transfer across critical global industries.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 shrink-0">
            8 Certified Sectors
          </span>
        </div>

        {/* 8 Industry Cards Grid with Real Photographs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industriesList.map((ind) => (
            <div
              key={ind.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#E93984]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Real Photographic Header Image */}
                <div className="h-40 w-full overflow-hidden relative bg-slate-100">
                  <img
                    src={ind.image}
                    alt={ind.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-slate-900 text-[10px] font-bold tracking-wide shadow-sm backdrop-blur-sm">
                      {ind.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-center gap-2">
                    <span className="text-base">{ind.icon}</span>
                    <h3 className="text-xs font-bold truncate leading-tight drop-shadow-sm text-white">
                      {ind.name}
                    </h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                      High Usage in {prod.name}:
                    </span>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {ind.usage}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-[#E93984] font-mono">
                      Compliance Standards:
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium leading-snug">
                      {ind.specs}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => onOpenEnquiry && onOpenEnquiry(prod, `${prod.name} for ${ind.name}`)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-[#E93984] text-slate-700 hover:text-white border border-slate-200 hover:border-[#E93984] text-xs font-bold transition-all text-center cursor-pointer shadow-xs"
                >
                  Inquire for {ind.shortName} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-14 border-t border-slate-200 pt-10">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6">
            Related {prod.category} Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((rel) => (
              <a
                key={rel.id}
                href={localizePath(`/product/${rel.slug || rel.id}`, currentLang)}
                className="group bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-lg hover:border-[#E93984]/50 transition-all flex flex-col"
              >
                <div className="aspect-square w-full rounded-xl bg-slate-50 flex items-center justify-center p-3 mb-3 overflow-hidden">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#E93984] transition-colors">
                  {rel.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Grade: {rel.material} &bull; {rel.finish}
                </p>
                <span className="mt-auto pt-3 text-xs font-bold text-[#E93984] flex items-center gap-1">
                  <span>View Details</span>
                  <span>↗</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN STATIC PHOTOGRAPH LIGHTBOX MODAL                              */}
      {/* ========================================================================= */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="High Resolution Photograph Lightbox"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-[#FC63A7] p-2 text-2xl font-bold z-50 transition-colors cursor-pointer"
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
                  setActivePhotoIndex((prev) =>
                    (prev - 1 + productImages.length) % productImages.length
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#081D5B] text-white hover:bg-[#E93984] text-xl z-50 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                aria-label="Previous photograph"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex((prev) =>
                    (prev + 1) % productImages.length
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#081D5B] text-white hover:bg-[#E93984] text-xl z-50 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                aria-label="Next photograph"
              >
                ›
              </button>
            </>
          )}

          {/* Lightbox Image Stage with Lotus Tubes Cover Background */}
          <div
            className="relative max-w-4xl aspect-[4/3] w-full max-h-[85vh] flex items-center justify-center rounded-3xl shadow-2xl border border-white/20 bg-cover bg-center overflow-hidden"
            style={{
              backgroundImage: 'url(/product-image-cover.png)',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-x-[8%] top-[23%] bottom-[19%] flex items-center justify-center">
              <img
                src={transparentImageSrc || currentImageSrc}
                alt={`${prod.name} high resolution static photograph`}
                className="w-full h-full max-h-full max-w-full object-contain drop-shadow-2xl"
                style={{
                  mixBlendMode: 'multiply'
                }}
              />
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center text-slate-800 text-xs sm:text-sm bg-white/90 px-4 py-1.5 rounded-full shadow-md font-sans z-10">
              <span className="font-bold text-[#0C225E]">{prod.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailView;
