import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dalia: {
          vanilla: '#FAF6F0',
          cream: '#FFFDF9',
          blush: '#F4E5E7',
          rose: '#E8B6BF',
          strawberry: '#D4687C',
          chocolate: '#2A1719',
          cocoa: '#42272A',
          cherry: '#B51B32',
          gold: '#C59B27',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        handwritten: ['var(--font-script)', 'Ephesis', 'cursive'],
      },
      boxShadow: {
        'paper': '0 4px 20px -2px rgba(42, 23, 25, 0.06), 0 2px 6px -1px rgba(42, 23, 25, 0.04)',
        'paper-lg': '0 12px 32px -4px rgba(42, 23, 25, 0.08), 0 4px 12px -2px rgba(42, 23, 25, 0.05)',
        'paper-float': '0 20px 48px -8px rgba(42, 23, 25, 0.12), 0 8px 16px -4px rgba(42, 23, 25, 0.06)',
      },
      borderRadius: {
        'dalia': '20px',
        'dalia-lg': '28px',
        'dalia-sm': '12px',
      },
      keyframes: {
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'crumb-drift': {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(4px, -4px) rotate(6deg)' },
          '100%': { transform: 'translate(0, 0) rotate(0deg)' },
        },
      },
      animation: {
        'float-gentle': 'float-gentle 4s ease-in-out infinite',
        'crumb-drift': 'crumb-drift 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
