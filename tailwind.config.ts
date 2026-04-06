import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      colors: {
        black: '#0a0a0a',
        'grey-9': '#1a1a1a',
        'grey-7': '#444444',
        'grey-5': '#888888',
        'grey-3': '#cccccc',
        'grey-1': '#f2f2f2',
      },
      letterSpacing: {
        widest: '0.18em',
      },
    },
  },
  plugins: [],
};

export default config;
