/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['"Noto Kufi Arabic"', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
