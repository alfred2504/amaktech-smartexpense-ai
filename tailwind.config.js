/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1d4ed8",
        primaryBg: "#eff6ff",
        primaryBorder: "#2563eb",
        secondary: "#10b981",
        secondaryBg: "#d1fae5",
      },
    },
  },
  plugins: [],
}