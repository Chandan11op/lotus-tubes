import React, { useRef, useEffect, useState, useMemo } from 'react';
import { getFallbackChain } from '../../utils/mediaFallback';

/**
 * ProductCardVideo
 * Centralized, resilient product media component for product cards and catalogue grids.
 * - Handles inline video with autoplay in viewport (IntersectionObserver), muted, looping, playsInline.
 * - Gracefully falls back to visible product image if video fails, is missing, or is restricted.
 * - Implements multi-tier fallback for images with strict loop protection.
 * - Never leaves empty, black, or broken media area.
 */
export const ProductCardVideo = ({
  video,
  poster,
  alt = 'Sanitary Stainless Steel Component',
  categorySlug,
  className = 'product-card__img',
  has360 = true
}) => {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(!video);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Compute robust fallback chain [primary -> category -> universal -> inline svg]
  const fallbackChain = useMemo(
    () => getFallbackChain(poster, categorySlug, alt),
    [poster, categorySlug, alt]
  );

  const currentPoster = fallbackChain[fallbackIndex] || fallbackChain[fallbackChain.length - 1];

  // Motion preference listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMotionChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  // Viewport intersection observer for video playback
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || prefersReducedMotion || videoFailed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoEl.play().catch(() => {
              // Autoplay policy fallback: poster remains clean
            });
          } else {
            videoEl.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(videoEl);
    return () => observer.disconnect();
  }, [prefersReducedMotion, videoFailed, video]);

  // Handle image error safely along fallback chain
  const handleImageError = () => {
    if (fallbackIndex < fallbackChain.length - 1) {
      setFallbackIndex((idx) => idx + 1);
    }
  };

  const handleMouseEnter = () => {
    if (videoRef.current && !prefersReducedMotion && !videoFailed) {
      videoRef.current.play().catch(() => {});
    }
  };

  // If video is absent, failing, or user prefers reduced motion -> render safe image
  if (!video || prefersReducedMotion || videoFailed) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={currentPoster}
          alt={alt}
          className={className}
          loading="lazy"
          onError={handleImageError}
        />
        {has360 && (
          <span className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/30 shadow-sm flex items-center gap-1 z-10 pointer-events-none tracking-wide">
            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            360°
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      onMouseEnter={handleMouseEnter}
    >
      <video
        ref={videoRef}
        className={`${className} product-card__video`}
        poster={currentPoster}
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setVideoFailed(true)}
        aria-label={`${alt} - 360 Product Video`}
      >
        <source
          src={video}
          type={video.endsWith('.webm') ? 'video/webm' : 'video/mp4'}
          onError={() => setVideoFailed(true)}
        />
        {/* Fallback image inside video element if browser lacks HTML5 video */}
        <img
          src={currentPoster}
          alt={alt}
          className={className}
          onError={handleImageError}
        />
      </video>

      {/* Floating 360° indicator badge */}
      {has360 && (
        <span className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/30 shadow-sm flex items-center gap-1 z-10 pointer-events-none tracking-wide">
          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
          360°
        </span>
      )}
    </div>
  );
};

export default ProductCardVideo;
