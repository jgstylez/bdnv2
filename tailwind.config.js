/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset"), require('./nativecn-preset')],
  theme: {
    extend: {
      colors: {
        // BDN Custom colors (for backward compatibility)
        primary: {
          bg: "#232323",
          text: "#ffffff",
        },
        secondary: {
          bg: "#474747",
        },
        accent: "#ba9988",
        // NativeCN will use dark theme colors from nativecn-preset.js
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};

