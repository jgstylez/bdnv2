const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { 
  input: "./global.css",
  // Ensure dark mode is configured as 'class'
  configPath: "./tailwind.config.js"
});
