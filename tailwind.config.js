
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        'custom-light-gray': '#F9FAFB',
        'custom-dark-gray': '#111827',
        'custom-blue': '#3B82F6',
        'dark-bg': '#1F2937',
        'dark-card': '#374151',
        'dark-text': '#F9FAFB',
      },
    },
  },
  plugins: [],
});

