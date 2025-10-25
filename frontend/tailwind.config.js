/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'],
      },
      colors: {
        primary: {
          DEFAULT: '#f97316',
          foreground: '#ffffff',
        },
        background: '#f8fafc',
        muted: '#f1f5f9',
        card: '#ffffff',
      },
      borderRadius: {
        md: '0.625rem',
        lg: '0.875rem',
      },
      boxShadow: {
        card: '0 2px 6px rgba(15, 23, 42, 0.06), 0 10px 24px rgba(15, 23, 42, 0.06)'
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.2, 0, 0, 1)'
      },
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        lg: '1120px',
        xl: '1280px',
      },
    },
  },
  plugins: [],
};
