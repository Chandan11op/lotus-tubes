/**
 * Lotus Tubes - Typography Evaluation & Customizer Utility
 * Supports live dynamic preview of Google Fonts across the website during design evaluation.
 */

// Fallback high-quality Google Fonts catalog (80+ curated fonts across 5 categories)
export const GOOGLE_FONTS_CATALOG = [
  // Sans Serif (Corporate, clean, industrial B2B)
  { family: 'Plus Jakarta Sans', category: 'sans-serif', popularity: 1 },
  { family: 'Inter', category: 'sans-serif', popularity: 2 },
  { family: 'Roboto', category: 'sans-serif', popularity: 3 },
  { family: 'Open Sans', category: 'sans-serif', popularity: 4 },
  { family: 'Montserrat', category: 'sans-serif', popularity: 5 },
  { family: 'Poppins', category: 'sans-serif', popularity: 6 },
  { family: 'Lato', category: 'sans-serif', popularity: 7 },
  { family: 'Oswald', category: 'sans-serif', popularity: 8 },
  { family: 'Raleway', category: 'sans-serif', popularity: 9 },
  { family: 'Nunito', category: 'sans-serif', popularity: 10 },
  { family: 'Work Sans', category: 'sans-serif', popularity: 11 },
  { family: 'DM Sans', category: 'sans-serif', popularity: 12 },
  { family: 'Outfit', category: 'sans-serif', popularity: 13 },
  { family: 'Rubik', category: 'sans-serif', popularity: 14 },
  { family: 'Ubuntu', category: 'sans-serif', popularity: 15 },
  { family: 'Kanit', category: 'sans-serif', popularity: 16 },
  { family: 'Figtree', category: 'sans-serif', popularity: 17 },
  { family: 'Manrope', category: 'sans-serif', popularity: 18 },
  { family: 'Heebo', category: 'sans-serif', popularity: 19 },
  { family: 'Prompt', category: 'sans-serif', popularity: 20 },
  { family: 'Cabin', category: 'sans-serif', popularity: 21 },
  { family: 'Public Sans', category: 'sans-serif', popularity: 22 },
  { family: 'Jost', category: 'sans-serif', popularity: 23 },
  { family: 'Syne', category: 'sans-serif', popularity: 24 },
  { family: 'Space Grotesk', category: 'sans-serif', popularity: 25 },
  { family: 'Lexend', category: 'sans-serif', popularity: 26 },
  { family: 'Archivo', category: 'sans-serif', popularity: 27 },
  { family: 'Overpass', category: 'sans-serif', popularity: 28 },
  { family: 'Assistant', category: 'sans-serif', popularity: 29 },
  { family: 'Barlow', category: 'sans-serif', popularity: 30 },

  // Serif (Traditional, authoritative, prestigious)
  { family: 'Playfair Display', category: 'serif', popularity: 31 },
  { family: 'Merriweather', category: 'serif', popularity: 32 },
  { family: 'Lora', category: 'serif', popularity: 33 },
  { family: 'PT Serif', category: 'serif', popularity: 34 },
  { family: 'Roboto Serif', category: 'serif', popularity: 35 },
  { family: 'EB Garamond', category: 'serif', popularity: 36 },
  { family: 'Cormorant Garamond', category: 'serif', popularity: 37 },
  { family: 'Libre Baskerville', category: 'serif', popularity: 38 },
  { family: 'Bitter', category: 'serif', popularity: 39 },
  { family: 'Cinzel', category: 'serif', popularity: 40 },
  { family: 'Noto Serif', category: 'serif', popularity: 41 },
  { family: 'Spectral', category: 'serif', popularity: 42 },
  { family: 'Domine', category: 'serif', popularity: 43 },
  { family: 'DM Serif Display', category: 'serif', popularity: 44 },
  { family: 'Bodoni Moda', category: 'serif', popularity: 45 },
  { family: 'Castoro', category: 'serif', popularity: 46 },
  { family: 'Prata', category: 'serif', popularity: 47 },
  { family: 'Frank Ruhl Libre', category: 'serif', popularity: 48 },
  { family: 'Faustina', category: 'serif', popularity: 49 },
  { family: 'Newsreader', category: 'serif', popularity: 50 },

  // Display (Bold, headline, promotional)
  { family: 'Bebas Neue', category: 'display', popularity: 51 },
  { family: 'Anton', category: 'display', popularity: 52 },
  { family: 'Lobster', category: 'display', popularity: 53 },
  { family: 'Righteous', category: 'display', popularity: 54 },
  { family: 'Abril Fatface', category: 'display', popularity: 55 },
  { family: 'Comfortaa', category: 'display', popularity: 56 },
  { family: 'Alfa Slab One', category: 'display', popularity: 57 },
  { family: 'Bangers', category: 'display', popularity: 58 },
  { family: 'Pacifico', category: 'display', popularity: 59 },
  { family: 'Concert One', category: 'display', popularity: 60 },
  { family: 'Russo One', category: 'display', popularity: 61 },
  { family: 'Titan One', category: 'display', popularity: 62 },
  { family: 'Shrikhand', category: 'display', popularity: 63 },
  { family: 'Ultra', category: 'display', popularity: 64 },
  { family: 'Faster One', category: 'display', popularity: 65 },

  // Handwriting (Artisan, signature, script)
  { family: 'Dancing Script', category: 'handwriting', popularity: 66 },
  { family: 'Caveat', category: 'handwriting', popularity: 67 },
  { family: 'Great Vibes', category: 'handwriting', popularity: 68 },
  { family: 'Satisfy', category: 'handwriting', popularity: 69 },
  { family: 'Sacramento', category: 'handwriting', popularity: 70 },
  { family: 'Yellowtail', category: 'handwriting', popularity: 71 },
  { family: 'Shadows Into Light', category: 'handwriting', popularity: 72 },
  { family: 'Kalam', category: 'handwriting', popularity: 73 },
  { family: 'Indie Flower', category: 'handwriting', popularity: 74 },
  { family: 'Marck Script', category: 'handwriting', popularity: 75 },

  // Monospace (Engineering, specifications, code)
  { family: 'JetBrains Mono', category: 'monospace', popularity: 76 },
  { family: 'Fira Code', category: 'monospace', popularity: 77 },
  { family: 'Roboto Mono', category: 'monospace', popularity: 78 },
  { family: 'Inconsolata', category: 'monospace', popularity: 79 },
  { family: 'Source Code Pro', category: 'monospace', popularity: 80 },
  { family: 'Space Mono', category: 'monospace', popularity: 81 },
  { family: 'IBM Plex Mono', category: 'monospace', popularity: 82 },
  { family: 'Ubuntu Mono', category: 'monospace', popularity: 83 },
  { family: 'Courier Prime', category: 'monospace', popularity: 84 },
  { family: 'VT323', category: 'monospace', popularity: 85 }
];

export const STORAGE_KEY_FONT = 'lotus_custom_typography';
export const STORAGE_KEY_CATEGORY = 'lotus_custom_typography_category';
export const LINK_TAG_ID = 'lotus-dynamic-google-font';

/**
 * Checks if the typography customizer feature is enabled via feature flag
 */
export const isTypographyCustomizerEnabled = () => {
  const envVal = import.meta.env.VITE_ENABLE_TYPOGRAPHY_CUSTOMIZER;
  return envVal === 'true' || envVal === true;
};

/**
 * Fetch font list from official Google Fonts Developer API if key is present;
 * otherwise return cached catalog.
 */
let memoryCachedFonts = null;

export const fetchGoogleFontsCatalog = async () => {
  if (memoryCachedFonts && memoryCachedFonts.length > 0) {
    return memoryCachedFonts;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;

  if (apiKey && typeof apiKey === 'string' && apiKey.trim().length > 0) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${encodeURIComponent(apiKey)}&sort=popularity`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.items)) {
          const apiFonts = data.items.map((item, idx) => ({
            family: item.family,
            category: item.category || 'sans-serif',
            variants: item.variants || ['regular'],
            popularity: idx + 1
          }));
          memoryCachedFonts = apiFonts;
          return apiFonts;
        }
      }
    } catch {
      // Gracefully fall back to local rich catalog without disrupting UX
    }
  }

  memoryCachedFonts = GOOGLE_FONTS_CATALOG;
  return GOOGLE_FONTS_CATALOG;
};

/**
 * Dynamically injects Google Font link and sets CSS custom properties
 */
export const applyTypography = (fontFamily, category = 'sans-serif') => {
  if (!fontFamily || typeof window === 'undefined') return;

  try {
    // 1. Ensure/update Google Font link tag in <head>
    let linkEl = document.getElementById(LINK_TAG_ID);
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.id = LINK_TAG_ID;
      linkEl.rel = 'stylesheet';
      document.head.appendChild(linkEl);
    }

    const encoded = encodeURIComponent(fontFamily);
    linkEl.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600;700;800&display=swap`;

    // 2. Map generic fallback category
    let fallback = 'sans-serif';
    if (category === 'serif') fallback = 'serif';
    else if (category === 'monospace') fallback = 'monospace';
    else if (category === 'handwriting') fallback = 'cursive';
    else if (category === 'display') fallback = 'sans-serif';

    const fontStyleValue = `'${fontFamily}', ${fallback}`;

    // 3. Centralized CSS Custom Properties
    document.documentElement.style.setProperty('--font-heading', fontStyleValue);
    document.documentElement.style.setProperty('--font-body', fontStyleValue);
    document.documentElement.style.setProperty('--font-primary', fontStyleValue);
  } catch (err) {
    console.warn('[Lotus Typography] Failed to apply typography:', err);
  }
};

/**
 * Persists the selected typography in localStorage and applies it site-wide
 */
export const saveAndApplyTypography = (fontFamily, category = 'sans-serif') => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_FONT, fontFamily);
    localStorage.setItem(STORAGE_KEY_CATEGORY, category);
  } catch {
    // LocalStorage might be disabled in private browsing
  }
  applyTypography(fontFamily, category);
};

/**
 * Resets typography back to Lotus Tubes default (Plus Jakarta Sans & Inter)
 */
export const resetTypography = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_FONT);
    localStorage.removeItem(STORAGE_KEY_CATEGORY);

    const linkEl = document.getElementById(LINK_TAG_ID);
    if (linkEl) {
      linkEl.remove();
    }

    document.documentElement.style.removeProperty('--font-heading');
    document.documentElement.style.removeProperty('--font-body');
    document.documentElement.style.removeProperty('--font-primary');
  } catch (err) {
    console.warn('[Lotus Typography] Failed to reset typography:', err);
  }
};

/**
 * Reads any saved typography from localStorage on app boot and applies it immediately
 */
export const initTypographyFromStorage = () => {
  if (typeof window === 'undefined') return;
  try {
    const savedFont = localStorage.getItem(STORAGE_KEY_FONT);
    const savedCategory = localStorage.getItem(STORAGE_KEY_CATEGORY) || 'sans-serif';
    if (savedFont && savedFont.trim().length > 0) {
      applyTypography(savedFont, savedCategory);
    }
  } catch {
    // ignore
  }
};
