import React, { useEffect, useRef, useState } from 'react';

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export const TurnstileWidget = ({ onVerify, onExpire, onError, resetKey }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [loadError, setLoadError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Retrieve configured site key
  const siteKey =
    import.meta.env.VITE_TURNSTILE_SITE_KEY ||
    import.meta.env.VITE_SITE_KEY ||
    import.meta.env.SITE_KEY ||
    '0x4AAAAAAFe8O8egnFRqONZd';

  useEffect(() => {
    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.turnstile) return;

      // Clean up previous widget if exists
      if (widgetIdRef.current !== null) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore
        }
        widgetIdRef.current = null;
      }

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => {
            if (isMounted) {
              setLoadError(null);
              if (onVerify) onVerify(token);
            }
          },
          'expired-callback': () => {
            if (isMounted) {
              if (onExpire) onExpire();
            }
          },
          'error-callback': (code) => {
            if (isMounted) {
              console.warn('Turnstile widget returned error code:', code);
              setLoadError('Security verification failed. Please try again.');
              if (onError) onError(code);
            }
          },
          theme: 'light',
          size: 'flexible'
        });
        widgetIdRef.current = id;
        setIsReady(true);
      } catch (err) {
        console.warn('Error rendering Turnstile widget:', err);
        if (isMounted) {
          setLoadError('Failed to initialize security verification.');
        }
      }
    };

    // Ensure Cloudflare Turnstile script is loaded
    if (window.turnstile) {
      renderWidget();
    } else {
      let script = document.querySelector(`script[src^="${TURNSTILE_SCRIPT_URL}"]`);
      if (!script) {
        script = document.createElement('script');
        script.src = TURNSTILE_SCRIPT_URL;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.turnstile) {
            renderWidget();
          }
        };
        script.onerror = () => {
          if (isMounted) {
            setLoadError('Could not load Cloudflare security verification. Please check your internet connection and retry.');
          }
        };
        document.head.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if (window.turnstile) {
            clearInterval(checkInterval);
            renderWidget();
          }
        }, 100);
        setTimeout(() => clearInterval(checkInterval), 10000);
      }
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, resetKey]);

  const handleRetry = () => {
    setLoadError(null);
    if (widgetIdRef.current !== null && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className="turnstile-wrapper" style={{ margin: '14px 0', minHeight: '65px' }}>
      <div
        ref={containerRef}
        id="cf-turnstile-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '65px'
        }}
      />

      {loadError && (
        <div
          className="turnstile-error"
          style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '6px',
            padding: '10px 14px',
            marginTop: '8px',
            fontSize: '13px',
            color: '#B91C1C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          <span>⚠️ {loadError}</span>
          <button
            type="button"
            onClick={handleRetry}
            className="btn btn--sm btn--outline-dark"
            style={{ padding: '4px 10px', fontSize: '12px' }}
          >
            Retry Check
          </button>
        </div>
      )}
    </div>
  );
};

export default TurnstileWidget;
