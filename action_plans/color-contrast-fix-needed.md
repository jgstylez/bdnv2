# Color Contrast Fix Required

**Issue:** White text on accent background fails WCAG AA contrast ratio

**Current State:**
- Text: `#ffffff` (white)
- Background: `#ba9988` (accent color)
- Contrast Ratio: **2.63:1** ❌
- Required: **4.5:1** for WCAG AA

**Fix Options:**

### Option 1: Use Dark Text (Recommended)
Change white text to dark text on accent background:
```typescript
// ❌ Current
color: "#ffffff" // on #ba9988 background

// ✅ Fixed
color: "#232323" // or "#1a1a1a" for better contrast
```

### Option 2: Lighten Background
Use a lighter variant of accent color:
```typescript
// ❌ Current
backgroundColor: "#ba9988"

// ✅ Fixed
backgroundColor: "#d2bab0" // lighter brown from palette
```

### Option 3: Use Accent Light Variant
Use the accent light variant with dark text:
```typescript
// ✅ Alternative
backgroundColor: "rgba(186, 153, 136, 0.2)" // accentLight
color: "#ffffff" // This would work on dark background
```

**Where to Check:**
- Buttons with accent background and white text
- Cards with accent background
- Badges with accent background
- Any component using `colors.accent` as background with white text

**Verification:**
After making changes, verify contrast using:
```typescript
import { verifyContrast } from '@/lib/color-contrast';

const result = verifyContrast("#232323", "#ba9988");
console.log(`Ratio: ${result.ratio}:1`); // Should be >= 4.5:1
```

**Priority:** Medium (affects accessibility compliance)
