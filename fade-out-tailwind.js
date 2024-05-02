const plugin = require('tailwindcss/plugin')
const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default


module.exports = function fadeOut () {
  return (plugin(function ({ addUtilities, theme }) {
      colorPalette = flattenColorPalette(theme('colors'));
      let utilities = {}
  
      for (let i of Object.keys(colorPalette)) {
        if ('inherit' == i || 'current' == i || 'transparent' == i) {continue}
        utilities['.fade-out-' + i] = {
          'white-space': 'nowrap',
          'background': `linear-gradient(90deg, ${colorPalette[i]} 0%, ${colorPalette[i]} 80%, transparent 100%)`,
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        }
      }
  
      addUtilities(utilities)
  }))
}


