import React, { useState, useEffect, useRef } from 'react';

/**
 * Interactive 360-Degree Product Inspection Viewer
 * Renders a circular image frame sequence with drag-to-rotate, auto-spin, zoom, and graceful fallback
 */
export const Product360Viewer = ({ product, fallbackImage, totalFrames = 24 }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasFramesError, setHasFramesError] = useState(false);
  const containerRef = useRef(null);

  // Generate synthetic sequence from product SVGs/assets or photographic frame sequence
  const frames = Array.from({ length: totalFrames }, (_, i) => {
    // If product has dedicated 360 image folder:
    if (product?.view360Folder) {
      return `/assets/images/360/${product.view360Folder}/frame_${String(i + 1).padStart(2, '0')}.webp`;
    }
    // High-fidelity fallback to product multi-angle SVG / image asset
    return product?.image || fallbackImage || '/assets/images/products/pipes/ss-316l-ep-pipe.svg';
  });

  // Auto-spin animation
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
      }, 90);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalFrames]);

  // Mouse / Touch handlers for 360 rotation
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setIsPlaying(false);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    setStartX(clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const diff = clientX - startX;
    const threshold = 12; // pixels per frame rotation step

    if (Math.abs(diff) > threshold) {
      const steps = Math.floor(diff / threshold);
      setCurrentFrame((prev) => {
        let next = (prev - steps) % totalFrames;
        if (next < 0) next += totalFrames;
        return next;
      });
      setStartX(clientX);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const rotationDegrees = Math.round((currentFrame / totalFrames) * 360);

  return (
    <div
      ref={containerRef}
      className={`product-360-container ${isFullscreen ? 'fullscreen' : ''}`}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #334155',
        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
        userSelect: 'none',
        touchAction: 'none'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Header Badge */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          left: '16px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span
          style={{
            background: 'rgba(2, 132, 199, 0.9)',
            color: '#FFFFFF',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span>🔄</span> 360° COMPONENT INSPECTION
        </span>
        <span style={{ color: '#94A3B8', fontSize: '11px', background: 'rgba(15,23,42,0.8)', padding: '4px 8px', borderRadius: '4px' }}>
          {rotationDegrees}° Angle &bull; Frame {currentFrame + 1}/{totalFrames}
        </span>
      </div>

      {/* Main Image Stage */}
      <div
        style={{
          width: '100%',
          height: isFullscreen ? '85vh' : '420px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          position: 'relative',
          padding: '24px'
        }}
      >
        <img
          src={frames[currentFrame]}
          alt={`${product?.name || 'Sanitary Component'} - 360 view frame ${currentFrame + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transform: `scale(${zoomLevel}) rotate(${product?.view360Folder ? 0 : (currentFrame * 360) / totalFrames}deg)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease',
            filter: 'drop-shadow(0 16px 24px rgba(0,0,0,0.35))'
          }}
          onError={() => setHasFramesError(true)}
          draggable={false}
        />

        {/* Drag Hint Overlay */}
        {!isDragging && !isPlaying && (
          <div
            style={{
              position: 'absolute',
              bottom: '50px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid #475569',
              color: '#F8FAFC',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11px',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            <span>&larr; Drag horizontally to inspect &rarr;</span>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1px solid #334155',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? '#EF4444' : '#0284C7',
              color: '#FFF',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isPlaying ? '⏸ Pause Spin' : '▶ Auto Rotate'}
          </button>

          <button
            type="button"
            onClick={() => setCurrentFrame((prev) => (prev - 1 + totalFrames) % totalFrames)}
            style={{
              background: '#334155',
              color: '#FFF',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
            title="Step Previous Frame"
          >
            &lt; Step
          </button>

          <button
            type="button"
            onClick={() => setCurrentFrame((prev) => (prev + 1) % totalFrames)}
            style={{
              background: '#334155',
              color: '#FFF',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
            title="Step Next Frame"
          >
            Step &gt;
          </button>
        </div>

        {/* Zoom & Fullscreen Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#94A3B8', fontSize: '11px' }}>Zoom:</span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
            disabled={zoomLevel <= 1}
            style={{
              background: '#334155',
              color: '#FFF',
              border: 'none',
              width: '26px',
              height: '26px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            -
          </button>
          <span style={{ color: '#F1F5F9', fontSize: '12px', minWidth: '38px', textAlign: 'center' }}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
            disabled={zoomLevel >= 2.5}
            style={{
              background: '#334155',
              color: '#FFF',
              border: 'none',
              width: '26px',
              height: '26px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            +
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            style={{
              background: '#1E293B',
              border: '1px solid #475569',
              color: '#F8FAFC',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            {isFullscreen ? 'Exit Fullscreen' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {/* Verification Notice */}
      <div
        style={{
          background: '#0B132B',
          padding: '6px 16px',
          fontSize: '10px',
          color: '#64748B',
          borderTop: '1px solid #1E293B',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <span>🛡️ Genuine verified product geometry &bull; Lotus Tubes Mumbai Quality Inspection</span>
        <span>Standard: {product?.standard || 'ASTM A270'}</span>
      </div>
    </div>
  );
};

export default Product360Viewer;
