# Babel Configuration Fix

## Issue
NativeWind v4 Babel plugin was causing `.plugins is not a valid Plugin property` error.

## Solution
Removed NativeWind from Babel config since we're using inline styles throughout the app.

## Current Babel Config
```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
    ],
  };
};
```

## Notes
- NativeWind is still installed in package.json but not active in Babel
- All components use inline styles (no className props)
- If we want to use NativeWind/NativeCN later, we'll need to properly configure it
- For now, the app works with pure React Native + inline styles

