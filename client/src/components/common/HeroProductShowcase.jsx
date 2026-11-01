import React, { useState, useRef } from 'react';
import ProductImage from './ProductImage.jsx';

/**
 * HeroProductShowcase
 * High-performance Hero section media showcase for Lotus Tubes.
 * Replaces the heavy WebGL 3D model canvas with:
 * - 360° Interactive Video Rotation (using genuine rendered rotation videos)
 * - Master High-Resolution Studio Line Showcase
 */
export const HeroProductShowcase = () => {
  const [activeMode, setActiveMode] = useState('360'); // '360' | 'master'
  const [activeVideo, setActiveVideo] = useState('butterfly'); // 'butterfly' | 'clamp'
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const videoSources = {
    butterfly: {
      src: '/assets/videos/ss-butterfly-valves.mp4',
      poster: '/assets/images/products/valves/butterfly-valves/ss-sanitary-butterfly-valve-001.jpg',
      title: 'SS Sanitary Butterfly Valve',
      spec: 'Tri-Clamp & Weld Ends • Silicone / EPDM Seal',
      grade: 'SS 316L Mirror EP'
    },
    clamp: {
      src: '/assets/videos/ss-pipe-holder.mp4',
      poster: '/assets/images/products/accessories/pipe-holders/ss-sanitary-pipe-hanger-clamp-007.jpg',
      title: 'SS Sanitary Pipe Holder / Heavy Duty Clamp',
      spec: 'Precision Forged & Polished • Tool-Free Closure',
      grade: 'SS 304 High-Pressure'
    }
  };

  const currentVideo = videoSources[activeVideo];

  const togglePlayback = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (videoEl.paused) {
      videoEl.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="hero-3d-card relative w-full h-[380px] sm:h-[440px] md:h-[500px] lg:h-[580px] xl:h-[620px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#10263d] to-slate-950 border border-slate-700/60 shadow-2xl flex flex-col">
      {/* Top Floating Badge & Specs */}
      <div className="absolute top-3.5 left-3.5 right-3.5 sm:top-4 sm:left-4 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-slate-700/70 text-left pointer-events-auto max-w-[80%] sm:max-w-none shadow-lg">
          <div className="text-[10.5px] sm:text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {activeMode === '360' ? '360° Product Rotation' : 'Master Studio Showcase'}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate">
            {activeMode === '360' ? currentVideo.title : 'Complete Sanitary Product Line'}
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/85 backdrop-blur-md p-1 rounded-lg border border-slate-700/70 shadow-lg">
          <button
            type="button"
            onClick={() => setActiveMode('360')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeMode === '360'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🔄 360° Video
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('master')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeMode === 'master'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            📷 Studio Line
          </button>
        </div>
      </div>

      {/* Main Display Stage */}
      {activeMode === '360' ? (
        <div
          className="relative w-full h-full flex items-center justify-center cursor-pointer select-none"
          onClick={togglePlayback}
          title={isPlaying ? 'Click to pause rotation' : 'Click to resume 360° rotation'}
        >
          <video
            ref={videoRef}
            key={activeVideo}
            src={currentVideo.src}
            poster={currentVideo.poster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-contain p-4 sm:p-8"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Pause overlay icon */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30 backdrop-blur-xs pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-slate-900/80 border border-slate-600/80 flex items-center justify-center shadow-xl text-white text-xl pl-1">
                ▶
              </div>
            </div>
          )}

          {/* Bottom Controls Bar */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
            {/* Play/Pause Button */}
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayback();
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-800 text-white text-xs font-semibold backdrop-blur-md border border-slate-700/70 shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span>{isPlaying ? '⏸' : '▶'}</span>
                <span>{isPlaying ? 'Pause' : 'Rotate'}</span>
              </button>

              {/* Product toggle between Butterfly Valve and Pipe Holder */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveVideo(activeVideo === 'butterfly' ? 'clamp' : 'butterfly');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium backdrop-blur-md border border-slate-700/60 shadow-sm transition-colors"
              >
                Switch to {activeVideo === 'butterfly' ? 'Pipe Clamp' : 'Butterfly Valve'} &rarr;
              </button>
            </div>

            <div className="hidden sm:block text-[11px] font-medium text-slate-300 bg-slate-900/75 px-2.5 py-1 rounded backdrop-blur-sm border border-slate-700/50">
              {currentVideo.grade} &bull; {currentVideo.spec}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center p-6 bg-slate-950">
          <ProductImage
            src="/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-005.jpg"
            alt="Lotus Tubes Complete Stainless Steel Sanitary Product Showcase"
            aspectRatio="auto"
            className="w-full h-full max-h-full"
            imgClassName="max-h-[520px] object-contain"
            priority={true}
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="hero-spec-pill bg-slate-900/85 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-md border border-slate-700/70">
              <strong>SS 316L EP</strong> &bull; Ra &le; 0.38 &mu;m &bull; ASTM A270 &amp; ASME BPE Certified
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroProductShowcase;

