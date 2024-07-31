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
        ".fade-out-fg-1": {
          'white-space': 'nowrap',
          'background': `linear-gradient(90deg, #9DE2B0 0%, #9DE2B0 80%, transparent 100%)`,
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'overflow-x': 'hidden',
        },
        ".bg-1": {
          '--tw-bg-opacity': '1',
          'background-color': 'rgb(var(--background-1) / var(--tw-bg-opacity))',
        },  
        ".bg-2": {
          '--tw-bg-opacity': '1',
          'background-color': 'rgb(var(--background-2) / var(--tw-bg-opacity))',
        },  
        ".bg-3": {
          '--tw-bg-opacity': '1',
          'background-color': 'rgb(var(--background-3) / var(--tw-bg-opacity))',
        },
        ".fg-1": {
          '--tw-bg-opacity': '1',
          'background-color': 'rgb(var(--foreground-1) / var(--tw-bg-opacity))',
        },
        ".fg-2": {
          '--tw-bg-opacity': '1',
          'background-color': 'rgb(var(--foreground-2) / var(--tw-bg-opacity))',
        },
        ".fade-out-fg-1": {
          'white-space': 'nowrap',
          'background': `linear-gradient(90deg, rgb(var(--foreground-1)) 0%, rgb(var(--foreground-1)) 80%, transparent 100%)`,
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'overflow-x': 'hidden',
        },
        ".fade-out-fg-2": {
          'white-space': 'nowrap',
          'background': `linear-gradient(90deg, rgb(var(--foreground-2)) 0%, rgb(var(--foreground-2)) 80%, transparent 100%)`,
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'overflow-x': 'hidden',
        },
        ".desktop-layout": {
          "grid-template-areas": `
            "head head" 
            "song-info  main" 
            "queue  main"`,
          'grid-template-rows': '60px 350px 1fr',
          'grid-template-columns': '250px 1fr'
        },
        ".desktop-layout-lyrics": {
          "grid-template-areas": `
            "head head" 
            "song-info  main" 
            "queue  lyrics"`,
          'grid-template-rows': '60px 350px 1fr',
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
