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
          DEFAULT: '#E83E83',
          hover: '#D02B6F',
          active: '#B81B5B',
          light: '#FCE8F0',
          subtle: '#FDF2F7'
        },
        'primary-blue': {
          DEFAULT: '#163A70',
          hover: '#122F5A',
          active: '#0D2241',
          light: '#EAF2FC',
          subtle: '#F4F8FD'
        },
        'steel-blue': {
          DEFAULT: '#3478C8',
          hover: '#2864A8',
          active: '#1E4E85',
          light: '#EAF2FC'
        },
        'deep-navy': {
          DEFAULT: '#0B1F3A',
          dark: '#061224',
          surface: '#122847',
          border: '#1D3B63'
        },
        'steel-gray': {
          DEFAULT: '#F4F6F9',
          border: '#E2E8F0',
          dark: '#64748B'
        },
        'brand-dark': '#182335'
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
