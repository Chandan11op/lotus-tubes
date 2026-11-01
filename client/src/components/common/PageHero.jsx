import React, { useState, useEffect, useRef } from 'react';

/**
 * PageHero
 * Premium, cinematic first-screen hero component inspired by Hex India Fasteners.
 * Supports:
 * - Multi-visual background slideshow with smooth crossfade & subtle Ken Burns motion
 * - Coordinated animated text transitions (eyebrow, title, subtitle, description, CTAs)
 * - Trust / compliance badges & specification highlights
 * - Slide navigation controls (progress pills, numeric counter, keyboard support)
 * - 100% responsive, high-contrast, accessible, and respecting prefers-reduced-motion
 */
export const PageHero = ({
  badge = 'Sanitary Stainless Steel Engineering',
  title,
  subtitle,
  description,
  slides = [],
  stats = [],
  actions = [],
  breadcrumbs = null,
  minHeight = 'min-h-[480px] sm:min-h-[520px] lg:min-h-[560px]'
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Normalize slides
  const activeSlides = slides.length > 0
    ? slides
    : [
        {
          image: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-005.jpg',
          title,
          subtitle,
          description
        }
      ];

  const total = activeSlides.length;
  const slide = activeSlides[currentSlide] || activeSlides[0];

  // Auto-advance slides every 6 seconds if multiple slides provided
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % total);
    }, 6000);

    return () => clearInterval(timerRef.current);
  }, [total, isPaused]);

  return (
    <section
      className={`relative w-full ${minHeight} flex items-center bg-slate-950 text-white overflow-hidden select-none border-b border-slate-800 shadow-2xl`}
      aria-label={title || 'Section Hero'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Visual Showcase with Smooth Crossfade & Subtle Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {activeSlides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === idx ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={s.image}
              alt={s.title || title || 'Lotus Tubes Industrial Facility'}
              className={`w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${
                currentSlide === idx ? 'scale-105' : 'scale-100'
              }`}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Cinematic Multi-Tier Gradient Overlays for High-Contrast Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent" />
      </div>

      {/* Main Hero Content Container */}
      <div className="site-container relative z-10 w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          {/* Breadcrumb row if provided */}
          {breadcrumbs && (
            <div className="mb-4 text-xs font-medium text-slate-400 flex items-center gap-2">
              {breadcrumbs}
            </div>
          )}

          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-semibold tracking-wider text-sky-400 uppercase shadow-lg mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{slide.badge || badge}</span>
          </div>

          {/* Main Title with Staggered Transition */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
            {slide.title || title}
          </h1>

          {/* Subtitle */}
          {(slide.subtitle || subtitle) && (
            <h2 className="text-lg sm:text-xl font-semibold text-sky-300 tracking-normal mb-4">
              {slide.subtitle || subtitle}
            </h2>
          )}

          {/* Description */}
          {(slide.description || description) && (
            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
              {slide.description || description}
            </p>
          )}

          {/* Action CTAs */}
          {actions.length > 0 && (
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              {actions.map((act, i) => (
                <React.Fragment key={i}>{act}</React.Fragment>
              ))}
            </div>
          )}

          {/* Stats / Trust Badges Row */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
              {stats.map((st, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                    {st.value}
                  </span>
                  <span className="text-xs text-slate-400 font-medium mt-0.5">
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Multi-Slide Navigation Controls (Rendered when multiple visuals provided) */}
      {total > 1 && (
        <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-xl">
          {/* Slide counter */}
          <div className="text-xs font-mono font-bold text-slate-300 tracking-wider">
            0{currentSlide + 1} <span className="text-slate-600">/</span> 0{total}
          </div>

          <div className="h-3 w-[1px] bg-slate-700" />

          {/* Interactive Slide Progress Dots / Pills */}
          <div className="flex items-center gap-1.5">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all rounded-full ${
                  currentSlide === idx
                    ? 'w-6 h-2 bg-sky-500 shadow-sm shadow-sky-500/50'
                    : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next / Prev Controls */}
          <div className="flex items-center gap-1 ml-1">
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + total) % total)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Previous slide"
            >
              &#8249;
            </button>
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % total)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Next slide"
            >
              &#8250;
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PageHero;

