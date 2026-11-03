import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * HomeCinematicHero
 * Premium full-bleed cinematic hero inspired by Hex India Fasteners, featuring
 * 360° product rotation videos as the dynamic background visual across the four core subsections:
 * 1. Sanitary Pipes & Tubes
 * 2. Sanitary Butterfly Valves
 * 3. Tri-Clamp Components
 * 4. Pneumatic Ball Valves
 *
 * Capabilities:
 * - Full-width background video with smooth crossfade between products
 * - Left and right vertically centered side navigation buttons (< and >)
 * - Automatic 8.0-second auto-swipe transitions
 * - Clean bottom tab pills with subtle progress bars (NO running seconds, NO 01/04 numbers)
 * - Razor-sharp text contrast with multi-tier cinematic dark overlays
 * - Pause on hover, mobile touch swipe, and keyboard navigation
 */
export const HomeCinematicHero = ({ onOpenEnquiry, onOpenVideo }) => {
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const videoPlayerRef = useRef(null);
  const sectionRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // The 4 core homepage product subsections with real industrial factory manufacturing videos
  const slides = [
    {
      id: 'pipes',
      tabLabel: 'Sanitary Pipes & Tubes',
      category: 'Sanitary Pipes & Tubes',
      badge: 'Automated Factory Fabrication • ASTM A270 & ASME BPE',
      titleHighlight: 'Precision Roll-Forming & Orbital Laser Welding',
      desc: 'Manufactured on continuous automated tube rolling mills with clean-bore TIG/laser orbital welding, multi-pass cold drawing, and specialized mirror electropolishing baths achieving certified Ra ≤ 0.38 µm for critical biopharma and WFI loops.',
      specPill: 'TIG / Laser Welded • Ra ≤ 0.38 µm EP • 100% Eddy Current Tested',
      productId: 'ss-316l-ep-pipe',
      videoSrc: '/assets/videos/homepage/sanitary-pipes-factory.mp4',
      videoSrcWebm: '/assets/videos/homepage/sanitary-pipes-factory.webm',
      poster: '/assets/videos/homepage/sanitary-pipes-factory-poster.webp',
      primaryProduct: 'ss-316l-ep-pipe'
    },
    {
      id: 'butterfly-valve',
      tabLabel: 'Sanitary Butterfly Valves',
      category: 'Manual Sanitary Valves',
      badge: 'Precision CNC Machining & Zero-Leak Testing',
      titleHighlight: 'Forged SS 316L Valve Body & Mirror Disc Machining',
      desc: 'High-precision 5-axis CNC machining of solid forged SS 316L valve bodies, featuring hydro-formed mirror discs and robotic silicone/EPDM seal insertion. Every valve undergoes 10-bar hydrostatic and bubble-tight pneumatic seat testing before dispatch.',
      specPill: '5-Axis CNC Forged • 10 Bar Pressure Tested • FDA Food-Grade Seals',
      productId: 'ss-sanitary-butterfly-valve',
      videoSrc: '/assets/videos/homepage/butterfly-valves-factory.mp4',
      videoSrcWebm: '/assets/videos/homepage/butterfly-valves-factory.webm',
      poster: '/assets/videos/homepage/butterfly-valves-factory-poster.webp',
      primaryProduct: 'ss-sanitary-butterfly-valve'
    },
    {
      id: 'clamp-holder',
      tabLabel: 'Tri-Clamp Components',
      category: 'Tri-Clamp Fittings & Components',
      badge: 'Robotic Mirror Buffing & Investment Casting',
      titleHighlight: 'Precision Cast Heavy-Duty 13MHH Clamps & Ferrules',
      desc: 'Investment cast in virgin SS 304/316 alloy, multi-station automated robotic buffing produces flawless exterior mirror finishes, while CNC-machined ferrule weld prep bevels ensure 100% concentric alignment and uniform gasket compression across hygienic joints.',
      specPill: 'Robotic Mirror Polished • 14° Flange Bevel • True-Round Concentricity',
      productId: 'ss-tri-clamp-clamp',
      videoSrc: '/assets/videos/homepage/tri-clamp-factory.mp4',
      videoSrcWebm: '/assets/videos/homepage/tri-clamp-factory.webm',
      poster: '/assets/videos/homepage/tri-clamp-factory-poster.webp',
      primaryProduct: 'ss-tri-clamp-clamp'
    },
    {
      id: 'pneumatic-valve',
      tabLabel: 'Pneumatic Ball Valves',
      category: 'Automated & Pneumatic Valves',
      badge: 'Cleanroom Automation & Multi-Cycle Calibration',
      titleHighlight: 'Actuated Process Valves & Pneumatic Bench Testing',
      desc: 'Engineered with fully encapsulated cavity-filled PTFE seats and double-acting ISO 5211 pneumatic actuators. Calibrated on automated pneumatic test benches with digital cycle endurance counters and NAMUR limit switch feedback for automated processing skids.',
      specPill: 'ISO 5211 Direct Mount • Cavity-Filled PTFE • 100,000 Cycle Tested',
      productId: 'pneumatic-sanitary-ball-valve',
      videoSrc: '/assets/videos/homepage/pneumatic-valves-factory.mp4',
      videoSrcWebm: '/assets/videos/homepage/pneumatic-valves-factory.webm',
      poster: '/assets/videos/homepage/pneumatic-valves-factory-poster.webp',
      primaryProduct: 'pneumatic-sanitary-ball-valve'
    }
  ];

  const total = slides.length;
  const current = slides[activeSlide];

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

  // Master 8-Second Progression Timer
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

  // Reset video playback cleanly whenever activeSlide changes
  useEffect(() => {
    const video = videoPlayerRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
    setProgress(0);
  }, [activeSlide]);

  // Sync progress directly from video time for alignment
  const handleTimeUpdate = (e) => {
    if (isPaused) return;
    const v = e.currentTarget;
    if (v.duration > 0) {
      const syncPercent = (v.currentTime / v.duration) * 100;
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

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center bg-slate-950 text-white overflow-hidden select-none border-b border-slate-800 shadow-2xl"
      aria-label="Lotus Tubes Cinematic Product Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ========================================================================= */}
      {/* FULL-BLEED BACKGROUND ROTATING VIDEO STAGE WITH SMOOTH CROSSFADE          */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {slides.map((s, idx) => {
          const isCurrent = activeSlide === idx;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <video
                ref={isCurrent ? videoPlayerRef : null}
                key={s.videoSrcWebm}
                poster={s.poster}
                autoPlay={isCurrent}
                muted
                loop
                playsInline
                preload={isCurrent ? 'auto' : 'none'}
                onTimeUpdate={isCurrent ? handleTimeUpdate : undefined}
                onEnded={isCurrent ? handleVideoEnded : undefined}
                className={`w-full h-full object-cover md:object-cover md:object-right transition-transform duration-7000 ease-out ${
                  isCurrent ? 'scale-105' : 'scale-100'
                }`}
                aria-label={`${s.titleHighlight} 360 Product Video`}
              >
                <source src={s.videoSrcWebm} type="video/webm" />
                <source src={s.videoSrc} type="video/mp4" />
                <img src={s.poster} alt={s.titleHighlight} className="w-full h-full object-cover" />
              </video>
            </div>
          );
        })}

        {/* Cinematic Multi-Tier Gradient Overlays for High-Contrast Text Legibility */}
        {/* Left-to-right dark wash so text is crisp on the left while 360 video shines on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 sm:via-slate-950/75 to-slate-950/25 z-10" />
        {/* Top and bottom subtle vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 z-10" />
        {/* Subtle radial lighting accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent z-10 pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* SIDE NAVIGATION BUTTONS (LEFT & RIGHT) — INSPIRED BY HEX INDIA FASTENERS   */}
      {/* ========================================================================= */}
      {/* Left Navigation Chevron Button */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-3 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-900/60 hover:bg-sky-600 text-white backdrop-blur-md border border-white/20 hover:border-sky-400 shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer group"
        aria-label="Previous product slide"
        title="Previous Product"
      >
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      {/* Right Navigation Chevron Button */}
      <button
        type="button"
        onClick={handleNext}
        className="absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-900/60 hover:bg-sky-600 text-white backdrop-blur-md border border-white/20 hover:border-sky-400 shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer group"
        aria-label="Next product slide"
        title="Next Product"
      >
        <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* ========================================================================= */}
      {/* FOREGROUND HERO CONTENT: HIGH-IMPACT TYPOGRAPHY & TECHNICAL CALL-TO-ACTIONS */}
      {/* ========================================================================= */}
      <div className="site-container relative z-20 w-full py-20 sm:py-24 lg:py-28 pl-12 pr-12 sm:pl-16 sm:pr-16 lg:pl-20 lg:pr-20">
        <div
          className={`max-w-2xl lg:max-w-3xl transition-all duration-500 ${
            isTransitioning ? 'opacity-40 translate-x-1' : 'opacity-100 translate-x-0'
          }`}
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-sky-500/30 text-xs font-semibold tracking-wider text-sky-300 uppercase shadow-lg mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{current.badge}</span>
          </div>

          {/* Primary Semantic H1 for SEO */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-3 font-heading">
            Stainless Steel Sanitary Pipes, Fittings &amp; Valves
          </h1>

          {/* Dynamic Product Subheading */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-200 to-white tracking-normal mb-4">
            {current.titleHighlight} &mdash; Engineered for Hygienic Process Applications
          </h2>

          {/* Dynamic Technical Description */}
          <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed mb-8 max-w-xl">
            {current.desc}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mb-10">
            <a
              href="/products"
              className="btn btn--primary px-7 py-3.5 text-sm sm:text-base font-bold shadow-xl shadow-sky-500/30 flex items-center gap-2.5 rounded-xl hover:shadow-sky-500/50 transition-all"
            >
              <span>{t('btn_explore_products', 'Explore Products')}</span>
              <span>&rarr;</span>
            </a>

            <button
              type="button"
              onClick={() => onOpenEnquiry && onOpenEnquiry(current.primaryProduct, current.tabLabel)}
              className="btn btn--outline px-7 py-3.5 text-sm sm:text-base font-semibold border-white/30 text-white hover:bg-white/10 hover:border-white transition-all rounded-xl cursor-pointer backdrop-blur-sm"
            >
              {t('btn_request_quote', 'Request a Quote')}
            </button>

            <a
              href="https://wa.me/919820525200?text=Hello%20Lotus%20Tubes%2C%20I%20would%20like%20to%20enquire%20about%20sanitary%20stainless%20steel%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-700/50 hover:bg-emerald-900/60 transition-colors backdrop-blur-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>WhatsApp Desk</span>
            </a>
          </div>

          {/* 4 Trust & Metallurgy Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">💎</span>
              <div className="text-xs">
                <strong className="text-white block font-semibold">SS 304 / 316L</strong>
                <span className="text-slate-400">High-Purity Alloy</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xl">📦</span>
              <div className="text-xs">
                <strong className="text-white block font-semibold">Ready Stock</strong>
                <span className="text-slate-400">24-48h Dispatch</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xl">📜</span>
              <div className="text-xs">
                <strong className="text-white block font-semibold">EN 10204 3.1</strong>
                <span className="text-slate-400">Full Metallurgy MTC</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xl">⚡</span>
              <div className="text-xs">
                <strong className="text-white block font-semibold">Ra ≤ 0.38 µm</strong>
                <span className="text-slate-400">Mirror EP Finish</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM SUBSECTION INDICATOR PILLS WITH SYNCHRONIZED PROGRESS BARS         */}
      {/* (NO running seconds countdown, NO 01/04 numbers — clean, elegant UX)      */}
      {/* ========================================================================= */}
      <div className="absolute bottom-5 left-0 right-0 z-20 pointer-events-auto">
        <div className="site-container flex items-center justify-center sm:justify-start pl-4 sm:pl-16 lg:pl-20">
          <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700/60 shadow-xl overflow-x-auto max-w-full scrollbar-none">
            {slides.map((s, idx) => {
              const isActive = activeSlide === idx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`group relative flex flex-col items-start px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-sky-500/25 border-sky-400 text-sky-200 shadow-md ring-1 ring-sky-400/40'
                      : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  aria-selected={isActive}
                  aria-label={`View ${s.tabLabel}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        isActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600 group-hover:bg-slate-400'
                      }`}
                    />
                    <span className="truncate">{s.tabLabel}</span>
                  </div>

                  {/* Clean 8-second progress line under active tab */}
                  <div className="w-full h-0.5 bg-slate-700/80 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-75 ${
                        isActive ? 'bg-gradient-to-r from-sky-400 to-cyan-300' : idx < activeSlide ? 'bg-slate-500' : 'w-0'
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
        </div>
      </div>

    </section>
  );
};

export default HomeCinematicHero;
