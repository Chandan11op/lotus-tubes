/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Lotus Impex & Tubes Official Brand Identity (From Forwarded Client Design Feedback)
        'lotus-navy': '#071A52',
        'lotus-navy-dark': '#05143F',
        'lotus-blue': '#2D8CFF',
        'lotus-blue-hover': '#1A75E8',
        'lotus-blue-light': 'rgba(45, 140, 255, 0.08)',
        'lotus-grey': '#F7F8FA',
        'lotus-silver': '#CBD5E1',
        'lotus-magenta': '#FF007A',
        'lotus-magenta-hover': '#E6006E',

        // Obsidian Precision Foundation Tokens
        surface: '#0d141c',
        'surface-dim': '#0d141c',
        'surface-bright': '#333a43',
        'surface-container-lowest': '#080f17',
        'surface-container-low': '#151c25',
        'surface-container': '#192029',
        'surface-container-high': '#242a34',
        'surface-container-highest': '#2e353f',
        'on-surface': '#dce3ef',
        'on-surface-variant': '#b9cacb',
        'inverse-surface': '#dce3ef',
        'inverse-on-surface': '#2a313a',
        outline: '#849495',
        'outline-variant': '#3b494b',
        'surface-tint': '#00dbe9',
        background: '#0d141c',
        'on-background': '#dce3ef',
        'surface-variant': '#2e353f',

        // Precision Flow Accents (Cyan)
        primary: '#dbfcff',
        'on-primary': '#00363a',
        'primary-container': '#00f0ff',
        'on-primary-container': '#006970',
        'inverse-primary': '#006970',
        'primary-fixed': '#7df4ff',
        'primary-fixed-dim': '#00dbe9',
        'on-primary-fixed': '#002022',
        'on-primary-fixed-variant': '#004f54',

        // Thermal / Seal Diagnostics (Magenta)
        secondary: '#ffb1c3',
        'on-secondary': '#66002c',
        'secondary-container': '#ff4b89',
        'on-secondary-container': '#590026',
        'secondary-fixed': '#ffd9e0',
        'secondary-fixed-dim': '#ffb1c3',
        'on-secondary-fixed': '#3f0019',
        'on-secondary-fixed-variant': '#8f0041',

        // Tertiary / Metallic Steels
        tertiary: '#f1f6ff',
        'on-tertiary': '#2b3137',
        'tertiary-container': '#d4dae2',
        'on-tertiary-container': '#595f66',
        'tertiary-fixed': '#dde3eb',
        'tertiary-fixed-dim': '#c1c7cf',

        // Legacy / Compatibility Tokens
        'primary-pink': {
          DEFAULT: '#FB7185',
          hover: '#F43F5E',
          active: '#E11D48',
          light: '#FFF1F2',
          subtle: '#FDF2F8',
          golden: '#F472B6',
          champagne: '#FDE2E4'
        },
        'primary-blue': {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          active: '#1E40AF',
          light: '#EFF6FF',
          subtle: '#FAFCFF'
        },
        'steel-blue': {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          active: '#1D4ED8',
          light: '#EFF6FF'
        },
        'deep-navy': {
          DEFAULT: '#0F172A',
          dark: '#030810',
          surface: '#1E293B',
          border: '#334155'
        },
        'steel-gray': {
          DEFAULT: '#F8FAFC',
          border: '#E2E8F0',
          dark: '#64748B'
        },
        'brand-dark': '#0F172A'
      },
      fontFamily: {
        'display-hero': ['"Plus Jakarta Sans"', 'sans-serif'],
        'display-hero-mobile': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-xl': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-xl-mobile': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-lg': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-lg-mobile': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-md': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-sm': ['"Plus Jakarta Sans"', 'sans-serif'],
        'body-lg': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'body-sm': ['Inter', 'sans-serif'],
        'label-technical': ['"IBM Plex Sans"', 'Inter', 'sans-serif'],
        'label-code-micro': ['"IBM Plex Sans"', 'Inter', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        specs: ['"IBM Plex Sans"', 'Inter', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"IBM Plex Sans"', 'monospace']
      },
      fontSize: {
        'label-code-micro': ['10px', { lineHeight: '14px', letterSpacing: '0.12em', fontWeight: '600' }],
        'label-technical': ['12px', { lineHeight: '16px', letterSpacing: '0.08em', fontWeight: '500' }],
        'body-sm': ['13px', { lineHeight: '18px', letterSpacing: '0.01em', fontWeight: '400' }],
        'body-md': ['15px', { lineHeight: '22px', letterSpacing: '0em', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '400' }],
        'headline-sm': ['18px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '500' }],
        'headline-md': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '500' }],
        'headline-lg-mobile': ['24px', { lineHeight: '30px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.015em', fontWeight: '600' }],
        'headline-xl-mobile': ['32px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-xl': ['44px', { lineHeight: '52px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-hero-mobile': ['38px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-hero': ['64px', { lineHeight: '72px', letterSpacing: '-0.03em', fontWeight: '700' }]
      },
      spacing: {
        gutter: '1.5rem',
        'gutter-sm': '1rem',
        'gutter-lg': '2rem',
        margin: '2rem',
        'margin-sm': '1rem',
        'margin-lg': '4rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem'
      }
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}