import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  extractLangFromPath,
  localizePath,
  t as translate
} from '../i18n/index.js';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  // Initialize language from current URL pathname / hash, fallback to localStorage or 'en'
  const [currentLang, setCurrentLangState] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname || '';
      const hash = window.location.hash || '';
      const fromPath = extractLangFromPath(path).lang;
      if (fromPath !== DEFAULT_LANGUAGE) return fromPath;
      const fromHash = extractLangFromPath(hash).lang;
      if (fromHash !== DEFAULT_LANGUAGE) return fromHash;
      try {
        const stored = localStorage.getItem('lotus_lang');
        if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
          return stored;
        }
      } catch (e) {
        // ignore storage errors
      }
    }
    return DEFAULT_LANGUAGE;
  });

  const activeLangConfig = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  // Keep language in sync with browser navigation (popstate / hashchange)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncLangFromUrl = () => {
      const fromPath = extractLangFromPath(window.location.pathname).lang;
      const fromHash = extractLangFromPath(window.location.hash).lang;
      const targetLang = fromPath !== DEFAULT_LANGUAGE ? fromPath : fromHash;
      if (targetLang && targetLang !== currentLang && SUPPORTED_LANGUAGES.some((l) => l.code === targetLang)) {
        setCurrentLangState(targetLang);
      }
    };

    window.addEventListener('popstate', syncLangFromUrl);
    window.addEventListener('hashchange', syncLangFromUrl);
    return () => {
      window.removeEventListener('popstate', syncLangFromUrl);
      window.removeEventListener('hashchange', syncLangFromUrl);
    };
  }, [currentLang]);

  // Synchronize document attributes (lang, dir for RTL) and localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('lotus_lang', currentLang);
    } catch (e) {
      // ignore
    }

    // Set HTML lang attribute
    document.documentElement.setAttribute('lang', currentLang);

    // Set HTML dir attribute (RTL for Arabic, LTR for others)
    if (activeLangConfig.dir === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl-layout');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.classList.remove('rtl-layout');
    }
  }, [currentLang, activeLangConfig]);

  /**
   * Switches language and updates the browser URL accordingly.
   * Preserves current page path, query params, and hash.
   */
  const changeLanguage = useCallback((newLang) => {
    if (!SUPPORTED_LANGUAGES.some((l) => l.code === newLang)) return;
    if (typeof window === 'undefined') return;

    const currentPath = window.location.pathname || '/';
    const { cleanPath } = extractLangFromPath(currentPath);
    const newPath = localizePath(cleanPath, newLang);
    const targetUrl = `${newPath}${window.location.search || ''}${window.location.hash || ''}`;

    // Update state
    setCurrentLangState(newLang);

    // If URL actually changes, push history state and dispatch popstate for router
    if (currentPath !== newPath) {
      window.history.pushState({}, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, []);

  const t = useCallback((key, fallback = '') => {
    return translate(key, currentLang, fallback);
  }, [currentLang]);

  const localize = useCallback((path) => {
    return localizePath(path, currentLang);
  }, [currentLang]);

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        setCurrentLang: changeLanguage,
        activeLangConfig,
        t,
        localizePath: localize,
        languages: SUPPORTED_LANGUAGES,
        isRTL: activeLangConfig.dir === 'rtl'
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
