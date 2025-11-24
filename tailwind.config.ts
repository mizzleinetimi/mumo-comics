import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-balsamiq)', 'sans-serif'],
        heading: ['var(--font-fredoka)', 'cursive'],
      },
      colors: {
        mumo: {
          orange: '#FF8C42',
          yellow: '#FFD166',
          blue: '#06BEE1',
        },
      },
      boxShadow: {
        hard: '4px 4px 0px 0px #000000',
        'hard-sm': '2px 2px 0px 0px #000000',
        'hard-lg': '6px 6px 0px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};
export default config;
