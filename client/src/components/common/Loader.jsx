import React from 'react';

/**
 * Reusable Loading Indicator Component
 *
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Dimensions of the spinner
 * @param {'inline' | 'button' | 'overlay' | 'fullpage'} [props.variant='inline'] - Presentation variant
 * @param {string} [props.label='Loading...'] - Accessible label for screen readers
 * @param {string} [props.color='var(--primary-blue, #0284C7)'] - Accent color for the spinner ring
 * @param {string} [props.className=''] - Additional CSS classes
 */
export const Loader = ({
  size = 'md',
  variant = 'inline',
  label = 'Loading...',
  color = '#0284C7',
  className = ''
}) => {
  const sizeMap = {
    sm: { diameter: 16, strokeWidth: 2.5 },
    md: { diameter: 24, strokeWidth: 3 },
    lg: { diameter: 38, strokeWidth: 3.5 }
  };

  const { diameter, strokeWidth } = sizeMap[size] || sizeMap.md;
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const spinnerSvg = (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center justify-center ${className}`}
      style={{ display: 'inline-flex', verticalAlign: 'middle' }}
    >
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        className="animate-spin"
        style={{
          animation: 'spin 0.85s linear infinite'
        }}
        aria-hidden="true"
      >
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="rgba(2, 132, 199, 0.2)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.65}
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>
        {label}
      </span>
    </div>
  );

  if (variant === 'button') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        {spinnerSvg}
        {label && <span style={{ fontSize: '0.9em' }}>{label}</span>}
      </span>
    );
  }

  if (variant === 'overlay') {
    return (
      <div
        className="loader-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.82)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          zIndex: 40,
          borderRadius: 'inherit',
          backdropFilter: 'blur(2px)'
        }}
      >
        {spinnerSvg}
        {label && (
          <p style={{ fontSize: '13px', color: '#667085', fontWeight: 500, margin: 0 }}>
            {label}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'fullpage') {
    return (
      <div
        className="loader-fullpage"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          zIndex: 9999
        }}
      >
        {spinnerSvg}
        <p style={{ fontSize: '15px', color: '#10263D', fontWeight: 600 }}>
          {label}
        </p>
      </div>
    );
  }

  return spinnerSvg;
};

export default Loader;
