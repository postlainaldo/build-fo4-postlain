import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fo4: {
          dark: '#0B0F19',
          card: '#161F30',
          accent: '#00FF87',
          gold: '#FFD700',
          silver: '#C0C0C0',
          bronze: '#CD7F32',
          field: '#14251C',
        }
      },
      backgroundImage: {
        'field-texture': "radial-gradient(circle, rgba(20,55,30,0.85) 0%, rgba(10,30,15,0.95) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
