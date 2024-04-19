/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: ['cyberpunk'],
  },
  content: [`./views/**/*.ejs`],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

