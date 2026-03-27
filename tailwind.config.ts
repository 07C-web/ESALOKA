import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#FDF8EC',
          100: '#F9EDCA',
          200: '#F3DB96',
          300: '#E8C45A',
          400: '#C8A951',
          500: '#A8893A',
          600: '#876B28',
          700: '#664F1C',
          800: '#4A3813',
          900: '#2E220B',
        },
        sage: {
          50:  '#F4F7F1',
          100: '#E2EAD9',
          200: '#C4D5B4',
          300: '#9FB48C',
          400: '#7A9069',
          500: '#5F7250',
          600: '#48573C',
          700: '#343E2B',
          800: '#22281C',
          900: '#12150E',
        },
        dark: '#1C1C1A',
        cream: '#FAFAF7',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}

export default config
