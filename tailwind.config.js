const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#282c34",
        backgroundAlt: "#21252b",
        border: "#3e4452",
        foreground: "#c7ccd6",
        titlebar: "#6b717d",
      }
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar": {
          overflow: "overlay",

          "&::-webkit-scrollbar": {
            width: "8px",
            height: "2px",
            zIndex: 100,
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "transparent",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#a0a0a5",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            backgroundColor: "#a0a0a5",
          },
          "&::-webkit-scrollbar-button": {
            display: "none",
          },
        },
      })
    })
  ],
}