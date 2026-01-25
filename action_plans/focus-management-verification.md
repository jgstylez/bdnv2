# Focus Management Verification Checklist

**Date:** January 25, 2025  
**Component:** BaseModal

---

## ✅ Implementation Complete

The `BaseModal` component has been enhanced with comprehensive focus management for web accessibility.

### Features Implemented

1. **Focus Trap**
   - ✅ Prevents tabbing outside modal when open
   - ✅ Cycles focus within modal content
   - ✅ Works with Shift+Tab for backward navigation

2. **Focus Restoration**
   - ✅ Stores previously focused element
   - ✅ Restores focus when modal closes
   - ✅ Improves keyboard navigation flow

3. **Keyboard Support**
   - ✅ Escape key closes modal
   - ✅ Tab key moves to next focusable element
   - ✅ Shift+Tab moves to previous focusable element
   - ✅ Enter/Space activates buttons

4. **Accessibility Attributes**
   - ✅ `accessibilityRole="dialog"` on modal container
   - ✅ `accessibilityLabel` with modal title
   - ✅ `accessibilityRole="button"` on all buttons
   - ✅ `accessibilityLabel` and `accessibilityHint` on interactive elements
   - ✅ `accessibilityState` for disabled buttons

5. **Visual Focus Indicators**
   - ✅ 2px outline with accent color (`#ba9988`)
   - ✅ 2px offset for better visibility
   - ✅ Web-only (native platforms handle automatically)

---

## 🧪 Testing Checklist

### Manual Testing (Web)

#### Focus Trap Testing
- [ ] Open a modal
- [ ] Press Tab repeatedly - focus should cycle within modal
- [ ] Press Shift+Tab repeatedly - focus should cycle backward
- [ ] Verify focus never leaves the modal
- [ ] Verify focus doesn't go to elements behind the modal overlay

#### Focus Restoration Testing
- [ ] Focus a button/link that opens a modal
- [ ] Open the modal
- [ ] Close the modal (Escape or close button)
- [ ] Verify focus returns to the original button/link

#### Keyboard Navigation Testing
- [ ] **Escape Key:** Press Escape - modal should close
- [ ] **Tab Key:** Press Tab - focus should move to next element
- [ ] **Shift+Tab:** Press Shift+Tab - focus should move to previous element
- [ ] **Enter/Space:** Press Enter/Space on buttons - should activate

#### Focus Indicators Testing
- [ ] Tab through modal elements
- [ ] Verify each focused element has visible outline
- [ ] Verify outline is 2px with accent color
- [ ] Verify outline is visible against background

#### Accessibility Testing
- [ ] Open modal with screen reader (NVDA/JAWS)
- [ ] Verify modal title is announced
- [ ] Verify all buttons are announced with labels
- [ ] Verify close button is accessible
- [ ] Verify action buttons are accessible

---

## 🔍 Code Verification

### BaseModal.tsx Implementation

**Focus Trap:**
```typescript
// Tab key trapping
const handleTabKey = (e: KeyboardEvent) => {
  if (e.key !== "Tab") return;
  const focusableElements = modalContentRef.current?.querySelectorAll?.(...);
  // Cycles focus within modal
};
```

**Focus Restoration:**
```typescript
// Store previous focus
previousActiveElementRef.current = document.activeElement;

// Restore on close
if (previousActiveElementRef.current) {
  previousActiveElementRef.current.focus?.();
}
```

**Escape Key:**
```typescript
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    onClose();
  }
};
```

**Focus Indicators:**
```typescript
...(Platform.OS === "web" && {
  ":focus": {
    outline: `2px solid ${colors.accent}`,
    outlineOffset: "2px",
  },
})
```

---

## 📋 Testing Steps

### Step 1: Open Modal
1. Navigate to a page with a modal
2. Click button/link that opens modal
3. Modal should open and focus should move to close button

### Step 2: Test Focus Trap
1. Press Tab key repeatedly
2. Focus should cycle: Close button → First action → Second action → Close button
3. Focus should never leave the modal

### Step 3: Test Escape Key
1. Press Escape key
2. Modal should close
3. Focus should return to trigger element

### Step 4: Test Focus Indicators
1. Tab through elements
2. Each focused element should have visible outline
3. Outline should be 2px with accent color

### Step 5: Test Screen Reader
1. Open NVDA or JAWS
2. Open modal
3. Screen reader should announce modal title
4. Tab through elements - each should be announced

---

## ✅ Expected Results

### Focus Trap
- ✅ Focus cycles within modal only
- ✅ Cannot tab to elements behind modal
- ✅ Shift+Tab works correctly

### Focus Restoration
- ✅ Focus returns to trigger element
- ✅ Page remains navigable after modal closes

### Keyboard Support
- ✅ Escape closes modal
- ✅ Tab navigates forward
- ✅ Shift+Tab navigates backward
- ✅ Enter/Space activates buttons

### Visual Indicators
- ✅ Focus outline is visible
- ✅ Outline is 2px with accent color
- ✅ Outline contrasts with background

---

## 🐛 Common Issues

### Issue: Focus doesn't trap
**Solution:** Check that `modalContentRef` is properly attached to modal container

### Issue: Focus doesn't restore
**Solution:** Verify `previousActiveElementRef` is storing the correct element

### Issue: Escape doesn't work
**Solution:** Check that event listener is properly attached

### Issue: Focus indicators not visible
**Solution:** Verify CSS outline styles are applied correctly

---

## 📝 Notes

- Focus management is web-only (native platforms handle automatically)
- Focus trap uses `querySelectorAll` to find focusable elements
- Focus restoration stores element reference before modal opens
- Visual focus indicators use CSS outline (web-only)

---

**Last Updated:** January 25, 2025
