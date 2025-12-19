/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a',
        },
        accent: {
          DEFAULT: '#2563eb',
        },
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};
