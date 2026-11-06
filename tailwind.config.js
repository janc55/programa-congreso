/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        unior: {
          wine: '#8A151B',
          darkWine: '#6B1015',
          lightWine: '#A4161A',
          coral: '#F05023',
          orange: '#FF5722',
          gold: '#D97706',
          bg: '#F8F9FA'
        }
      },
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

