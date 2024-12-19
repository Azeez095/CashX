/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // Custom colors
        'custom-dark': '#1E293B', // Deep Navy
        'custom-light': '#F5F5DC', // Soft Beige
        'custom-primary': '#F97316', // Burnt Orange
        'custom-secondary': '#10B981', // Teal Green
        'custom-text': '#F8FAFC', // Light text
        'custom-muted': '#94A3B8', // Muted text
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

