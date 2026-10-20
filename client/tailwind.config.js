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
          DEFAULT: '#F00078',
          hover: '#D00067',
          active: '#B00057',
          light: '#FCE7F1',
          subtle: '#FFF0F6'
        },
        'primary-blue': {
          DEFAULT: '#0284C7',
          hover: '#0369A1',
          active: '#075985',
          light: '#E0F2FE',
          subtle: '#F0F9FF'
        },
        'deep-navy': {
          DEFAULT: '#10263D',
          dark: '#071C30',
          surface: '#173552',
          border: '#224364'
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
