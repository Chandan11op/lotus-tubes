import React, { useState } from 'react';
import { INLINE_SVG_FAILSAFE } from '../../utils/mediaFallback.js';

/**
 * Reusable Product Image Component for Lotus Tubes
 * Features:
 * - Proper aspect ratio container to prevent layout shift (CLS)
 * - Skeleton shimmer loading state
 * - Multi-stage error handling (primary -> fallback -> inline neutral SVG)
 * - Eager/High-priority mode for above-the-fold hero imagery
 * - Native lazy loading for below-the-fold catalogue cards
 * - Accessible descriptive alt text
 */
export default function ProductImage({
  src,
  alt = 'Lotus Tubes Stainless Steel Sanitary Component',
  fallbackSrc,
  aspectRatio = '4/3',
  className = '',
  imgClassName = '',
  priority = false,
  sizes,
  width,
  height,
  onClick
}) {
  const [loaded, setLoaded] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  // Normalize image source or provide safe default
  let currentSrc = src;
  if (errorCount === 1) {
    currentSrc = fallbackSrc || INLINE_SVG_FAILSAFE;
  } else if (errorCount >= 2) {
    currentSrc = INLINE_SVG_FAILSAFE;
  }

  const handleError = () => {
    setErrorCount(prev => prev + 1);
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <div
      className={`relative overflow-hidden bg-slate-50 flex items-center justify-center ${className}`}
      style={{ aspectRatio }}
      onClick={onClick}
    >
      {/* Loading Skeleton */}
      {!loaded && errorCount === 0 && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Actual Product Image */}
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-contain object-center transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />

      {/* Fallback Badge if fallback is active */}
      {errorCount > 0 && (
        <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none">
          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-white/90 backdrop-blur-sm rounded border border-slate-200 shadow-sm">
            Hygienic Component Visual
          </span>
        </div>
      )}
    </div>
  );
}
