/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,html}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // Custom colors
        'custom-dark': '#1E293B', // Deep Navy
        'custom-light': '#F8FAFC', // Soft Beige
        'custom-primary': '#F97316', // Burnt Orange
        'custom-secondary': '#10B981', // Teal Green
        'custom-text': '#F8FAFC', // Light text
        'custom-muted': '#94A3B8', // Muted text
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

