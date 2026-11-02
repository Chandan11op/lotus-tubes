import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import ProductImage from './ProductImage';

/**
 * HomeCinematicHero
 * High-impact, cinematic homepage hero for Lotus Tubes inspired by Hex India Fasteners.
 *
 * Features:
 * - Coordinated transitions: Left technical copy and Right visual panel change together seamlessly
 * - Seamless integration of verified high-definition imagery & actual product videos
 * - Strong industrial headline, supporting tagline, concise description, and dual CTAs
 * - Trust / quality badges (EN 10204 3.1, ASTM A270, Ra ≤ 0.38 µm, Ready Stock)
 * - Interactive slide progress tabs, numeric counter, and pause-on-hover auto-advance
 */
export const HomeCinematicHero = ({ onOpenEnquiry, onOpenVideo }) => {
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const timerRef = useRef(null);
  const videoPlayerRef = useRef(null);

  const slides = [
    {
      id: 'pipes',
      tabLabel: 'Sanitary Pipes & Tubes',
      badge: 'ASTM A270 & ASME BPE Certified',
      category: 'Sanitary Pipes & Tubes',
      titleHighlight: 'Pipes & Tubing',
      desc: 'Seamless & welded SS 304/316L sanitary tubes featuring mirror electropolished contact surfaces (Ra ≤ 0.38 µm) engineered for critical pharmaceutical WFI loops and biotech processing.',
      specPill: 'ASTM A270 • Ra ≤ 0.38 µm EP • 1/2" to 4" Ready Stock',
      mediaType: 'image',
      image: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-005.jpg',
      material: 'SS 316L / SS 304',
      primaryProduct: 'ss-316l-ep-pipe'
    },
    {
      id: 'butterfly-valve',
      tabLabel: 'Sanitary Butterfly Valves',
      badge: 'Hygienic Flow Precision',
      category: 'Manual Sanitary Valves',
      titleHighlight: 'Sanitary Butterfly Valves',
      desc: 'Precision forged SS 316L butterfly valves with streamlined mirror disc and FDA food-grade silicone/EPDM seals, delivering full bidirectional leak-tight shutoff with low operating torque.',
      specPill: '10 Bar Rated • Ra ≤ 0.4 µm • Tri-Clamp & Weld Ends',
      mediaType: 'video',
      productId: 'ss-sanitary-butterfly-valve',
      videoSrc: '/assets/videos/ss-butterfly-valves.mp4',
      poster: '/assets/images/products/valves/butterfly-valves/ss-sanitary-butterfly-valve-001.jpg',
      material: 'SS 316L Mirror EP',
      primaryProduct: 'ss-sanitary-butterfly-valve'
    },
    {
      id: 'clamp-holder',
      tabLabel: 'Tri-Clamp Components',
      badge: 'High-Integrity Joint Closure',
      category: 'Tri-Clamp Fittings & Components',
      titleHighlight: 'Heavy Duty Tri-Clamps',
      desc: 'Investment cast SS 304 heavy-duty Tri-Clamps and pipe hangers engineered to exert uniform circumferential compression across gasket faces for leak-free, tool-free joint closure.',
      specPill: 'Single & Double Pin • 1/2" to 8" • 14° Flange Taper',
      mediaType: 'video',
      productId: 'ss-tri-clamp-clamp',
      videoSrc: '/assets/videos/ss-pipe-holder.mp4',
      poster: '/assets/images/products/accessories/pipe-holders/ss-sanitary-pipe-hanger-clamp-007.jpg',
      material: 'SS 304 Investment Cast',
      primaryProduct: 'ss-tri-clamp-clamp'
    },
    {
      id: 'pneumatic-valve',
      tabLabel: 'Pneumatic Ball Valves',
      badge: 'Automated Process Skids',
      category: 'Automated & Pneumatic Valves',
      titleHighlight: 'Pneumatic Ball Valves',
      desc: 'Full-bore sanitary ball valves with encapsulated cavity-filled PTFE seats and double-acting ISO 5211 pneumatic actuators for automated CIP/SIP hygienic processing skids.',
      specPill: 'ISO 5211 Direct Mount • Cavity Filled • High Cycle Life',
      mediaType: 'image',
      productId: 'pneumatic-sanitary-ball-valve',
      image: '/assets/images/products/valves/pneumatic-valves/ss-pneumatic-actuated-sanitary-ball-valve-023.jpg',
      material: 'SS 316L Actuated',
      primaryProduct: 'pneumatic-sanitary-ball-valve'
    }
  ];

  const total = slides.length;
  const current = slides[activeSlide];

  // Auto-advance slides every 7 seconds when idle
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % total);
    }, 7000);

    return () => clearInterval(timerRef.current);
  }, [isPaused, total]);

  const toggleVideo = () => {
    if (!videoPlayerRef.current) return;
    if (videoPlayerRef.current.paused) {
      videoPlayerRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    } else {
      videoPlayerRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  return (
    <section
      className="relative w-full bg-slate-950 text-white overflow-hidden border-b border-slate-800 shadow-2xl"
      aria-label="Lotus Tubes Cinematic Hero Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle Background Lighting & Radial Accents */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950" />
      </div>

      <div className="site-container relative z-10 py-12 sm:py-16 lg:py-20">
        {/* Top Slide Indicator Tabs */}
        <div className="flex items-center justify-between gap-3 pb-6 mb-8 border-b border-slate-800/80 overflow-x-auto scrollbar-none max-w-full">
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSlide(idx)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeSlide === idx
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-md shadow-sky-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeSlide === idx ? 'bg-sky-400 animate-pulse' : 'bg-slate-600'}`} />
                <span>{s.tabLabel}</span>
              </button>
            ))}
          </div>

          {/* Numeric Slide Counter */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-slate-400 bg-slate-900/80 px-3 py-1 rounded-md border border-slate-800">
            <span className="text-sky-400">0{activeSlide + 1}</span>
            <span className="text-slate-600">/</span>
            <span>0{total}</span>
          </div>
        </div>

        {/* Main Hero Split Grid: Coordinated Text & Visual Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ============================================================ */}
          {/* LEFT: Dynamic Technical Hierarchy & Information             */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 flex flex-col justify-center min-w-0">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-semibold tracking-wider text-sky-400 uppercase shadow-lg w-fit mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{current.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.12] mb-3">
              Stainless Steel Sanitary Pipes, Fittings &amp; Valves
            </h1>

            {/* Supporting Tagline */}
            <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-200 tracking-normal mb-4">
              Engineered for Hygienic Process Applications
            </h2>

            {/* Slide-specific concise description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mb-6 min-h-[48px]">
              {current.desc}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <a
                href="#products"
                className="btn btn--primary px-6 py-3 text-sm font-bold shadow-lg shadow-sky-500/25 flex items-center gap-2"
              >
                <span>{t('btn_explore_products', 'Explore Products')}</span>
                <span>&rarr;</span>
              </a>

              <button
                type="button"
                onClick={() => onOpenEnquiry && onOpenEnquiry(current.primaryProduct, current.tabLabel)}
                className="btn btn--outline px-6 py-3 text-sm font-semibold border-slate-600 text-white hover:bg-slate-800 transition-colors"
              >
                {t('btn_request_quote', 'Request a Quote')}
              </button>

              <a
                href="https://wa.me/919820525200?text=Hello%20Lotus%20Tubes%2C%20I%20would%20like%20to%20enquire%20about%20sanitary%20stainless%20steel%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-900/60 transition-colors"
              >
                <span>🟢</span>
                <span>WhatsApp Desk</span>
              </a>
            </div>

            {/* 4 Trust & Quality Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-lg">💎</span>
                <div className="text-xs">
                  <strong className="text-white block">SS 304 / 316L</strong>
                  <span className="text-slate-400">High-Purity Alloy</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg">📦</span>
                <div className="text-xs">
                  <strong className="text-white block">Ready Stock</strong>
                  <span className="text-slate-400">24-48h Dispatch</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg">📜</span>
                <div className="text-xs">
                  <strong className="text-white block">EN 10204 3.1</strong>
                  <span className="text-slate-400">Full Metallurgy MTC</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <div className="text-xs">
                  <strong className="text-white block">Ra ≤ 0.38 µm</strong>
                  <span className="text-slate-400">Mirror EP Finish</span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: High-Impact Visual Panel (Real Videos & Photography)  */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 min-w-0">
            <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#10263d] to-slate-950 border border-slate-700/80 shadow-2xl">
              {/* Top Floating Badge & Specs */}
              <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
                <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/70 text-left pointer-events-auto shadow-lg">
                  <div className="text-[10.5px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{current.category}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate">
                    {current.titleHighlight}
                  </div>
                </div>

                <div className="hidden sm:block text-[11px] font-medium text-sky-300 bg-slate-900/80 px-2.5 py-1 rounded backdrop-blur-sm border border-slate-700/60 pointer-events-none">
                  {current.material}
                </div>
              </div>

              {/* Dynamic Media Stage based on current slide */}
              <div className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] flex items-center justify-center p-4 sm:p-6">
                {current.mediaType === 'video' ? (
                  <div className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden bg-slate-950">
                    <video
                      ref={videoPlayerRef}
                      key={current.videoSrc}
                      src={current.videoSrc}
                      poster={current.poster}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleVideo}
                        className="p-2 rounded-lg bg-slate-900/85 hover:bg-slate-800 text-white text-xs border border-slate-700 backdrop-blur-sm transition-colors"
                        aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                      >
                        {isVideoPlaying ? '⏸ Pause' : '▶ Play'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <ProductImage
                      src={current.image}
                      alt={current.titleHighlight}
                      priority={true}
                      aspectRatio="auto"
                      className="w-full h-full max-h-full"
                      imgClassName="max-h-[400px] object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Bottom Spec Floating Bar */}
              <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-300 font-medium truncate">
                  {current.specPill}
                </div>
                <a
                  href={`#product/${current.primaryProduct}`}
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 shrink-0 ml-3"
                >
                  Inspect Specs &rarr;
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeCinematicHero;
