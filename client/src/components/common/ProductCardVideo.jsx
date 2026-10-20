import React, { useRef, useEffect, useState } from 'react';

/**
 * ProductCardVideo
 * Renders a lightweight, looping, muted, inline video for product cards.
 * - Autoplays when in viewport using IntersectionObserver.
 * - Pauses when scrolled out of view to avoid unnecessary resource consumption.
 * - Keeps audio permanently muted.
 * - Fallbacks to static product poster image if video fails or autoplay is restricted.
 * - Respects prefers-reduced-motion.
 */
export const ProductCardVideo = ({ video, poster, alt = 'Sanitary Stainless Steel Component' }) => {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
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

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || prefersReducedMotion || hasError) return;

    // Use IntersectionObserver to play/pause video when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoEl.play().catch(() => {
              // Browser may restrict autoplay until user interaction; keep poster visible
            });
          } else {
            videoEl.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(videoEl);

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion, hasError, video]);

  if (!video || prefersReducedMotion || hasError) {
    return (
      <img
        src={poster}
        alt={alt}
        className="product-card__img"
        loading="lazy"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className="product-card__img product-card__video"
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      onError={() => setHasError(true)}
      aria-label={`${alt} - 360 degree product view`}
    >
      <source src={video} type="video/webm" />
      {/* Fallback to static image if video playback is unsupported */}
      <img src={poster} alt={alt} className="product-card__img" />
    </video>
  );
};

export default ProductCardVideo;
