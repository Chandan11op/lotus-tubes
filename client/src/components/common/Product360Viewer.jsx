import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * LOTUS TUBES - Interactive 360° Product Video Viewer & Cinematic Showcase
 *
 * Capabilities:
 * - Dual Mode: Interactive 360° Orbit (drag-to-scrub) & 10s Cinematic Showcase
 * - Tactile horizontal drag scrubbing for mouse and mobile touch
 * - Velocity dampening and smooth auto-rotate resumption
 * - HTML5 Fullscreen API integration
 * - Speed controls (0.5x, 1.0x, 1.5x)
 * - Muted autoplay compliant with modern browser autoplay policies
 * - Fully responsive with zero layout shift
 */
export const Product360Viewer = ({
  video360,
  video360Webm,
  videoShowcase,
  poster,
  productName = 'Sanitary Stainless Steel Component',
  category = 'Sanitary Fittings',
  className = ''
}) => {
  const [activeMode, setActiveMode] = useState('360'); // '360' | 'showcase'
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDragHint, setShowDragHint] = useState(true);

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);
  const resumeTimerRef = useRef(null);

  // Auto-play when in viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playbackSpeed;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isDragging) {
            video.play().catch(() => {});
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [activeMode, isDragging, playbackSpeed]);

  // Handle Fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // ---------------------------------------------------------------------------
  // HORIZONTAL DRAG SCRUBBING ENGINE (Mouse & Touch)
  // ---------------------------------------------------------------------------
  const handleDragStart = (clientX) => {
    const video = videoRef.current;
    if (!video || activeMode !== '360') return;

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);

    setIsDragging(true);
    setHasInteracted(true);
    setShowDragHint(false);

    video.pause();
    setIsPlaying(false);

    dragStartX.current = clientX;
    dragStartTime.current = video.currentTime || 0;
  };

  const handleDragMove = (clientX) => {
    if (!isDragging || activeMode !== '360') return;
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const duration = video.duration || 3.0;
    const width = container.clientWidth || 600;
    const deltaX = clientX - dragStartX.current;

    // Moving left rotates left, moving right rotates right
    // Standard sensitivity: dragging full container width scrubs 1 full revolution (360°)
    const scrubOffset = (deltaX / width) * duration;
    let targetTime = (dragStartTime.current + scrubOffset) % duration;
    if (targetTime < 0) targetTime += duration;

    video.currentTime = targetTime;
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // After user releases drag, resume smooth auto-rotation after 800ms
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      const video = videoRef.current;
      if (video && activeMode === '360') {
        video.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 800);
  };

  // Mouse handlers
  const onMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const onMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault();
      handleDragMove(e.clientX);
    }
  };

  const onMouseUp = () => handleDragEnd();

  // Touch handlers
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX);
    }
  };

  const onTouchMove = (e) => {
    if (isDragging && e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX);
    }
  };

  const onTouchEnd = () => handleDragEnd();

  // Controls Actions
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.5, 0.5];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Switch between 360 rotation and 10s cinematic showcase
  const selectMode = (mode) => {
    setActiveMode(mode);
    setIsDragging(false);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const currentVideoSrc = activeMode === '360'
    ? (video360Webm || video360)
    : (videoShowcase || video360);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] bg-white rounded-2xl overflow-hidden select-none border border-slate-200 shadow-sm flex flex-col justify-between ${className}`}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ cursor: activeMode === '360' ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      aria-label={`Interactive 360 viewer for ${productName}`}
    >
      {/* 1. TOP DUAL-MODE TOGGLE TABS */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Mode Selector Pill */}
        <div className="inline-flex p-1 bg-slate-900/85 backdrop-blur-md rounded-xl shadow-lg border border-slate-700/50 pointer-events-auto">
          <button
            type="button"
            onClick={() => selectMode('360')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeMode === '360'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            aria-pressed={activeMode === '360'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>360° Interactive Orbit</span>
          </button>

          {videoShowcase && (
            <button
              type="button"
              onClick={() => selectMode('showcase')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeMode === 'showcase'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              aria-pressed={activeMode === 'showcase'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
              </svg>
              <span>Cinematic Showcase (10s)</span>
            </button>
          )}
        </div>

        {/* Live Status Pill */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 shadow-sm pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Stainless Steel 360° Studio</span>
        </div>
      </div>

      {/* 2. MAIN VIDEO VIEWING STAGE */}
      <div
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <video
          ref={videoRef}
          key={currentVideoSrc}
          src={currentVideoSrc}
          poster={poster}
          playsInline
          muted
          loop={activeMode === '360'}
          autoPlay
          className="max-h-[460px] w-full h-full object-contain pointer-events-none"
          onEnded={() => {
            if (activeMode === 'showcase') setIsPlaying(false);
          }}
        />

        {/* Tactile Drag Hint Overlay (fades out upon first drag) */}
        {activeMode === '360' && showDragHint && !hasInteracted && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce">
              <span>⟵ Drag to rotate 360° ⟶</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM FLOATING CONTROLS BAR */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Action: Play / Pause & Speed */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/50 text-white shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={togglePlayPause}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-white"
            title={isPlaying ? 'Pause Rotation' : 'Auto Rotate'}
            aria-label={isPlaying ? 'Pause Rotation' : 'Auto Rotate'}
          >
            {isPlaying ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          {activeMode === '360' && (
            <button
              type="button"
              onClick={cycleSpeed}
              className="px-2 py-1 hover:bg-slate-800 rounded-lg text-[11px] font-mono font-bold text-sky-400 transition-colors"
              title="Change rotation speed"
              aria-label="Change rotation speed"
            >
              {playbackSpeed}x
            </button>
          )}
        </div>

        {/* Center Prompt / Category */}
        <div className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium bg-white/80 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm pointer-events-auto">
          <span>{category}</span>
          <span>•</span>
          <span>Hygienic Finish</span>
        </div>

        {/* Right Action: Fullscreen */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/50 text-white shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-white"
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          >
            {isFullscreen ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product360Viewer;
