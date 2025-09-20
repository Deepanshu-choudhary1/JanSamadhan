/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",   // civic blue
        secondary: "#16a34a", // green for resolved
        danger: "#dc2626",    // red for critical
        warning: "#facc15",   // yellow for in-progress
        graylight: "#f3f4f6"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
