/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
