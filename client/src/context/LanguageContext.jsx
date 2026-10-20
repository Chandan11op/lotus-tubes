import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/siteData';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('lotus_lang') || 'en';
    }
    return 'en';
  });

  const activeLangConfig = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('lotus_lang', currentLang);
      } catch (e) {
        console.warn('Could not save language to localStorage', e);
      }

      // Update document direction if RTL (e.g. Arabic)
      if (activeLangConfig.rtl) {
        document.documentElement.setAttribute('dir', 'rtl');
      } else {
        document.documentElement.removeAttribute('dir');
      }
      document.documentElement.setAttribute('lang', currentLang);
    }
  }, [currentLang, activeLangConfig]);

  const t = (key, fallback = '') => {
    if (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) {
      return TRANSLATIONS[currentLang][key];
    }
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
      return TRANSLATIONS['en'][key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, activeLangConfig, t, languages: SUPPORTED_LANGUAGES }}>
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
