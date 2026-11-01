import React, { useState, useRef, useEffect, useCallback } from 'react';
import ProductImage from './ProductImage.jsx';
import { getProduct360Media, has360Media } from '../../data/product360Media.js';

/**
 * Premium 360° Interactive Product Media Viewer
 *
 * Replaces the procedural 3D model viewer with a high-fidelity, lightweight 360° media experience:
 * 1. 360° Rotation Video: Continuous seamless rotation, muted autoplay, interactive play/pause,
 *    clean B2B UI, object-fit contain, and instant poster fallback.
 * 2. 360° Turntable Frame Sequence: Touch/mouse drag-to-rotate inspection for multi-angle photo assets.
 * 3. High-Resolution Studio Photography: Graceful fallback for products awaiting video renders.
 */
export const Product360Viewer = ({
  product,
  fallbackImage,
  height = '420px',
  className = '',
  autoPlay = true
}) => {
  const productId = product?.id || product?.slug;
  const media = getProduct360Media(productId);
  const primaryPoster =
    product?.image ||
    fallbackImage ||
    '/assets/images/products/pipes/electro-polished/ss-316l-electropolished-sanitary-tube-001.jpg';

  // =========================================================================
  // VIDEO VIEWER STATE & REFS
  // =========================================================================
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Sync video play state on mount or product change
  useEffect(() => {
    setVideoLoaded(false);
    setVideoError(false);
    setIsPlaying(autoPlay);

    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.currentTime = 0;
      if (autoPlay) {
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Browser autoplay policy restricted; stays paused on poster
              setIsPlaying(false);
            });
        }
      }
    }

    return () => {
      if (videoEl) {
        videoEl.pause();
      }
    };
  }, [productId, autoPlay]);

  const toggleVideoPlayback = useCallback(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setVideoError(true));
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  }, []);

  // =========================================================================
  // TURNTABLE FRAME SEQUENCE DRAG-TO-ROTATE STATE & REFS
  // =========================================================================
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFrameSpinning, setIsFrameSpinning] = useState(true);
  const dragStartXRef = useRef(0);
  const dragStartFrameRef = useRef(0);
  const containerRef = useRef(null);

  // Auto-spin frame sequence when idle
  useEffect(() => {
    if (media?.type !== 'frames' || !isFrameSpinning || isDragging) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % media.totalFrames);
    }, 80); // ~12 fps smooth rotation

    return () => clearInterval(interval);
  }, [media, isFrameSpinning, isDragging]);

  // Mouse / Touch Drag handlers for frame sequence
  const handleDragStart = (clientX) => {
    if (media?.type !== 'frames') return;
    setIsDragging(true);
    setIsFrameSpinning(false);
    dragStartXRef.current = clientX;
    dragStartFrameRef.current = currentFrameIndex;
  };

  const handleDragMove = (clientX) => {
    if (!isDragging || media?.type !== 'frames') return;
    const deltaX = clientX - dragStartXRef.current;
    const sensitivity = 8; // Pixels per frame step
    const frameOffset = Math.floor(deltaX / sensitivity);
    const newIndex =
      (dragStartFrameRef.current - frameOffset) % media.totalFrames;
    const normalizedIndex =
      newIndex >= 0 ? newIndex : newIndex + media.totalFrames;
    setCurrentFrameIndex(normalizedIndex);
  };

  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // =========================================================================
  // RENDER CASE 1: 360° ROTATION VIDEO
  // =========================================================================
  if (media?.type === 'video' && !videoError) {
    return (
      <div
        className={`relative w-full rounded-xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-950 select-none group ${className}`}
        style={{ minHeight: height, height }}
      >
        {/* Top Identification Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/70 shadow-sm text-xs font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wide">🔄 360° PRODUCT ROTATION</span>
          </div>
        </div>

        {/* Top-Right Material Spec Badge */}
        <div className="absolute top-3 right-3 z-20 hidden sm:flex items-center bg-slate-900/80 text-sky-300 text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-sm border border-slate-700/60 pointer-events-none">
          {product?.material || 'SS 316L'} • {product?.standard || 'Sanitary Grade'}
        </div>

        {/* Interactive Video Stage */}
        <div
          className="relative w-full h-full flex items-center justify-center cursor-pointer"
          onClick={toggleVideoPlayback}
          title={isPlaying ? 'Click to pause rotation' : 'Click to resume 360° rotation'}
        >
          <video
            ref={videoRef}
            src={media.src}
            poster={primaryPoster}
            loop
            muted
            playsInline
            autoPlay={autoPlay}
            preload="metadata"
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full max-h-full object-contain"
            style={{ maxHeight: height }}
          >
            Your browser does not support HTML5 video rotation.
          </video>

          {/* Loading Overlay */}
          {!videoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs pointer-events-none transition-opacity duration-300">
              <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Center Play Indicator when Paused */}
          {!isPlaying && videoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30 backdrop-blur-xs pointer-events-none transition-all">
              <div className="w-14 h-14 rounded-full bg-slate-900/80 border border-slate-600/80 flex items-center justify-center shadow-xl text-white text-xl pl-1">
                ▶
              </div>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleVideoPlayback();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-800 text-white text-xs font-semibold backdrop-blur-md border border-slate-700/70 shadow-sm transition-colors"
              aria-label={isPlaying ? 'Pause 360 rotation' : 'Play 360 rotation'}
            >
              <span>{isPlaying ? '⏸' : '▶'}</span>
              <span>{isPlaying ? 'Pause Rotation' : 'Rotate 360°'}</span>
            </button>
          </div>

          <div className="text-[11px] font-medium text-slate-300 bg-slate-900/75 px-2.5 py-1 rounded backdrop-blur-sm border border-slate-700/50">
            Seamless Loop • 360° Inspection
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER CASE 2: TURNTABLE FRAME SEQUENCE (DRAG-TO-ROTATE)
  // =========================================================================
  if (media?.type === 'frames') {
    const currentFrame =
      media.frames[currentFrameIndex] || media.poster || primaryPoster;

    return (
      <div
        ref={containerRef}
        className={`relative w-full rounded-xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-950 select-none cursor-grab active:cursor-grabbing group ${className}`}
        style={{ minHeight: height, height }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {/* Top Identification Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/70 shadow-sm text-xs font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="tracking-wide">🔄 360° DRAG TO ROTATE</span>
          </div>
        </div>

        {/* Top-Right Material Spec Badge */}
        <div className="absolute top-3 right-3 z-20 hidden sm:flex items-center bg-slate-900/80 text-sky-300 text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-sm border border-slate-700/60 pointer-events-none">
          Frame {currentFrameIndex + 1} of {media.totalFrames} • 10° Increments
        </div>

        {/* Main Turntable Image Stage */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <img
            src={currentFrame}
            alt={`${product?.name || 'Lotus Tubes Component'} - 360 view frame ${currentFrameIndex + 1}`}
            className="w-full h-full max-h-full object-contain pointer-events-none transition-none"
            style={{ maxHeight: height }}
            draggable={false}
          />
        </div>

        {/* Bottom Control Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFrameSpinning((prev) => !prev);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-800 text-white text-xs font-semibold backdrop-blur-md border border-slate-700/70 shadow-sm transition-colors"
            >
              <span>{isFrameSpinning ? '⏸' : '▶'}</span>
              <span>{isFrameSpinning ? 'Pause Auto-Spin' : 'Auto-Spin'}</span>
            </button>
          </div>

          <div className="text-[11px] font-medium text-slate-300 bg-slate-900/75 px-2.5 py-1 rounded backdrop-blur-sm border border-slate-700/50">
            Drag horizontally to rotate &bull; 360° Turntable
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER CASE 3: HIGH-RESOLUTION STUDIO PHOTOGRAPH FALLBACK
  // Used for products awaiting 360° rotation video renders
  // =========================================================================
  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-50 flex items-center justify-center p-6 ${className}`}
      style={{ minHeight: height, height }}
    >
      <ProductImage
        src={primaryPoster}
        alt={product?.name || 'Lotus Tubes Component Specification Photo'}
        aspectRatio="auto"
        className="w-full h-full max-h-full"
        imgClassName="max-h-[360px] object-contain"
        priority={true}
      />
      <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-sm border border-slate-700/50">
        High-Resolution Studio Photograph &bull; {product?.material || 'SS 316L'}
      </div>
    </div>
  );
};

export default Product360Viewer;
