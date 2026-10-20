import React from 'react';

export const Toast = ({ toasts = [], onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" id="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast--${t.type || 'info'}`}
          style={{
            background: t.type === 'success' ? '#10B981' : t.type === 'error' ? '#EF4444' : '#10263D',
            color: '#FFFFFF',
            padding: '12px 18px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '14px',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <span>{t.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '16px',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
