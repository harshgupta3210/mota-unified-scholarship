/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mota: {
          saffron: "#FF9933",
          green: "#138808",
          blue: "#000080",
          navy: "#0A2540",
          gold: "#D4AF37",
          dark: "#1A202C",
          light: "#F7FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0"
        }
      }
    },
  },
  plugins: [],
}
