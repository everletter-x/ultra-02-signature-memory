/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        'pink-soft': '#F9C6D0',
        'rose': '#E8A0B4',
        'lavender': '#C4B5E0',
        'warm-white': '#F8F6F3',
        'dark-luxury': '#0A0A0A',
        'gold-accent': '#D4A843',
        'deep-black': '#0A0A0A',
        'elegant-white': '#F8F6F3',
        'starlight-glow': '#F0D078'
      }
    }
  },
  plugins: []
};
