/**
 * Lotus Tubes - Master Internationalization (i18n) Engine
 * 
 * Central hub for multi-country translations, URL prefixing, path localization,
 * and reciprocal hreflang generation across all 12 target countries.
 */

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_CODES, NON_DEFAULT_LANG_CODES } from './languages.js';
import en from './locales/en.js';
import de from './locales/de.js';
import ar from './locales/ar.js';
import fr from './locales/fr.js';
import vi from './locales/vi.js';
import bn from './locales/bn.js';
import ms from './locales/ms.js';

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_CODES, NON_DEFAULT_LANG_CODES };

export const TRANSLATIONS = {
  en,
  de,
  ar,
  fr,
  vi,
  bn,
  ms,
  'en-in': en,
  'ar-ae': ar,
  'ar-sa': ar,
  'en-sg': en,
  'en-gb': en,
  'en-au': en,
  'en-ca': en
};

/**
 * Returns the localized string for a key in the given country/language.
 * Checks direct translation, then base language, then falls back to English.
 */
export function t(key, lang = DEFAULT_LANGUAGE, fallback = '') {
  const activeLang = LANGUAGE_CODES.includes(lang) ? lang : DEFAULT_LANGUAGE;
  if (TRANSLATIONS[activeLang] && TRANSLATIONS[activeLang][key] !== undefined) {
    return TRANSLATIONS[activeLang][key];
  }
  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === activeLang);
  if (langConfig?.baseLang && TRANSLATIONS[langConfig.baseLang] && TRANSLATIONS[langConfig.baseLang][key] !== undefined) {
    return TRANSLATIONS[langConfig.baseLang][key];
  }
  if (TRANSLATIONS[DEFAULT_LANGUAGE] && TRANSLATIONS[DEFAULT_LANGUAGE][key] !== undefined) {
    return TRANSLATIONS[DEFAULT_LANGUAGE][key];
  }
  return fallback || key;
}

/**
 * Parses any incoming URL pathname (or hash) to extract the active language code
 * and the clean path without language prefix.
 */
export function extractLangFromPath(rawPath = '/') {
  const clean = (rawPath || '/').replace(/^#\/?/, '/');
  const normalized = clean.startsWith('/') ? clean : `/${clean}`;
  const segments = normalized.split('/').filter(Boolean);

  if (segments.length > 0 && NON_DEFAULT_LANG_CODES.includes(segments[0])) {
    const lang = segments[0];
    const remaining = segments.slice(1);
    const cleanPath = remaining.length === 0 ? '/' : `/${remaining.join('/')}`;
    return { lang, cleanPath };
  }

  return { lang: DEFAULT_LANGUAGE, cleanPath: normalized === '' ? '/' : normalized };
}

/**
 * Converts a clean relative path to its localized URL equivalent for the given language.
 */
export function localizePath(cleanPath = '/', lang = DEFAULT_LANGUAGE) {
  // First ensure cleanPath has no existing language prefix
  const { cleanPath: unlocalized } = extractLangFromPath(cleanPath);
  const normalized = unlocalized.startsWith('/') ? unlocalized : `/${unlocalized}`;

  if (lang === DEFAULT_LANGUAGE || !NON_DEFAULT_LANG_CODES.includes(lang)) {
    return normalized;
  }

  if (normalized === '/' || normalized === '') {
    return `/${lang}/`;
  }

  return `/${lang}${normalized}`;
}

/**
 * Returns reciprocal hreflang definitions for any route.
 * Canonical domain: https://lotustubes.com
 */
export function getHreflangLinks(cleanPath = '/', domain = 'https://lotustubes.com') {
  const { cleanPath: unlocalized } = extractLangFromPath(cleanPath);
  const pathPart = unlocalized === '/' ? '' : unlocalized;

  const links = SUPPORTED_LANGUAGES.map((langConfig) => {
    let href = '';
    if (langConfig.code === DEFAULT_LANGUAGE) {
      href = `${domain}${pathPart === '' ? '/' : pathPart}`;
    } else {
      href = `${domain}/${langConfig.code}${pathPart === '' ? '/' : pathPart}`;
    }
    return {
      hreflang: langConfig.code,
      href
    };
  });

  // x-default points to default English canonical route
  links.push({
    hreflang: 'x-default',
    href: `${domain}${pathPart === '' ? '/' : pathPart}`
  });

  return links;
}
