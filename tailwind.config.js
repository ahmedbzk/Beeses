/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'beeses-gold': '#B58131',     // Logo Rengi
        'beeses-silver': '#f0f0f0',   // Gümüş/Açık Gri
        'beeses-dark': '#1a1d23',     // Ürün ana gövde (koyu)
        'beeses-accent': '#626C7F'    // Ürün üzerindeki siyahımsı panel
      },
      fontFamily: {
        'sans': ['"Open Sans"', 'sans-serif'],     
      },
      keyframes: {
        shrink: {
          '0%': { width: '100%' },
          '100%': { width: '0%' }
        }
      },
      animation: {
        shrink: 'shrink 4s linear forwards'
      }
    },
  },
  plugins: [],
}