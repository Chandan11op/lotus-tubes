import React, { useState, useEffect } from 'react';
import './loader.css';

/**
 * LOTUS TUBES - Unified Branded Animated Loader & Skeleton Suite
 *
 * Presentation Variants:
 * - 'branded': Full Lotus Tubes branded experience (Logo, dual rotating rings, progress glow)
 * - 'block': Container-sized branded loader for CRM views, tab transitions, and cards
 * - 'fullpage': Fixed fullscreen overlay with branded loader
 * - 'overlay': Absolute-positioned backdrop loader for forms and modals
 * - 'button': Compact inline spinner with text label for action buttons
 * - 'inline': Minimal inline SVG ring spinner
 * - 'skeleton-table': Realistic shimmer table rows for data views
 * - 'skeleton-kpi': Shimmer metric cards for CRM dashboard
 * - 'skeleton-cards': Shimmer card grid for product/catalogue views
 *
 * @param {Object} props
 * @param {'branded' | 'block' | 'fullpage' | 'overlay' | 'button' | 'inline' | 'skeleton-table' | 'skeleton-kpi' | 'skeleton-cards'} [props.variant='inline']
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {string} [props.label='Loading...']
 * @param {string} [props.sublabel='']
 * @param {string} [props.color='currentColor']
 * @param {number} [props.rows=6] - For skeleton-table
 * @param {number} [props.timeoutMs=6500] - Duration after which retry action is shown
 * @param {() => void} [props.onRetry] - Optional retry handler
 * @param {string} [props.className='']
 */
export const Loader = ({
  variant = 'inline',
  size = 'md',
  label = 'Loading...',
  sublabel = '',
  color = 'currentColor',
  rows = 6,
  timeoutMs = 6500,
  onRetry = null,
  className = ''
}) => {
  const [showRetry, setShowRetry] = useState(false);

  // Surface friendly retry prompt if loading takes longer than timeoutMs
  useEffect(() => {
    if (variant === 'button' || variant === 'inline') return;
    const timer = setTimeout(() => {
      setShowRetry(true);
    }, timeoutMs);
    return () => clearTimeout(timer);
  }, [timeoutMs, variant]);

  // ---------------------------------------------------------------------------
  // Variant: Button Spinner
  // ---------------------------------------------------------------------------
  if (variant === 'button') {
    return (
      <span
        role="status"
        aria-live="polite"
        className={`lotus-loader-button ${className}`}
      >
        <span
          className="lotus-loader-btn-spinner"
          style={{
            borderColor: color === 'currentColor' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(2, 132, 199, 0.25)',
            borderTopColor: color
          }}
          aria-hidden="true"
        />
        {label && <span className="lotus-loader-btn-label">{label}</span>}
        <span className="sr-only">{label || 'Processing action'}</span>
      </span>
    );
  }

  // ---------------------------------------------------------------------------
  // Variant: Minimal Inline SVG Spinner
  // ---------------------------------------------------------------------------
  if (variant === 'inline') {
    const dim = size === 'sm' ? 16 : size === 'lg' ? 32 : 22;
    const stroke = size === 'sm' ? 2.5 : size === 'lg' ? 3.5 : 3;
    const rad = (dim - stroke) / 2;
    const circ = 2 * Math.PI * rad;

    return (
      <span
        role="status"
        aria-live="polite"
        className={`lotus-loader-inline ${className}`}
        style={{ display: 'inline-flex', verticalAlign: 'middle' }}
      >
        <svg
          width={dim}
          height={dim}
          viewBox={`0 0 ${dim} ${dim}`}
          className="lotus-loader-inline-svg"
          aria-hidden="true"
        >
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={rad}
            fill="none"
            stroke="rgba(2, 132, 199, 0.18)"
            strokeWidth={stroke}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={rad}
            fill="none"
            stroke={color === 'currentColor' ? '#0284C7' : color}
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={circ * 0.65}
            strokeLinecap="round"
          />
        </svg>
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  // ---------------------------------------------------------------------------
  // Variant: Skeleton Shimmer Table (for CRM & public lists)
  // ---------------------------------------------------------------------------
  if (variant === 'skeleton-table') {
    const rowList = Array.from({ length: rows });
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={label || 'Loading table records'}
        className={`lotus-skeleton-table ${className}`}
      >
        {/* Table Header Shimmer */}
        <div className="lotus-skeleton-table__header">
          <div className="lotus-shimmer-base lotus-skeleton-table__header-cell" style={{ width: '18%' }} />
          <div className="lotus-shimmer-base lotus-skeleton-table__header-cell" style={{ width: '22%' }} />
          <div className="lotus-shimmer-base lotus-skeleton-table__header-cell" style={{ width: '20%' }} />
          <div className="lotus-shimmer-base lotus-skeleton-table__header-cell" style={{ width: '14%' }} />
          <div className="lotus-shimmer-base lotus-skeleton-table__header-cell" style={{ width: '12%' }} />
          <div className="lotus-shimmer-base lotus-skeleton-table__header-cell" style={{ width: '14%' }} />
        </div>

        {/* Shimmer Rows */}
        {rowList.map((_, i) => (
          <div key={i} className="lotus-skeleton-table__row">
            <div className="lotus-shimmer-base lotus-skeleton-table__cell" style={{ width: `${14 + (i % 3) * 4}%` }} />
            <div className="lotus-shimmer-base lotus-skeleton-table__cell" style={{ width: `${20 + (i % 4) * 3}%` }} />
            <div className="lotus-shimmer-base lotus-skeleton-table__cell" style={{ width: `${18 + (i % 2) * 5}%` }} />
            <div className="lotus-shimmer-base lotus-skeleton-table__cell" style={{ width: `${12 + (i % 3) * 3}%` }} />
            <div className="lotus-shimmer-base lotus-skeleton-table__cell" style={{ width: `${10 + (i % 2) * 4}%` }} />
            <div className="lotus-shimmer-base lotus-skeleton-table__cell" style={{ width: `${12 + (i % 3) * 2}%` }} />
          </div>
        ))}
        <span className="sr-only">{label || 'Loading table rows...'}</span>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Variant: Skeleton Shimmer KPI Metric Cards
  // ---------------------------------------------------------------------------
  if (variant === 'skeleton-kpi') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={label || 'Loading metrics'}
        className={`lotus-skeleton-kpi-grid ${className}`}
      >
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="lotus-skeleton-kpi-card">
            <div className="lotus-skeleton-kpi-top">
              <div className="lotus-shimmer-base lotus-skeleton-kpi-icon" />
              <div className="lotus-shimmer-base lotus-skeleton-kpi-badge" />
            </div>
            <div className="lotus-shimmer-base lotus-skeleton-kpi-value" />
            <div className="lotus-shimmer-base lotus-skeleton-kpi-label" />
          </div>
        ))}
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Variant: Skeleton Shimmer Cards Grid
  // ---------------------------------------------------------------------------
  if (variant === 'skeleton-cards') {
    const cardList = Array.from({ length: rows || 6 });
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={label || 'Loading catalogue items'}
        className={`lotus-skeleton-cards-grid ${className}`}
      >
        {cardList.map((_, idx) => (
          <div key={idx} className="lotus-skeleton-card">
            <div className="lotus-shimmer-base lotus-skeleton-card__media" />
            <div className="lotus-skeleton-card__body">
              <div className="lotus-shimmer-base lotus-skeleton-card__title" />
              <div className="lotus-shimmer-base lotus-skeleton-card__text" />
              <div className="lotus-skeleton-card__tags">
                <div className="lotus-shimmer-base lotus-skeleton-card__tag" />
                <div className="lotus-shimmer-base lotus-skeleton-card__tag" />
              </div>
            </div>
          </div>
        ))}
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Core Branded Loader Presentation
  // (Used for 'branded', 'block', 'fullpage', and 'overlay')
  // ---------------------------------------------------------------------------
  const brandedCore = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="lotus-loader-branded"
    >
      {/* Concentric Rings Frame */}
      <div className={`lotus-loader-ring-wrapper lotus-loader-ring-wrapper--${size}`}>
        {/* Soft Ambient Radial Glow */}
        <div className="lotus-loader-ambient-glow" aria-hidden="true" />

        {/* Outer Clockwise Gradient Orbit Ring */}
        <svg
          viewBox="0 0 100 100"
          className="lotus-loader-ring-svg lotus-loader-ring-outer"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lotusRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="1" />
              <stop offset="50%" stopColor="#0284C7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10263D" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#lotusRingGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="210"
            strokeDashoffset="65"
          />
        </svg>

        {/* Inner Counter-Clockwise Subtle Navy Orbit Ring */}
        <svg
          viewBox="0 0 100 100"
          className="lotus-loader-ring-svg lotus-loader-ring-inner"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="rgba(16, 38, 61, 0.14)"
            strokeWidth="2"
            strokeDasharray="6 8"
          />
        </svg>

        {/* Center Disc with Lotus Tubes Brand Icon */}
        <div className={`lotus-loader-logo-disc lotus-loader-logo-disc--${size}`}>
          <img
            src="/Lotus Tubes Logo.png"
            alt="Lotus Tubes"
            className="lotus-loader-logo-img"
          />
        </div>
      </div>

      {/* Slim Cyan/Blue Progress Runner Track */}
      <div className="lotus-loader-progress-track" aria-hidden="true">
        <div className="lotus-loader-progress-bar" />
      </div>

      {/* Branded Status Text */}
      <div className="lotus-loader-text-wrap">
        <p className="lotus-loader-title">{label}</p>
        {sublabel ? (
          <p className="lotus-loader-subtext">{sublabel}</p>
        ) : (
          <p className="lotus-loader-subtext">Lotus Tubes Sanitary Engineering</p>
        )}
      </div>

      {/* Timeout Helper & Manual Retry Action */}
      {showRetry && (
        <button
          type="button"
          className="lotus-loader-retry-btn"
          onClick={() => {
            setShowRetry(false);
            if (onRetry) {
              onRetry();
            } else if (typeof window !== 'undefined') {
              window.location.reload();
            }
          }}
          title="Click to retry loading records"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span>Taking longer than expected? Click to Retry</span>
        </button>
      )}

      <span className="sr-only">{label}</span>
    </div>
  );

  // Variant: Block (In-Page Container / CRM content / Card)
  if (variant === 'block' || variant === 'branded') {
    return (
      <div className={`lotus-loader-block ${className}`}>
        {brandedCore}
      </div>
    );
  }

  // Variant: Fullpage Fixed Overlay
  if (variant === 'fullpage') {
    return (
      <div className={`lotus-loader-fullpage ${className}`}>
        {brandedCore}
      </div>
    );
  }

  // Variant: Overlay (Container relative overlay)
  if (variant === 'overlay') {
    return (
      <div className={`lotus-loader-overlay ${className}`}>
        {brandedCore}
      </div>
    );
  }

  return brandedCore;
};

/**
 * Top Viewport Route Transition Progress Bar
 * Rendered at the top of App.jsx for seamless, flicker-free navigation feedback.
 */
export const RouteProgressBar = ({ isNavigating = false }) => {
  if (!isNavigating) return null;
  return (
    <div
      role="progressbar"
      aria-label="Navigating route"
      aria-valuemin="0"
      aria-valuemax="100"
      className="lotus-route-progressbar"
    >
      <div className="lotus-route-progressbar__runner" />
    </div>
  );
};

export default Loader;
