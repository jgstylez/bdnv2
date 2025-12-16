# Expo Image Migration Guide

**Purpose:** Migrate from React Native `Image` to `expo-image` for better performance and caching

---

## Benefits of expo-image

1. **Better Caching:** Memory-disk caching policy
2. **Performance:** Faster image loading and rendering
3. **Optimization:** Automatic image optimization
4. **Prefetching:** Preload images before they're needed
5. **Transitions:** Smooth fade-in transitions

---

## Migration Steps

### Step 1: Update Import

**Before:**
```typescript
import { Image } from 'react-native';
```

**After:**
```typescript
import { Image } from 'expo-image';
```

### Step 2: Update Props

**Key Prop Changes:**
- `resizeMode` → `contentFit`
- `onError` → `onError` (same, but better error handling)
- Add `cachePolicy` for caching control
- Add `transition` for smooth loading

**Before:**
```typescript
<Image
  source={{ uri: imageUrl }}
  style={{ width: 100, height: 100 }}
  resizeMode="cover"
  onError={() => console.log('Error')}
/>
```

**After:**
```typescript
<Image
  source={{ uri: imageUrl }}
  style={{ width: 100, height: 100 }}
  contentFit="cover"
  cachePolicy="memory-disk"
  transition={200}
  onError={(error) => console.log('Error:', error)}
/>
```

### Step 3: ContentFit Values

| React Native resizeMode | expo-image contentFit |
|------------------------|----------------------|
| `cover` | `cover` |
| `contain` | `contain` |
| `stretch` | `fill` |
| `center` | `center` |
| `repeat` | `repeat` |

### Step 4: Cache Policies

```typescript
// No caching (temporary images)
cachePolicy="none"

// Disk caching (persists across app restarts)
cachePolicy="disk"

// Memory caching (fast, cleared on app close)
cachePolicy="memory"

// Memory + Disk (recommended for most images)
cachePolicy="memory-disk"
```

### Step 5: Add Placeholders (Optional)

```typescript
<Image
  source={{ uri: imageUrl }}
  placeholder={require('./placeholder.png')}
  contentFit="cover"
  cachePolicy="memory-disk"
  transition={200}
/>
```

---

## Files to Update

### High Priority (Most Used)
1. ✅ `components/ImageCarousel.tsx` - Updated
2. `app/(tabs)/marketplace.tsx` - Product images
3. `app/pages/products/[id].tsx` - Product detail images
4. `app/pages/businesses/[id].tsx` - Business images
5. `app/(tabs)/dashboard.tsx` - Dashboard images

### Medium Priority
6. `app/pages/events/[id].tsx`
7. `app/pages/events/index.tsx`
8. `app/pages/checkout.tsx`
9. `app/pages/cart.tsx`
10. `app/pages/profile.tsx`

### Low Priority (Less Critical)
- All other files with Image imports

---

## Example Migrations

### Example 1: Simple Image

**Before:**
```typescript
import { Image } from 'react-native';

<Image
  source={{ uri: product.image }}
  style={{ width: 200, height: 200 }}
  resizeMode="cover"
/>
```

**After:**
```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: product.image }}
  style={{ width: 200, height: 200 }}
  contentFit="cover"
  cachePolicy="memory-disk"
  transition={200}
/>
```

### Example 2: Image with Error Handling

**Before:**
```typescript
<Image
  source={{ uri: imageUrl }}
  style={{ width: '100%', height: 200 }}
  resizeMode="cover"
  onError={() => setImageError(true)}
/>
```

**After:**
```typescript
<Image
  source={{ uri: imageUrl }}
  style={{ width: '100%', height: 200 }}
  contentFit="cover"
  cachePolicy="memory-disk"
  transition={200}
  onError={(error) => {
    console.error('Image load error:', error);
    setImageError(true);
  }}
/>
```

### Example 3: Image Prefetching

**New Feature - Prefetch images before they're needed:**

```typescript
import { prefetch } from 'expo-image';

// Prefetch product images before user navigates
useEffect(() => {
  const imageUrls = products.map(p => p.images[0]).filter(Boolean);
  prefetch(imageUrls, 'memory-disk');
}, [products]);
```

---

## Checklist

For each file:
- [ ] Update import statement
- [ ] Change `resizeMode` to `contentFit`
- [ ] Add `cachePolicy="memory-disk"`
- [ ] Add `transition={200}` for smooth loading
- [ ] Update `onError` handler if present
- [ ] Test image loading
- [ ] Test error handling
- [ ] Verify caching works

---

## Performance Tips

1. **Use appropriate cache policy:**
   - Frequently viewed images: `memory-disk`
   - One-time images: `none`
   - Large images: `disk`

2. **Prefetch above-the-fold images:**
   ```typescript
   useEffect(() => {
     prefetch([heroImageUrl], 'memory-disk');
   }, []);
   ```

3. **Use placeholders for better UX:**
   ```typescript
   <Image
     source={{ uri: imageUrl }}
     placeholder={require('./placeholder.png')}
     contentFit="cover"
   />
   ```

4. **Set priority for important images:**
   ```typescript
   <Image
     source={{ uri: imageUrl }}
     priority="high"
     contentFit="cover"
   />
   ```

---

## Testing

After migration, test:
1. ✅ Images load correctly
2. ✅ Images cache properly
3. ✅ Error handling works
4. ✅ Transitions are smooth
5. ✅ Performance is improved
6. ✅ Memory usage is acceptable

---

**Status:** In Progress  
**Last Updated:** 2025-01-XX

