/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#b7d8ff',
          300: '#88beff',
          400: '#56a0ff',
          500: '#2f80ff',
          600: '#1765e6',
          700: '#114dc0',
          800: '#103f97',
          900: '#0f3779',
          950: '#0b254f',
        },
        accent: {
          100: '#e6f7ff',
          200: '#cceeff',
          300: '#99ddff',
          400: '#66ccff',
          500: '#33bbff',
          600: '#00aaff',
        },
        surface: {
          DEFAULT: '#ffffff',
          soft: '#f7f9fc',
          muted: '#eef2f7',
        }
      },
      boxShadow: {
        soft: '0 8px 24px rgba(16, 63, 151, 0.08)',
        softLg: '0 16px 40px rgba(16, 63, 151, 0.12)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        scrollUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-12px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        scrollUp: 'scrollUp 10s linear infinite',
        fadeInUp: 'fadeInUp 700ms ease-out both',
        fadeIn: 'fadeIn 600ms ease-out both',
        float: 'float 4s ease-in-out infinite',
        slideIn: 'slideIn 400ms ease-out both',
      },
    },
  },
  plugins: [],
}