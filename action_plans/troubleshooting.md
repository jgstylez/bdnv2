# Troubleshooting Guide

**Last Updated:** 2025-01-XX

## Common Issues and Solutions

### Metro Bundler 500 Error / MIME Type Issues

**Symptoms:**
- `Failed to load resource: the server responded with a status of 500`
- `MIME type ('application/json') is not executable`
- Blank screen on web
- Metro bundler returns JSON error instead of JavaScript bundle

**Root Cause:**
This error occurs when there are **TypeScript compilation errors** in the codebase. The Metro bundler fails to compile the code and returns a JSON error response instead of JavaScript, which causes the MIME type error.

**Solutions:**

1. **Check for TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```
   Fix any errors reported by TypeScript compiler.

2. **Common causes:**
   - Broken JSX structure (unclosed tags, orphaned closing tags)
   - Missing imports
   - Type mismatches
   - Syntax errors
   - Circular dependencies

3. **Clear Metro cache and restart:**
   ```bash
   npx expo start --clear
   ```

4. **Verify Babel configuration:**
   - Ensure `babel.config.js` includes:
     - `babel-preset-expo` with `jsxImportSource: "nativewind"`
     - `nativewind/babel` plugin
     - `react-native-reanimated/plugin` (must be last)

5. **Check for import errors:**
   - Verify all imports are correct
   - Ensure all dependencies are installed
   - Check for circular dependencies

6. **Reinstall dependencies (if needed):**
   ```bash
   rm -rf node_modules
   npm install
   ```

7. **Check Metro logs:**
   - Look for specific error messages in terminal
   - Check browser console for detailed errors

### Broken JSX Structure

**Problem:** When removing or modifying JSX elements, sometimes opening/closing tags get mismatched.

**Symptoms:**
- TypeScript errors about unexpected tokens
- Metro bundler fails to compile
- Blank screen

**Solution:** 
- Check for orphaned closing tags `</View>`, `</ScrollView>`, etc.
- Ensure all JSX elements have matching opening and closing tags
- Use a code formatter or linter to catch these issues

**Example Fix:**
```tsx
// ❌ Broken - orphaned closing tag
<View>
  {/* Content */}
</View>
</View>  // Extra closing tag

// ✅ Fixed
<View>
  {/* Content */}
</View>
```

### Blank Screen Issues

**Check:**
1. Console errors (browser/terminal)
2. `SafeAreaProvider` is wrapping the app in `_layout.tsx`
3. All components are properly exported (default export for pages)
4. No runtime errors in component render
5. Error boundaries are catching errors (check ErrorBoundary component)

**Common fixes:**
- Verify `app/_layout.tsx` has proper ErrorBoundary wrapper
- Check that all route files have default exports
- Ensure all imports are correct
- Check for undefined/null values causing crashes

### Web-Specific Issues

**Common problems:**
- `react-native-web` not properly configured
- Missing web-specific polyfills
- CSS/Tailwind not loading
- Images not displaying

**Solutions:**
- Ensure `react-native-web` is installed
- Check `global.css` is imported in `app/_layout.tsx`
- Verify Tailwind config is correct
- Use `expo-image` instead of `react-native` Image component
- Check that `nativewind-setup.ts` is imported in `_layout.tsx`

### Navigation Issues

**Common problems:**
- Routes not working
- Deep links not working
- Navigation freezing

**Solutions:**
- Verify route structure matches file structure
- Check that routes are registered in `_layout.tsx`
- Ensure navigation links use correct paths (e.g., `/pages/` prefix)
- Check for navigation loops or circular dependencies

### Image Loading Issues

**Common problems:**
- Images not displaying
- Slow image loading
- Images breaking layout

**Solutions:**
- Use `expo-image` instead of `react-native` Image
- Add `cachePolicy="memory-disk"` for better performance
- Use `contentFit` instead of `resizeMode`
- Add placeholder images for loading states

### Performance Issues

**Common problems:**
- Slow scrolling
- UI freezing
- High memory usage

**Solutions:**
- Use `OptimizedScrollView` component for long lists
- Implement `VirtualizedList` for very long lists
- Add `useMemo`/`useCallback` for expensive computations
- Check for memory leaks in useEffect hooks
- Use `expo-image` for better image performance

## Debugging Steps

1. **Check terminal output** for Metro bundler errors
2. **Check browser console** for runtime errors
3. **Verify all imports** are correct
4. **Clear caches** and restart:
   ```bash
   npx expo start --clear
   ```
5. **Check package versions** match Expo SDK requirements
6. **Run TypeScript check:**
   ```bash
   npx tsc --noEmit
   ```
7. **Check for circular dependencies:**
   ```bash
   npx madge --circular --extensions ts,tsx .
   ```

## Prevention

1. **Always run TypeScript check before committing:**
   ```bash
   npx tsc --noEmit
   ```

2. **Use IDE/Editor features:**
   - Enable TypeScript error highlighting
   - Use auto-formatting on save
   - Enable bracket matching
   - Use ESLint for code quality

3. **When making bulk changes:**
   - Test compilation after each batch of changes
   - Use find/replace carefully to avoid breaking JSX structure
   - Verify app still runs after changes

4. **Follow code quality standards:**
   - Keep files under 400 LOC
   - Use TypeScript for type safety
   - Extract reusable components
   - Use proper error handling

## Verification

After fixing errors, verify with:
```bash
# TypeScript check
npx tsc --noEmit

# Should return exit code 0 with no output if successful
```

## Getting Help

If issues persist:
1. Check [CODEBASE-REVIEW-2025.md](./CODEBASE-REVIEW-2025.md) for current state
2. Review relevant technical guides in `action_plans/`
3. Check Expo documentation: https://docs.expo.dev
4. Review error logs in detail

---

**Note:** This guide consolidates information from previous troubleshooting documents. For historical reference, see archived documents.
