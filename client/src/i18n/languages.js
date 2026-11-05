/**
 * Lotus Tubes - Supported Languages & Internationalization Architecture
 * 
 * Defines the 7 primary languages supported by Lotus Tubes:
 * 1. English (en) - Default canonical language
 * 2. German (de) - Europe's leading pharmaceutical & chemical engineering hub
 * 3. Arabic (ar) - Middle East & North Africa (MENA) with native RTL support
 * 4. French (fr) - Europe, Canada & Francophone process equipment markets
 * 5. Vietnamese (vi) - Rapidly expanding food, beverage & biopharma manufacturing hub
 * 6. Bengali (bn) - South Asia pharmaceutical & sanitary processing belt
 * 7. Malay (ms) - Southeast Asian hygienic process & food manufacturing sector
 */

export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    short: 'EN',
    flag: '🌐',
    dir: 'ltr',
    locale: 'en-US'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    short: 'DE',
    flag: '🇩🇪',
    dir: 'ltr',
    locale: 'de-DE'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    short: 'AR',
    flag: '🇦🇪',
    dir: 'rtl',
    rtl: true,
    locale: 'ar-AE'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    short: 'FR',
    flag: '🇫🇷',
    dir: 'ltr',
    locale: 'fr-FR'
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    short: 'VI',
    flag: '🇻🇳',
    dir: 'ltr',
    locale: 'vi-VN'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    short: 'BN',
    flag: '🇧🇩',
    dir: 'ltr',
    locale: 'bn-BD'
  },
  {
    code: 'ms',
    name: 'Malay',
    nativeName: 'Bahasa Melayu',
    short: 'MS',
    flag: '🇲🇾',
    dir: 'ltr',
    locale: 'ms-MY'
  }
];

export const DEFAULT_LANGUAGE = 'en';

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((l) => l.code);
export const NON_DEFAULT_LANG_CODES = LANGUAGE_CODES.filter((c) => c !== DEFAULT_LANGUAGE);

