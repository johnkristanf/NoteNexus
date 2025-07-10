// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',     // violet-600
        secondary: '#FFFFFF',   // white
        dark: '#0F172A',        // slate-900
      },
    },
  },
  plugins: [],
}

export default config
