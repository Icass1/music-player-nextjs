// const { nextui } = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */

const fadeOut = require('./fade-out-tailwind.js');
const plugin = require('tailwindcss/plugin')


module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(image|input|progress|slider|popover).js"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    fadeOut(),
    // nextui(),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".desktop-layout": {
          "grid-template-areas": `
            "head head" 
            "song-info  main" 
            "queue  main"`,
          'grid-template-rows': '60px 500px 1fr',
          'grid-template-columns': '250px 1fr'
        },
        ".mobile-layout": {
          "grid-template-areas": `
          "main" 
          "song-info" 
          "head"`,
          'grid-template-rows': '1fr 60px 50px',
          'grid-template-columns': '100%'
        }
      })
    })
  ],
}
