# ScrollView and Touch Interaction Optimizations

## Issues Identified

### 1. Missing `scrollEventThrottle` on ScrollViews
**Problem**: Most ScrollViews don't have `scrollEventThrottle={16}`, which is critical for smooth scrolling performance, especially on web.

**Impact**: 
- Laggy scroll events
- Poor performance on web
- Battery drain on mobile

**Solution**: Add `scrollEventThrottle={16}` to all ScrollViews

### 2. Missing `nestedScrollEnabled` for Nested ScrollViews
**Problem**: When ScrollViews are nested (e.g., horizontal carousel inside vertical ScrollView), Android requires `nestedScrollEnabled={true}`.

**Impact**:
- Nested scrolling doesn't work on Android
- Touch conflicts between parent and child ScrollViews

**Solution**: Add `nestedScrollEnabled={true}` to nested ScrollViews

### 3. Missing Touch Feedback (`activeOpacity` and `hitSlop`)
**Problem**: Many `TouchableOpacity` components lack:
- `activeOpacity` - Visual feedback on press
- `hitSlop` - Larger touch target area

**Impact**:
- Buttons feel unresponsive
- Small touch targets are hard to tap on mobile
- Poor UX

**Solution**: Add `activeOpacity={0.7}` and `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}` to all TouchableOpacity

### 4. Web-Specific ScrollView Issues
**Problem**: On web, ScrollView behaves differently and may need:
- `bounces={false}` - Disable bounce effect (not supported on web)
- `showsVerticalScrollIndicator={false}` - Hide scrollbar for cleaner UI

**Impact**:
- Unexpected scroll behavior on web
- Visual inconsistencies

**Solution**: Add platform-specific props

### 5. Missing Keyboard Handling
**Problem**: Forms with TextInputs don't use `KeyboardAvoidingView` or `KeyboardAwareScrollView`.

**Impact**:
- Keyboard covers input fields
- Poor UX on mobile devices

**Solution**: Use `KeyboardAwareScrollView` from `react-native-keyboard-controller` for forms

## Optimizations Applied to `app/pages/merchant/settings.tsx`

✅ Added `scrollEventThrottle={16}` to ScrollView
✅ Added `nestedScrollEnabled={true}` for Android compatibility
✅ Added `bounces={Platform.OS !== "web"}` for web optimization
✅ Added `showsVerticalScrollIndicator={false}` for cleaner UI
✅ Added `activeOpacity={0.7}` to all TouchableOpacity buttons
✅ Added `hitSlop` to all TouchableOpacity buttons

## Files That Need Similar Optimizations

### High Priority (Frequently Used Pages)
- `app/pages/tokens.tsx`
- `app/pages/products/[id].tsx`
- `app/pages/messages/[id].tsx`
- `app/pages/university/blog.tsx`
- `app/pages/university/guides.tsx`

### Medium Priority
- All files in `app/pages/` that use ScrollView
- All files that use TouchableOpacity without `activeOpacity` and `hitSlop`

## Recommended Pattern for ScrollView

```tsx
<ScrollView
  scrollEventThrottle={16}
  showsVerticalScrollIndicator={false}
  nestedScrollEnabled={true}
  bounces={Platform.OS !== "web"}
  contentContainerStyle={{
    paddingHorizontal: paddingHorizontal,
    paddingTop: Platform.OS === "web" ? 20 : 36,
    paddingBottom: scrollViewBottomPadding,
  }}
>
  {/* Content */}
</ScrollView>
```

## Recommended Pattern for TouchableOpacity

```tsx
<TouchableOpacity
  onPress={handlePress}
  activeOpacity={0.7}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  style={styles.button}
>
  <Text>Button</Text>
</TouchableOpacity>
```

## Alternative: Use Pressable (Better Performance)

For better performance, consider migrating from `TouchableOpacity` to `Pressable`:

```tsx
<Pressable
  onPress={handlePress}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  style={({ pressed }) => [
    styles.button,
    pressed && { opacity: 0.7 }
  ]}
>
  <Text>Button</Text>
</Pressable>
```

## Expo-Specific Recommendations

Based on Expo documentation:

1. **Use `KeyboardAwareScrollView`** for forms with multiple inputs
2. **Enable build optimizations** in `app.json`:
   ```json
   {
     "expo": {
       "plugins": [
         [
           "expo-build-properties",
           {
             "android": {
               "enableMinifyInReleaseBuilds": true,
               "enableShrinkResourcesInReleaseBuilds": true
             }
           }
         ]
       ]
     }
   }
   ```

3. **Consider using FlatList** instead of ScrollView for long lists (better performance)

## Testing Checklist

- [ ] Test scrolling on iOS device
- [ ] Test scrolling on Android device
- [ ] Test scrolling on web browser
- [ ] Test touch interactions on mobile
- [ ] Test nested ScrollViews (horizontal carousels)
- [ ] Test keyboard behavior with forms
- [ ] Test button press feedback
- [ ] Test small touch targets

## Next Steps

1. Apply optimizations to high-priority files
2. Create a reusable `OptimizedScrollView` component
3. Create a reusable `OptimizedButton` component
4. Add ESLint rules to enforce these patterns
5. Update component library documentation

