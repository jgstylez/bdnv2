/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset"), require('./nativecn-preset')],
  theme: {
    extend: {
      colors: {
        // BDN Custom colors with CSS variable fallbacks for web
        primary: {
          bg: "#232323",
          text: "#ffffff",
          DEFAULT: "#ba9988",
        },
        secondary: {
          bg: "#474747",
          DEFAULT: "#474747",
        },
        accent: "#ba9988",
        // Status colors with WCAG AA compliant text variants
        success: {
          DEFAULT: '#4bb858',
          text: '#9ce0a4', // Lighter green for text on dark backgrounds (WCAG AA compliant)
        },
        error: {
          DEFAULT: '#f74141',
          text: '#ff9b9b', // Lighter red for text on dark backgrounds
        },
        warning: {
          DEFAULT: '#ff8521',
          text: '#ffbf82', // Lighter orange for text on dark backgrounds
        },
        info: {
          DEFAULT: '#3d9ef7',
          text: '#92d0ff', // Lighter blue for text on dark backgrounds
        },
        // Dark theme colors (these map to the dark-* prefixed classes)
        'dark-background': '#232323',
        'dark-foreground': '#ffffff',
        'dark-card': '#474747',
        'dark-card-foreground': '#ffffff',
        'dark-muted-foreground': 'rgba(255, 255, 255, 0.7)',
        'dark-border': '#474747',
        'dark-accent': '#ba9988',
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
