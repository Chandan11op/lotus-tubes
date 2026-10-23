import React, { useState, useRef } from 'react';

/**
 * Accessible Video Viewer for Technical Overviews & Process Visualizations
 * Supports custom controls, mobile responsiveness, and clear distinction between genuine test footage vs illustrative 3D models.
 */
export const ProductVideoPlayer = ({
  src,
  poster,
  title = 'Sanitary Component Video Inspection',
  isIllustrative = false,
  captionsSrc = null
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackError, setPlaybackError] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setPlaybackError(true));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div
      className="product-video-wrapper"
      style={{
        position: 'relative',
        background: '#0B132B',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #1E293B',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
      }}
    >
      {/* Illustrative vs Real Asset Badge */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 10,
          background: isIllustrative ? 'rgba(217, 119, 6, 0.9)' : 'rgba(2, 132, 199, 0.9)',
          color: '#FFFFFF',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.5px'
        }}
      >
        {isIllustrative ? '📐 3D PROCESS VISUALIZATION (ILLUSTRATIVE)' : '📹 TECHNICAL INSPECTION VIDEO'}
      </div>

      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
        <video
          ref={videoRef}
          src={src || '/assets/videos/pipes-360-sample.webm'}
          poster={poster || '/assets/images/products/pipes/ss-316l-ep-pipe.svg'}
          playsInline
          muted={isMuted}
          controls
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => setPlaybackError(true)}
        >
          {captionsSrc && (
            <track kind="captions" src={captionsSrc} srcLang="en" label="English Captions" default />
          )}
          Your browser does not support HTML5 video playback.
        </video>
      </div>

      {/* Footer Disclaimer & Context */}
      <div
        style={{
          padding: '12px 16px',
          background: '#0F172A',
          borderTop: '1px solid #1E293B',
          fontSize: '12px',
          color: '#94A3B8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div>
          <strong style={{ color: '#F1F5F9' }}>{title}</strong>
          {isIllustrative ? (
            <span style={{ display: 'block', fontSize: '11px', color: '#D97706', marginTop: '2px' }}>
              Notice: Illustrative process model depicting internal fluid laminar flow and weld bead finishing. Not an owned factory representation.
            </span>
          ) : (
            <span style={{ display: 'block', fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Lotus Tubes verification: Surface roughness measurement and cleanliness inspection.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductVideoPlayer;
