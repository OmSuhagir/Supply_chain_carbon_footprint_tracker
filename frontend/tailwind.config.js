/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // CarbonChain Pro color palette
        'primary-dark': '#0B1120',
        'primary-darker': '#0F172A',
        'card-bg': '#111827',
        'accent-emerald': '#10B981',
        'accent-teal': '#14B8A6',
        'warning-amber': '#F59E0B',
        'danger-red': '#EF4444',
        'success-green': '#22C55E',
        'text-primary': '#F9FAFB',
        'text-secondary': '#94A3B8',
        'border-color': '#1F2937',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0B1120 0%, #0F172A 100%)',
      },
      boxShadow: {
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
