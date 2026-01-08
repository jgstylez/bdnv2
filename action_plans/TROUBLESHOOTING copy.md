# Troubleshooting Guide

## 500 Internal Server Error + MIME Type Error

### Symptoms
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Refused to execute script from 'http://localhost:8081/node_modules/expo-router/entry.bundle?...' 
because its MIME type ('application/json') is not executable, and strict MIME type checking is enabled.
```

### Root Cause
This error occurs when there are **TypeScript compilation errors** in the codebase. The Metro bundler fails to compile the code and returns a JSON error response instead of JavaScript, which causes the MIME type error.

### Quick Fix Steps

1. **Check for TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

2. **Common causes:**
   - Broken JSX structure (unclosed tags, orphaned closing tags)
   - Missing imports
   - Type mismatches
   - Syntax errors

3. **Fix the errors** reported by TypeScript compiler

4. **Restart the dev server** if needed:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart
   npm start
   ```

### Common Issues and Solutions

#### Broken JSX Structure
**Problem:** When removing or modifying JSX elements, sometimes opening/closing tags get mismatched.

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

#### Missing Closing Tags
**Problem:** Opening tag without corresponding closing tag.

**Solution:**
- Ensure every `<View>`, `<ScrollView>`, `<TouchableOpacity>`, etc. has a closing tag
- Check nested structures carefully

### Prevention

1. **Always run TypeScript check before committing:**
   ```bash
   npx tsc --noEmit
   ```

2. **Use IDE/Editor features:**
   - Enable TypeScript error highlighting
   - Use auto-formatting on save
   - Enable bracket matching

3. **When making bulk changes:**
   - Test compilation after each batch of changes
   - Use find/replace carefully to avoid breaking JSX structure

### Verification

After fixing errors, verify with:
```bash
npx tsc --noEmit
```

Should return exit code 0 with no output if successful.

