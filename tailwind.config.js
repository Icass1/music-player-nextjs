/** @type {import('tailwindcss').Config} */

const fadeOut = require('./fade-out-tailwind.js');
const plugin = require('tailwindcss/plugin')


module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    
    
    require("tailwindcss-animate"),
  
    fadeOut(),
    // nextui(),
    plugin(function ({ addUtilities }) {
      addUtilities({
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
        ".text-fg-1": {
          '--tw-text-opacity': '1',
          'color': 'rgb(var(--foreground-1) / var(--tw-text-opacity))',
        },
        ".text-fg-2": {
          '--tw-text-opacity': '1',
          'color': 'rgb(var(--foreground-2) / var(--tw-text-opacity))',
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