const colors = require('tailwindcss/colors');

const { zinc } = colors;
zinc[700] = '#2E2A2A';
zinc[600] = '#423e3e';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: zinc,
      },
    },
    screens: {
      smh: { raw: '(max-height:400px)' },
    },
  },
  plugins: [],
};
