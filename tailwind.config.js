/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark tech theme
        ink: {
          950: '#06080d',
          900: '#0a0e17',
          850: '#0e1320',
          800: '#131a2b',
          700: '#1b2438',
          600: '#283250',
          500: '#3a4666',
          400: '#5a6890',
          300: '#8a96bc',
          200: '#b8c2dc',
          100: '#dde3f2',
        },
        accent: {
          500: '#00e5ff',
          400: '#33ebff',
          600: '#00b8d4',
          700: '#0091a7',
        },
        success: {
          500: '#22c55e',
          600: '#16a34a',
          400: '#4ade80',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
          400: '#fbbf24',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
          400: '#f87171',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scan': 'scan 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 229, 255, 0.5)' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};
