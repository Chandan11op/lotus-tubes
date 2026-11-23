/**
 * Lotus Tubes - Supported Countries & Internationalization Architecture
 * 
 * Defines the 12 target global market countries requested for Lotus Tubes:
 * 1. 🇮🇳 India (en-in) - Mumbai Domestic Engineering & Manufacturing Core
 * 2. 🇦🇪 UAE (ar-ae) - Middle East Hub & Free Zones
 * 3. 🇸🇦 Saudi Arabia (ar-sa) - Gulf Petrochemical & High-Purity Sanitary Market
 * 4. 🇺🇸 USA (en) - American ASME BPE / 3A Hygienic Processing Standards (Default Canonical)
 * 5. 🇩🇪 Germany (de) - Europe's Premier Chemical & Pharmaceutical Engineering Market
 * 6. 🇸🇬 Singapore (en-sg) - Southeast Asian Biopharmaceutical & Process Hub
 * 7. 🇬🇧 UK (en-gb) - British Process Engineering & BS4825 Hygienic Tubing
 * 8. 🇦🇺 Australia (en-au) - Australian Food, Wine, Brewery & Dairy Processing
 * 9. 🇨🇦 Canada (en-ca) - Canadian Sanitary Food & Biopharma Processing
 * 10. 🇧🇩 Bangladesh (bn) - South Asia High-Growth Pharmaceutical Manufacturing Belt
 * 11. 🇻🇳 Vietnam (vi) - Rapidly Expanding Food, Beverage & High-Purity Processing Hub
 * 12. 🇲🇾 Malaysia (ms) - Southeast Asian Halal Hygienic Food & Dairy Processing
 */

export const SUPPORTED_LANGUAGES = [
  {
    country: 'India',
    code: 'en-in',
    name: 'India',
    nativeName: 'India',
    subText: 'English / हिंदी',
    short: 'IN',
    flag: '🇮🇳',
    dir: 'ltr',
    locale: 'en-IN',
    baseLang: 'en'
  },
  {
    country: 'UAE',
    code: 'ar-ae',
    name: 'UAE',
    nativeName: 'الإمارات',
    subText: 'العربية',
    short: 'AE',
    flag: '🇦🇪',
    dir: 'rtl',
    rtl: true,
    locale: 'ar-AE',
    baseLang: 'ar'
  },
  {
    country: 'Saudi Arabia',
    code: 'ar-sa',
    name: 'Saudi Arabia',
    nativeName: 'المملكة العربية السعودية',
    subText: 'العربية',
    short: 'SA',
    flag: '🇸🇦',
    dir: 'rtl',
    rtl: true,
    locale: 'ar-SA',
    baseLang: 'ar'
  },
  {
    country: 'USA',
    code: 'en',
    name: 'USA',
    nativeName: 'United States',
    subText: 'English',
    short: 'US',
    flag: '🇺🇸',
    dir: 'ltr',
    locale: 'en-US',
    baseLang: 'en'
  },
  {
    country: 'Germany',
    code: 'de',
    name: 'Germany',
    nativeName: 'Deutschland',
    subText: 'Deutsch',
    short: 'DE',
    flag: '🇩🇪',
    dir: 'ltr',
    locale: 'de-DE',
    baseLang: 'de'
  },
  {
    country: 'Singapore',
    code: 'en-sg',
    name: 'Singapore',
    nativeName: 'Singapore',
    subText: 'English',
    short: 'SG',
    flag: '🇸🇬',
    dir: 'ltr',
    locale: 'en-SG',
    baseLang: 'en'
  },
  {
    country: 'UK',
    code: 'en-gb',
    name: 'United Kingdom',
    nativeName: 'United Kingdom',
    subText: 'English',
    short: 'GB',
    flag: '🇬🇧',
    dir: 'ltr',
    locale: 'en-GB',
    baseLang: 'en'
  },
  {
    country: 'Australia',
    code: 'en-au',
    name: 'Australia',
    nativeName: 'Australia',
    subText: 'English',
    short: 'AU',
    flag: '🇦🇺',
    dir: 'ltr',
    locale: 'en-AU',
    baseLang: 'en'
  },
  {
    country: 'Canada',
    code: 'en-ca',
    name: 'Canada',
    nativeName: 'Canada',
    subText: 'English / Français',
    short: 'CA',
    flag: '🇨🇦',
    dir: 'ltr',
    locale: 'en-CA',
    baseLang: 'en'
  },
  {
    country: 'Bangladesh',
    code: 'bn',
    name: 'Bangladesh',
    nativeName: 'বাংলাদেশ',
    subText: 'বাংলা',
    short: 'BD',
    flag: '🇧🇩',
    dir: 'ltr',
    locale: 'bn-BD',
    baseLang: 'bn'
  },
  {
    country: 'Vietnam',
    code: 'vi',
    name: 'Vietnam',
    nativeName: 'Việt Nam',
    subText: 'Tiếng Việt',
    short: 'VI',
    flag: '🇻🇳',
    dir: 'ltr',
    locale: 'vi-VN',
    baseLang: 'vi'
  },
  {
    country: 'Malaysia',
    code: 'ms',
    name: 'Malaysia',
    nativeName: 'Malaysia',
    subText: 'Bahasa Melayu',
    short: 'MY',
    flag: '🇲🇾',
    dir: 'ltr',
    locale: 'ms-MY',
    baseLang: 'ms'
  }
];

export const DEFAULT_LANGUAGE = 'en';

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((l) => l.code);
export const NON_DEFAULT_LANG_CODES = LANGUAGE_CODES.filter((c) => c !== DEFAULT_LANGUAGE);
