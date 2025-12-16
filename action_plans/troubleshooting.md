# Troubleshooting Guide

## Common Issues and Solutions

### Metro Bundler 500 Error / MIME Type Issues

**Symptoms:**
- `Failed to load resource: the server responded with a status of 500`
- `MIME type ('application/json') is not executable`
- Blank screen on web

**Causes:**
1. Metro bundler configuration issues
2. Missing or incorrect Babel plugins
3. Import errors causing bundle failures
4. Cache corruption

**Solutions:**

1. **Clear Metro cache and restart:**
   ```bash
   npx expo start --clear
   ```

2. **Verify Babel configuration:**
   - Ensure `babel.config.js` includes:
     - `babel-preset-expo` with `jsxImportSource: "nativewind"`
     - `nativewind/babel` plugin
     - `react-native-reanimated/plugin` (must be last)

3. **Check for import errors:**
   - Verify all imports are correct
   - Ensure all dependencies are installed
   - Check for circular dependencies

4. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```

5. **Check Metro logs:**
   - Look for specific error messages in terminal
   - Check browser console for detailed errors

### Blank Screen Issues

**Check:**
1. Console errors (browser/terminal)
2. SafeAreaProvider is wrapping the app
3. All components are properly exported
4. No runtime errors in component render

### Web-Specific Issues

**Common problems:**
- `react-native-web` not properly configured
- Missing web-specific polyfills
- CSS/Tailwind not loading

**Solutions:**
- Ensure `react-native-web` is installed
- Check `global.css` is imported in `_layout.tsx`
- Verify Tailwind config is correct

## Debugging Steps

1. **Check terminal output** for Metro bundler errors
2. **Check browser console** for runtime errors
3. **Verify all imports** are correct
4. **Clear caches** and restart
5. **Check package versions** match Expo SDK requirements

