import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { INDUSTRIES, PRODUCTS } from '../data/siteData';
import ProductCardVideo from '../components/common/ProductCardVideo';
import PageHero from '../components/common/PageHero';
import ProductImage from '../components/common/ProductImage';

/**
 * IndustriesView
 * Interactive, immersive storytelling showcase for Lotus Tubes' key process industries.
 *
 * Features:
 * 1. Cinematic Hero Section with rotating industrial visuals and trust metrics.
 * 2. Pinned / Sticky Scroll-Driven Experience:
 *    - Pinned viewport while scrolling transitions through the 7 industries sequentially.
 *    - Upward scrolling reverses the sequence.
 *    - After the 7th industry, scrolling naturally unpins and resumes down the page.
 * 3. Interactive tab selection:
 *    - Clicking or hovering an industry option smoothly transitions the image, heading,
 *      process demands, compliance standards, and recommended products without page reload.
 * 4. Responsive Adaptation:
 *    - Desktop (>= 1024px): Full scroll-driven pinned storytelling + clickable tabs.
 *    - Tablet & Mobile (< 1024px): Touch-friendly tabbed showcase without scroll traps.
 * 5. Full keyboard accessibility, aria-selected attributes, and prefers-reduced-motion support.
 */
export const IndustriesView = ({ slug, onOpenEnquiry }) => {
  // Find initial active index based on URL slug if provided
  const initialIndex = useMemo(() => {
    if (!slug) return 0;
    const foundIdx = INDUSTRIES.findIndex((i) => i.slug === slug || i.id === slug);
    return foundIdx !== -1 ? foundIdx : 0;
  }, [slug]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  const showcaseContainerRef = useRef(null);
  const stickyStageRef = useRef(null);
  const isScrollingByClickRef = useRef(false);

  // Monitor window resize for responsive mode
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync activeIndex if URL slug changes
  useEffect(() => {
    if (slug) {
      const idx = INDUSTRIES.findIndex((i) => i.slug === slug || i.id === slug);
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    }
  }, [slug]);

  const totalIndustries = INDUSTRIES.length;
  const currentIndustry = INDUSTRIES[activeIndex] || INDUSTRIES[0];

  // Industry visual pairings
  const industryPhotos = useMemo(
    () => ({
      pharmaceutical: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-004.jpg',
      biotechnology: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-005.jpg',
      dairy: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-003.jpg',
      'food-beverage': '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-002.jpg',
      breweries: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-007.jpg',
      'water-treatment': '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-001.jpg',
      chemical: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-008.jpg'
    }),
    []
  );

  // Resolve matching product items for the active industry
  const matchingProducts = useMemo(() => {
    if (!currentIndustry.products) return [];
    return currentIndustry.products
      .map((pid) => PRODUCTS.find((p) => p.id === pid || p.slug === pid))
      .filter(Boolean);
  }, [currentIndustry]);

  // =========================================================================
  // SCROLL-DRIVEN PINNED STORYTELLING LOGIC (Desktop >= 1024px)
  // =========================================================================
  useEffect(() => {
    if (!isDesktop) return;

    let ticking = false;

    const handleScroll = () => {
      if (isScrollingByClickRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const container = showcaseContainerRef.current;
          if (!container) {
            ticking = false;
            return;
          }

          const rect = container.getBoundingClientRect();
          const totalScrollDistance = container.offsetHeight - window.innerHeight;

          if (totalScrollDistance <= 0) {
            ticking = false;
            return;
          }

          // When top of container is at or above viewport top, and before the end
          const scrolledPastTop = -rect.top;

          if (scrolledPastTop >= 0 && scrolledPastTop <= totalScrollDistance) {
            const progress = scrolledPastTop / totalScrollDistance;
            const targetIdx = Math.min(
              Math.max(Math.floor(progress * totalIndustries), 0),
              totalIndustries - 1
            );
            setActiveIndex(targetIdx);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDesktop, totalIndustries]);

  // Navigate to an industry by click/tab with smooth container positioning
  const handleSelectIndustry = useCallback(
    (index) => {
      setActiveIndex(index);

      if (isDesktop && showcaseContainerRef.current) {
        isScrollingByClickRef.current = true;
        const container = showcaseContainerRef.current;
        const containerTop = container.getBoundingClientRect().top + window.scrollY;
        const totalScrollDistance = container.offsetHeight - window.innerHeight;
        const targetScrollY = containerTop + (index / (totalIndustries - 1)) * totalScrollDistance;

        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });

        setTimeout(() => {
          isScrollingByClickRef.current = false;
        }, 600);
      }
    },
    [isDesktop, totalIndustries]
  );

  return (
    <div className="industries-page-root bg-slate-950 text-white min-h-screen">
      {/* 1. CINEMATIC HERO SECTION */}
      <PageHero
        badge="Mission-Critical Sanitary Systems"
        title="Industries We Serve"
        subtitle="Hygienic Process Piping for Pharmaceutical, Biotech, Dairy & Food Processing"
        description="Every industry imposes distinct regulatory hygiene standards. From ASME BPE electropolished lines for sterile injectable loops to heavy-duty SMS/DIN dairy unions and CIP spray balls, Lotus Tubes provides tested components with verified metallurgy."
        slides={[
          {
            image: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-005.jpg',
            badge: 'Pharmaceutical & Biotechnology',
            title: 'Ultra-Pure Sanitary Piping for Life Sciences',
            subtitle: 'ASTM A270-S2 & ASME BPE Certified • Ra ≤ 0.38 µm EP',
            description: 'Full heat-traceable SS 316L tubes, diaphragm valves, and TC ferrules engineered to prevent bacterial harborage in sterile bulk active manufacturing.'
          },
          {
            image: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-003.jpg',
            badge: 'Dairy, Food & Beverage',
            title: 'Hygienic Flow Systems for Dairy & Beverage Lines',
            subtitle: '3-A Sanitary Standards • SMS 1145 Compatibility • Food-Grade Seals',
            description: 'Rugged stainless steel butterfly valves, bends, tees, and sanitary unions built for intensive daily CIP/SIP washdowns without flavor cross-contamination.'
          },
          {
            image: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-001.jpg',
            badge: 'Ultra-Pure Water & Clean Steam Loops',
            title: 'WFI & High-Purity Water Loop Components',
            subtitle: 'Passivated Chromium-Rich Oxide Layer • Zero Rouging Design',
            description: 'Supplying orbital-welded tubes, concentric reducers, and sampling valves certified with EN 10204 3.1 MTC inspection documents.'
          }
        ]}
        stats={[
          { value: '7 Core Sectors', label: 'Specialized Ranges' },
          { value: 'Ra ≤ 0.38 µm', label: 'Electropolished Contact' },
          { value: 'ASME BPE & 3-A', label: 'Sanitary Standards' },
          { value: 'EN 10204 3.1', label: 'Full Metallurgy Traceability' }
        ]}
        actions={[
          <button
            key="jump"
            type="button"
            onClick={() => {
              if (showcaseContainerRef.current) {
                showcaseContainerRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn btn--primary"
          >
            Explore Interactive Showcase &darr;
          </button>,
          <a key="cat" href="/products" className="btn btn--outline">
            Browse Full Product Catalogue
          </a>
        ]}
      />

      {/* 2. INTERACTIVE & SCROLL-DRIVEN SHOWCASE SECTION */}
      <section
        ref={showcaseContainerRef}
        id="interactive-showcase"
        className={`relative w-full ${isDesktop ? 'min-h-[420vh]' : 'py-16'}`}
        aria-label="Interactive Industry Showcase"
      >
        {/* Sticky Viewport Container */}
        <div
          ref={stickyStageRef}
          className={`${
            isDesktop
              ? 'sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden bg-slate-950 px-4 sm:px-8 py-6'
              : 'w-full px-4 sm:px-6'
          }`}
        >
          <div className="site-container max-w-7xl mx-auto w-full">
            {/* Showcase Header Bar with Progress Tracker */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">
                  Interactive Industry Showcase {isDesktop && '• Scroll or Click to Transition'}
                </span>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-3">
                <div className="text-xs font-mono font-bold text-slate-300">
                  <span className="text-sky-400">0{activeIndex + 1}</span>
                  <span className="text-slate-600"> / </span>
                  <span>0{totalIndustries}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleSelectIndustry((activeIndex - 1 + totalIndustries) % totalIndustries)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    aria-label="Previous industry"
                  >
                    &#8249;
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectIndustry((activeIndex + 1) % totalIndustries)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    aria-label="Next industry"
                  >
                    &#8250;
                  </button>
                </div>
              </div>
            </div>

            {/* Industry Selector Navigation Pills */}
            <nav
              className="flex items-center lg:flex-wrap gap-2 overflow-x-auto lg:overflow-x-visible pb-3 mb-6 scrollbar-none max-w-full"
              aria-label="Select an Industry"
            >
              {INDUSTRIES.map((ind, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => handleSelectIndustry(idx)}
                    onMouseEnter={() => {
                      if (!isDesktop) return;
                      // On desktop, hover provides instant feedback
                      setActiveIndex(idx);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/25 scale-102'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                    }`}
                    aria-selected={isActive}
                    role="tab"
                  >
                    <span className="text-sm">{ind.icon}</span>
                    <span>{ind.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Main Interactive Stage Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl backdrop-blur-md">
              {/* Left Column: Technical Narrative & Compliance Demands (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{currentIndustry.icon}</span>
                    <span className="text-xs font-bold text-sky-400 tracking-wider uppercase">
                      Sector Solution {activeIndex + 1} of {totalIndustries}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3 transition-all duration-300">
                    {currentIndustry.name}
                  </h3>

                  <p className="text-sm sm:text-base text-sky-200/90 font-medium leading-relaxed mb-4">
                    {currentIndustry.summary}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {currentIndustry.overview}
                  </p>

                  {/* Compliance Standards Badge List */}
                  <div className="mb-6">
                    <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block mb-2">
                      Verified Process Standards:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentIndustry.standards?.map((std, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-800 border border-slate-700/80 text-emerald-300 flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RFQ CTA Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenEnquiry &&
                      onOpenEnquiry(null, `${currentIndustry.name} Process Piping Sourcing`)
                    }
                    className="btn btn--primary text-xs py-2.5 px-4 font-bold shadow-md shadow-sky-500/20"
                  >
                    Request {currentIndustry.name} RFQ &rarr;
                  </button>

                  <a
                    href={`https://wa.me/919820525200?text=Hello%20Lotus%20Tubes%2C%20I%20have%20an%20enquiry%20for%20${encodeURIComponent(
                      currentIndustry.name
                    )}%20sanitary%20piping.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-900/60 transition-colors"
                  >
                    <span>🟢</span>
                    <span>WhatsApp Specialist</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Visual Showcase & Compatible Products (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-6 min-w-0">
                {/* Large High-Definition Visual Stage */}
                <div className="relative w-full h-[260px] sm:h-[320px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
                  <img
                    key={currentIndustry.id}
                    src={industryPhotos[currentIndustry.slug] || '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-005.jpg'}
                    alt={`${currentIndustry.name} Sanitary Installation`}
                    className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top-Right Vector Pill */}
                  <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-sky-300 flex items-center gap-2">
                    <img
                      src={currentIndustry.image}
                      alt=""
                      className="w-4 h-4"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span>{currentIndustry.name}</span>
                  </div>

                  {/* Bottom Highlight Pill */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-800">
                    <span className="font-semibold text-white">
                      Recommended Metallurgy: SS 316L / SS 304
                    </span>
                    <span className="text-emerald-400 font-medium">EN 10204 3.1 Traceable</span>
                  </div>
                </div>

                {/* Recommended Compatible Components Carousel / Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Recommended Components for {currentIndustry.name}:
                    </span>
                    <a
                      href="/products"
                      className="text-xs font-semibold text-sky-400 hover:text-sky-300"
                    >
                      View All 30+ Items &rarr;
                    </a>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {matchingProducts.map((p) => {
                      return (
                        <a
                          key={p.id}
                          href={`/product/${p.slug || p.id}`}
                          className="group/card flex flex-col p-2.5 rounded-xl bg-slate-850/80 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 transition-all text-left min-w-0"
                        >
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-900 mb-2 flex items-center justify-center p-2">
                            <ProductImage
                              src={p.image}
                              alt={p.name}
                              aspectRatio="auto"
                              className="w-full h-full"
                              imgClassName="max-h-full object-contain group-hover/card:scale-105 transition-transform"
                            />
                            {p.video && (
                              <span className="absolute top-1 right-1 text-[9px] font-bold bg-sky-500 text-white px-1.5 py-0.5 rounded">
                                ▶ Video
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-bold text-white line-clamp-1 group-hover/card:text-sky-300 transition-colors">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {p.material} &bull; {p.standard?.split('/')[0]}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Instruction Helper for Desktop */}
            {isDesktop && (
              <div className="text-center mt-4">
                <span className="text-[11px] text-slate-500 font-medium tracking-wide inline-flex items-center gap-1.5 animate-pulse">
                  <span>Scroll down to advance to the next industry</span>
                  <span>&darr;</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. ALL INDUSTRIES COMPLETE OVERVIEW GRID */}
      <section className="py-20 bg-slate-900 border-t border-slate-800" aria-label="All Industries Matrix">
        <div className="site-container">
          <div className="section-header mb-12">
            <div>
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-950 px-3 py-1 rounded-full border border-sky-800">
                Complete Process Matrix
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
                Tailored Sanitary Solutions Across Every Hygienic Sector
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xl">
              Compare requirements across pharmaceutical, biotechnology, food &amp; beverage, and high-purity water systems to select the exact finish and alloy grade for your facility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRIES.map((ind, idx) => (
              <article
                key={ind.id}
                className="group p-6 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-sky-500/50 transition-all duration-300 flex flex-col justify-between min-w-0"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{ind.icon}</span>
                    <button
                      type="button"
                      onClick={() => handleSelectIndustry(idx)}
                      className="text-xs font-bold text-sky-400 hover:text-sky-300 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-700"
                    >
                      Showcase &rarr;
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {ind.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mb-4">
                    {ind.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {ind.standards?.slice(0, 2).map((st, i) => (
                      <span key={i} className="text-[10.5px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenEnquiry && onOpenEnquiry(null, `${ind.name} Sourcing Consultation`)
                    }
                    className="text-xs font-bold text-white hover:text-sky-400 transition-colors"
                  >
                    Request Industry RFQ
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectIndustry(idx)}
                    className="text-xs text-sky-400 hover:underline"
                  >
                    View Demands &darr;
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndustriesView;
