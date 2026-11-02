import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * HomeCinematicHero
 * Premium industrial product showcase featuring 8-second 16:9 360° product rotation videos
 * across the four core product subsections:
 * 1. Sanitary Pipes & Tubes
 * 2. Sanitary Butterfly Valves
 * 3. Tri-Clamp Components
 * 4. Pneumatic Ball Valves
 *
 * Synchronized with:
 * - Frame-accurate 8.0-second auto-transitions
 * - Interactive subsection tabs with live progress fill bars
 * - 4-segment industrial scrollbar/progress track
 * - Pause on hover/interaction, mobile touch swipe, keyboard navigation
 * - Preloading of next video and IntersectionObserver for viewport pause
 */
export const HomeCinematicHero = ({ onOpenEnquiry, onOpenVideo }) => {
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const videoPlayerRef = useRef(null);
  const sectionRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // The 4 core homepage product subsections with verified 8-second 16:9 360° rotation videos
  const slides = [
    {
      id: 'pipes',
      tabLabel: 'Sanitary Pipes & Tubes',
      category: 'Sanitary Pipes & Tubes',
      badge: 'ASTM A270 & ASME BPE Certified',
      titleHighlight: 'Pipes & Tubing',
      desc: 'Seamless & welded SS 304/316L sanitary tubes featuring mirror electropolished contact surfaces (Ra ≤ 0.38 µm) engineered for critical pharmaceutical WFI loops and biotech processing.',
      specPill: 'ASTM A270 • Ra ≤ 0.38 µm EP • 1/2" to 4" Ready Stock',
      mediaType: 'video',
      productId: 'ss-316l-ep-pipe',
      videoSrc: '/assets/videos/homepage/sanitary-pipes-360.mp4',
      videoSrcWebm: '/assets/videos/homepage/sanitary-pipes-360.webm',
      poster: '/assets/videos/homepage/sanitary-pipes-360-poster.webp',
      material: 'SS 316L / SS 304',
      primaryProduct: 'ss-316l-ep-pipe'
    },
    {
      id: 'butterfly-valve',
      tabLabel: 'Sanitary Butterfly Valves',
      category: 'Manual Sanitary Valves',
      badge: 'Hygienic Flow Precision',
      titleHighlight: 'Sanitary Butterfly Valves',
      desc: 'Precision forged SS 316L butterfly valves with streamlined mirror disc and FDA food-grade silicone/EPDM seals, delivering full bidirectional leak-tight shutoff with low operating torque.',
      specPill: '10 Bar Rated • Ra ≤ 0.4 µm • Tri-Clamp & Weld Ends',
      mediaType: 'video',
      productId: 'ss-sanitary-butterfly-valve',
      videoSrc: '/assets/videos/homepage/butterfly-valves-360.mp4',
      videoSrcWebm: '/assets/videos/homepage/butterfly-valves-360.webm',
      poster: '/assets/videos/homepage/butterfly-valves-360-poster.webp',
      material: 'SS 316L Mirror EP',
      primaryProduct: 'ss-sanitary-butterfly-valve'
    },
    {
      id: 'clamp-holder',
      tabLabel: 'Tri-Clamp Components',
      category: 'Tri-Clamp Fittings & Components',
      badge: 'High-Integrity Joint Closure',
      titleHighlight: 'Heavy Duty Tri-Clamps',
      desc: 'Investment cast SS 304 heavy-duty Tri-Clamps and pipe hangers engineered to exert uniform circumferential compression across gasket faces for leak-free, tool-free joint closure.',
      specPill: 'Single & Double Pin • 1/2" to 8" • 14° Flange Taper',
      mediaType: 'video',
      productId: 'ss-tri-clamp-clamp',
      videoSrc: '/assets/videos/homepage/tri-clamp-360.mp4',
      videoSrcWebm: '/assets/videos/homepage/tri-clamp-360.webm',
      poster: '/assets/videos/homepage/tri-clamp-360-poster.webp',
      material: 'SS 304 Investment Cast',
      primaryProduct: 'ss-tri-clamp-clamp'
    },
    {
      id: 'pneumatic-valve',
      tabLabel: 'Pneumatic Ball Valves',
      category: 'Automated & Pneumatic Valves',
      badge: 'Automated Process Skids',
      titleHighlight: 'Pneumatic Ball Valves',
      desc: 'Full-bore sanitary ball valves with encapsulated cavity-filled PTFE seats and double-acting ISO 5211 pneumatic actuators for automated CIP/SIP hygienic processing skids.',
      specPill: 'ISO 5211 Direct Mount • Cavity Filled • High Cycle Life',
      mediaType: 'video',
      productId: 'pneumatic-sanitary-ball-valve',
      videoSrc: '/assets/videos/homepage/pneumatic-valves-360.mp4',
      videoSrcWebm: '/assets/videos/homepage/pneumatic-valves-360.webm',
      poster: '/assets/videos/homepage/pneumatic-valves-360-poster.webp',
      material: 'SS 316L Actuated',
      primaryProduct: 'pneumatic-sanitary-ball-valve'
    }
  ];

  const total = slides.length;
  const current = slides[activeSlide];
  const nextSlideIdx = (activeSlide + 1) % total;
  const nextSlide = slides[nextSlideIdx];

  // Navigate to slide with smooth transition
  const goToSlide = useCallback((newIdx) => {
    setIsTransitioning(true);
    setProgress(0);
    setActiveSlide(newIdx);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 450);
  }, []);

  const handleNext = useCallback(() => {
    goToSlide((activeSlide + 1) % total);
  }, [activeSlide, total, goToSlide]);

  const handlePrev = useCallback(() => {
    goToSlide((activeSlide - 1 + total) % total);
  }, [activeSlide, total, goToSlide]);

  // Master 8-Second Synchronized Progression Timer
  const DURATION_MS = 8000;
  const STEP_MS = 50;

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextVal = prev + (STEP_MS / DURATION_MS) * 100;
        if (nextVal >= 100) {
          handleNext();
          return 0;
        }
        return nextVal;
      });
    }, STEP_MS);

    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // Reset video playback and start cleanly whenever activeSlide changes
  useEffect(() => {
    const video = videoPlayerRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    }
    setProgress(0);
  }, [activeSlide]);

  // Sync progress directly from video time for frame-perfect alignment
  const handleTimeUpdate = (e) => {
    if (isPaused) return;
    const v = e.currentTarget;
    if (v.duration > 0) {
      const syncPercent = (v.currentTime / v.duration) * 100;
      // Keep state smoothly synchronized without jerky jumps
      if (Math.abs(syncPercent - progress) > 4) {
        setProgress(syncPercent);
      }
    }
  };

  const handleVideoEnded = () => {
    if (!isPaused) {
      handleNext();
    }
  };

  // Toggle video play/pause manually
  const toggleVideo = () => {
    const video = videoPlayerRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => {
        setIsVideoPlaying(true);
        setIsPaused(false);
      }).catch(() => {});
    } else {
      video.pause();
      setIsVideoPlaying(false);
      setIsPaused(true);
    }
  };

  // Viewport IntersectionObserver to pause playback when out of view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoPlayerRef.current;
          if (!video) return;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext(); // swipe left -> next
      } else {
        handlePrev(); // swipe right -> prev
      }
    }
    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
  };

  const currentSeconds = Math.min(8, Math.max(0, (progress / 100) * 8)).toFixed(1);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-slate-950 text-white overflow-hidden border-b border-slate-800 shadow-2xl"
      aria-label="Lotus Tubes Cinematic Hero Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Lighting & Radial Accents */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950" />
      </div>

      <div className="site-container relative z-10 py-10 sm:py-14 lg:py-18">
        
        {/* ========================================================================= */}
        {/* TOP: 4 SUBSECTION TABS WITH SYNCHRONIZED PROGRESS FILL BARS               */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 w-full sm:w-auto">
            {slides.map((s, idx) => {
              const isActive = activeSlide === idx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`group relative flex flex-col items-start px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border text-left cursor-pointer overflow-hidden ${
                    isActive
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/40'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                  aria-selected={isActive}
                  aria-label={`View ${s.tabLabel}`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span
                      className={`w-2 h-2 rounded-full transition-all ${
                        isActive ? 'bg-cyan-400 animate-pulse ring-2 ring-cyan-400/50' : 'bg-slate-600 group-hover:bg-slate-400'
                      }`}
                    />
                    <span className="truncate">{s.tabLabel}</span>
                  </div>

                  {/* Synchronized 8-Second Progress Fill Bar Under Tab */}
                  <div className="w-full h-1 bg-slate-800/80 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-75 ${
                        isActive ? 'bg-gradient-to-r from-sky-400 to-cyan-300' : idx < activeSlide ? 'bg-slate-600' : 'w-0'
                      }`}
                      style={{
                        width: isActive ? `${progress}%` : idx < activeSlide ? '100%' : '0%'
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Numeric Slide Counter & Status */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono font-bold text-slate-400">
            <div className="inline-flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-md border border-slate-800 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300">AUTO 8S</span>
              <span className="text-cyan-400 font-mono ml-1">{currentSeconds}s</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-md border border-slate-800 shadow-inner">
              <span className="text-sky-400">0{activeSlide + 1}</span>
              <span className="text-slate-600">/</span>
              <span>0{total}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN HERO SPLIT GRID: COORDINATED TECHNICAL HIERARCHY & 16:9 VIDEO STAGE  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Dynamic Technical Hierarchy & Information */}
          <div
            className={`lg:col-span-6 flex flex-col justify-center min-w-0 transition-all duration-500 ${
              isTransitioning ? 'opacity-40 translate-x-1' : 'opacity-100 translate-x-0'
            }`}
          >
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-sky-500/30 text-xs font-semibold tracking-wider text-sky-300 uppercase shadow-lg w-fit mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{current.badge}</span>
            </div>

            {/* Main Semantic H1 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.12] mb-3">
              Stainless Steel Sanitary Pipes, Fittings &amp; Valves
            </h1>

            {/* Supporting Subheading */}
            <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-200 to-white tracking-normal mb-4">
              Engineered for Hygienic Process Applications
            </h2>

            {/* Slide-specific technical description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mb-6 min-h-[52px]">
              {current.desc}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <a
                href="/products"
                className="btn btn--primary px-6 py-3 text-sm font-bold shadow-lg shadow-sky-500/25 flex items-center gap-2"
              >
                <span>{t('btn_explore_products', 'Explore Products')}</span>
                <span>&rarr;</span>
              </a>

              <button
                type="button"
                onClick={() => onOpenEnquiry && onOpenEnquiry(current.primaryProduct, current.tabLabel)}
                className="btn btn--outline px-6 py-3 text-sm font-semibold border-slate-600 text-white hover:bg-slate-800 transition-colors cursor-pointer"
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

          {/* RIGHT: 16:9 Landscape 360° Video Showcase Stage */}
          <div className="lg:col-span-6 min-w-0">
            <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#10263d] to-slate-950 border border-slate-700/80 shadow-2xl">
              
              {/* Top Floating Badge & Specs Bar */}
              <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
                <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-700/70 text-left pointer-events-auto shadow-lg">
                  <div className="text-[10.5px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{current.category}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate">
                    {current.titleHighlight}
                  </div>
                </div>

                {/* 360° Indicator Pill */}
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900/90 backdrop-blur-md text-cyan-300 text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/40 shadow-sm flex items-center gap-1.5 tracking-wide">
                    <svg className="w-3.5 h-3.5 animate-spin-slow text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                    </svg>
                    <span>360° Motorized Turntable</span>
                  </span>
                </div>
              </div>

              {/* 16:9 Landscape Video Container with Smooth Fade & Scale Transition */}
              <div className="relative w-full aspect-video bg-white flex items-center justify-center overflow-hidden">
                <div
                  className={`relative w-full h-full transition-all duration-700 ease-out flex items-center justify-center ${
                    isTransitioning ? 'opacity-30 scale-98 blur-[1px]' : 'opacity-100 scale-100 blur-0'
                  }`}
                >
                  <video
                    ref={videoPlayerRef}
                    key={current.videoSrc}
                    poster={current.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnded}
                    className="w-full h-full object-contain"
                    aria-label={`${current.titleHighlight} - 8s 360 degree turntable rotation video`}
                  >
                    <source src={current.videoSrcWebm} type="video/webm" />
                    <source src={current.videoSrc} type="video/mp4" />
                    <img src={current.poster} alt={current.titleHighlight} className="w-full h-full object-contain" />
                  </video>
                </div>

                {/* Corner Controls: Play/Pause and Next/Prev Navigation */}
                <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-2 rounded-lg bg-slate-900/85 hover:bg-slate-800 text-white text-xs border border-slate-700 backdrop-blur-sm transition-colors cursor-pointer"
                    aria-label="Previous Subsection"
                    title="Previous Subsection"
                  >
                    &#9664;
                  </button>

                  <button
                    type="button"
                    onClick={toggleVideo}
                    className="px-2.5 py-2 rounded-lg bg-slate-900/85 hover:bg-slate-800 text-white text-xs border border-slate-700 backdrop-blur-sm transition-colors cursor-pointer font-medium flex items-center gap-1.5"
                    aria-label={isVideoPlaying ? 'Pause 360 Video' : 'Play 360 Video'}
                  >
                    <span>{isVideoPlaying ? '⏸' : '▶'}</span>
                    <span>{isVideoPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-2 rounded-lg bg-slate-900/85 hover:bg-slate-800 text-white text-xs border border-slate-700 backdrop-blur-sm transition-colors cursor-pointer"
                    aria-label="Next Subsection"
                    title="Next Subsection"
                  >
                    &#9654;
                  </button>
                </div>

                {/* Seamless Background Preloader for Next Slide Video */}
                <video
                  src={nextSlide.videoSrcWebm}
                  preload="auto"
                  muted
                  playsInline
                  className="hidden"
                  aria-hidden="true"
                />
              </div>

              {/* Bottom Industrial 4-Segment Scrollbar & Progress Indicator */}
              <div className="p-3.5 bg-slate-900/95 border-t border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium truncate">
                    {current.specPill}
                  </span>
                  <a
                    href={`/product/${current.primaryProduct}`}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 shrink-0 ml-3"
                  >
                    Inspect Specs &rarr;
                  </a>
                </div>

                {/* 4-Segment Scrollbar Progress Track */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {slides.map((s, idx) => {
                    const isSegmentActive = activeSlide === idx;
                    const isSegmentDone = idx < activeSlide;
                    return (
                      <div
                        key={s.id}
                        className="h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer"
                        onClick={() => goToSlide(idx)}
                        title={`Switch to ${s.tabLabel}`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-75 ${
                            isSegmentActive
                              ? 'bg-gradient-to-r from-sky-400 to-cyan-300'
                              : isSegmentDone
                              ? 'bg-slate-500'
                              : 'w-0'
                          }`}
                          style={{
                            width: isSegmentActive ? `${progress}%` : isSegmentDone ? '100%' : '0%'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeCinematicHero;
