import React from 'react';

/**
 * Enterprise CRM Loader & Skeleton Component Suite
 * Lightweight, zero external image dependencies, high performance.
 */

export const CRMLoaderSpinner = ({ size = 20, color = 'var(--crm-primary, #0284C7)', className = '' }) => (
  <span
    role="status"
    aria-label="Loading"
    className={`crm-loader-spinner ${className}`}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size
    }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'crm-spin 0.75s linear infinite' }}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeOpacity="0.2"
        strokeWidth="2.5"
      />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  </span>
);

export const CRMSkeletonKpi = ({ count = 4 }) => (
  <div className="crm-skeleton-kpi-grid">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="crm-skeleton-kpi-card crm-shimmer">
        <div className="crm-skeleton-line crm-skeleton-line--sm" style={{ width: '40%' }} />
        <div className="crm-skeleton-line crm-skeleton-line--lg" style={{ width: '65%', margin: '14px 0' }} />
        <div className="crm-skeleton-line crm-skeleton-line--xs" style={{ width: '80%' }} />
      </div>
    ))}
  </div>
);

export const CRMSkeletonTable = ({ rows = 6, cols = 5 }) => (
  <div className="crm-skeleton-table-wrapper crm-shimmer">
    <div className="crm-skeleton-table-header">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="crm-skeleton-line crm-skeleton-line--sm" style={{ width: `${60 + (i % 3) * 15}%` }} />
      ))}
    </div>
    <div className="crm-skeleton-table-body">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="crm-skeleton-table-row">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="crm-skeleton-line crm-skeleton-line--md"
              style={{ width: `${50 + ((r + c) % 4) * 12}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const CRMSkeletonCard = ({ count = 3 }) => (
  <div className="crm-skeleton-cards-grid">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="crm-skeleton-card crm-shimmer">
        <div className="crm-skeleton-line crm-skeleton-line--md" style={{ width: '50%' }} />
        <div className="crm-skeleton-line crm-skeleton-line--sm" style={{ width: '75%', marginTop: '8px' }} />
        <div style={{ margin: '16px 0', height: '80px', borderRadius: '6px', background: 'rgba(226, 232, 240, 0.6)' }} />
        <div className="crm-skeleton-line crm-skeleton-line--xs" style={{ width: '35%' }} />
      </div>
    ))}
  </div>
);

export const CRMPageLoading = ({ label = 'Syncing CRM Data...', sublabel = 'Connecting to Lotus Tubes enterprise services', onRetry }) => (
  <div className="crm-page-loading-state" role="status">
    <div className="crm-loading-emblem-wrap">
      <div className="crm-loading-pulse-ring" />
      <div className="crm-loading-brand-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
    </div>
    <h3 className="crm-loading-title">{label}</h3>
    {sublabel && <p className="crm-loading-subtitle">{sublabel}</p>}
    <CRMLoaderSpinner size={24} color="#0284C7" className="crm-mt-3" />
    {onRetry && (
      <button type="button" onClick={onRetry} className="crm-btn crm-btn-outline crm-mt-4">
        Retry Connection
      </button>
    )}
  </div>
);
