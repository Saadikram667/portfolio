import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'monospace'],
      },
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--text)',
        muted: 'var(--text-muted)',
        burgundy: 'var(--burgundy)',
        crimson: 'var(--crimson)',
        gold: 'var(--gold)',
        edge: 'var(--border)',
      },
    },
  },
  plugins: [],
};

export default config;