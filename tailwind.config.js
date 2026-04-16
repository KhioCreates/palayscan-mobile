/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3fbf4',
          100: '#dcefdc',
          200: '#bddfbe',
          300: '#97ca9a',
          400: '#6daf72',
          500: '#4d9654',
          600: '#397940',
          700: '#2d6033',
          800: '#274d2c',
          900: '#223f26',
        },
        earth: {
          50: '#fbf7ef',
          100: '#f3ead3',
          200: '#e8d6ac',
          300: '#dbbe7f',
          400: '#cea35a',
          500: '#c18b42',
        },
        ink: {
          50: '#f7f8f7',
          100: '#ebefec',
          200: '#d3dbd5',
          300: '#aebbae',
          400: '#819481',
          500: '#627562',
          600: '#495a49',
          700: '#364336',
          800: '#263126',
          900: '#1b241c',
        },
      },
      boxShadow: {
        soft: '0px 8px 24px rgba(28, 53, 35, 0.10)',
      },
    },
  },
  plugins: [],
};
