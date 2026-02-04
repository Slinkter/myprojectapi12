/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lora", "Georgia", "serif"],
        serif: ["Lora", "Georgia", "serif"],
      },
      colors: {
        'custom-light-gray': '#f8fafc',  // Slate-50
        'custom-dark-gray': '#1a1614',
        'custom-amber': '#d97706',
        'dark-bg': '#1e293b',  // Slate-800
        'dark-card': '#334155',  // Slate-700
        'dark-text': '#f8fafc',  // Slate-50
      },
    },
  },
  plugins: [],
};

