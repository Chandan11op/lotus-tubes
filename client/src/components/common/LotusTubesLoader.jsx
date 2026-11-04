import React from 'react';
import './lotusLoader.css';

/**
 * LotusTubesLoader Component
 *
 * Implements the official Phase 2 Custom Branded Animated Logo Loader:
 * - Employs CSS clip-path bottom-to-top progressive reveal.
 * - Preserves the authentic 669x439 aspect ratio and dimensions of loader-image.png.
 * - Includes an architectural vector outline layer with stroke-dashoffset tracing animation.
 * - Seamlessly transitions between indeterminate reveal cycles and exact numerical progress.
 *
 * @param {Object} props
 * @param {'fullpage' | 'inline' | 'button' | 'modal'} [props.variant='inline']
 * @param {'sm' | 'md' | 'lg' | 'xl' | 'btn'} [props.size='md']
 * @param {number|null} [props.progress=null] - 0 to 100 or null for indeterminate
 * @param {string} [props.label='']
 * @param {string} [props.sublabel='']
 * @param {boolean} [props.showBrandTitle=false]
 * @param {string} [props.className='']
 */
export const LotusTubesLoader = ({
  variant = 'inline',
  size = 'md',
  progress = null,
  label = '',
  sublabel = '',
  showBrandTitle = false,
  className = ''
}) => {
  const isButton = variant === 'button';
  const resolvedSize = isButton ? 'btn' : size;
  const isDeterminate = typeof progress === 'number' && !isNaN(progress);
  const clampedProgress = isDeterminate ? Math.max(0, Math.min(100, Math.round(progress))) : null;

  // Calculate dynamic clip-path for determinate progress
  // At 10%: inset(90% 0 0 0); At 50%: inset(50% 0 0 0); At 100%: inset(0 0 0 0)
  const fillStyle = isDeterminate
    ? {
        clipPath: `inset(${100 - clampedProgress}% 0% 0% 0%)`,
        opacity: Math.max(0.2, clampedProgress / 100)
      }
    : undefined;

  const scanlineStyle = isDeterminate
    ? {
        top: `${100 - clampedProgress}%`,
        opacity: clampedProgress > 0 && clampedProgress < 100 ? 1 : 0
      }
    : undefined;

  const defaultLabel = isButton
    ? label || 'Processing request...'
    : label || 'Loading Lotus Tubes...';

  return (
    <div
      className={`lotus-loader-wrapper lotus-loader-wrapper--${variant} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label || 'Loading content'}
    >
      <div className={`lotus-loader-stage lotus-loader-stage--${resolvedSize}`}>
        {/* Layer 1: Background Silhouette Base */}
        <img
          src="/loader-image-opt.png"
          alt=""
          aria-hidden="true"
          className="lotus-loader-base-silhouette"
        />

        {/* Layer 2: Progressive Bottom-to-Top Revealed Image */}
        <img
          src="/loader-image.png"
          srcSet="/loader-image-opt.png 1x, /loader-image.png 2x"
          alt="Lotus Tubes Brand Icon"
          className={`lotus-loader-fill-layer ${!isDeterminate ? 'lotus-loader-fill-layer--animated' : ''}`}
          style={fillStyle}
        />

        {/* Layer 3: Ascending Laser / Scanline Marker at Reveal Boundary */}
        <div
          className="lotus-loader-scanline"
          aria-hidden="true"
          style={scanlineStyle}
        />

        {/* Layer 4: Architectural Vector Outline Overlay matching the Lotus Emblem */}
        <svg
          className="lotus-loader-outline-svg"
          viewBox="0 0 669 439"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Outer Contour Silhouette */}
          <path
            className="lotus-loader-outline-path"
            d="M334.5 18
               C320 60, 260 140, 205 180
               C150 220, 70 250, 18 275
               C50 330, 120 375, 210 395
               C260 405, 305 412, 334.5 415
               C364 412, 409 405, 459 395
               C549 375, 619 330, 651 275
               C599 250, 519 220, 464 180
               C409 140, 349 60, 334.5 18 Z"
          />

          {/* Central Petal Flange Accent */}
          <path
            className="lotus-loader-outline-path lotus-loader-outline-path--accent"
            d="M334.5 50
               C320 120, 280 220, 275 350
               C295 385, 315 400, 334.5 405
               C354 400, 374 385, 394 350
               C389 220, 349 120, 334.5 50 Z"
          />

          {/* Lateral Wing Petal Veins */}
          <path
            className="lotus-loader-outline-path"
            d="M210 185
               C180 230, 120 290, 85 340
               C135 365, 195 380, 255 385"
          />
          <path
            className="lotus-loader-outline-path"
            d="M459 185
               C489 230, 549 290, 584 340
               C534 365, 474 380, 414 385"
          />
        </svg>
      </div>

      {/* Button Variant Simple Inline Text */}
      {isButton && (
        <span className="lotus-loader-btn-label">{defaultLabel}</span>
      )}

      {/* Fullpage / Inline Metadata Block */}
      {!isButton && (
        <div className="lotus-loader-meta">
          {showBrandTitle && (
            <h3 className="lotus-loader-brand-title">Lotus Tubes</h3>
          )}
          {defaultLabel && (
            <p className="lotus-loader-label">{defaultLabel}</p>
          )}
          {sublabel && (
            <p className="lotus-loader-sublabel">{sublabel}</p>
          )}
          {isDeterminate && (
            <div className="lotus-loader-progress-track">
              <div
                className="lotus-loader-progress-fill"
                style={{ width: `${clampedProgress}%` }}
              />
            </div>
          )}
          {!isDeterminate && (
            <div className="lotus-loader-progress-track">
              <div className="lotus-loader-progress-fill lotus-loader-progress-fill--indeterminate" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LotusTubesLoader;

