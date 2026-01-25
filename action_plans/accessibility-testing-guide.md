# Accessibility Testing Guide

**Date:** January 25, 2025  
**Purpose:** Comprehensive guide for testing accessibility across the application

---

## 1. Color Contrast Testing

### Automated Testing

Use the color contrast utility to verify all text colors meet WCAG AA (4.5:1) standards:

```typescript
import { logContrastResults, verifyContrast } from '@/lib/color-contrast';

// Log all contrast checks
logContrastResults();

// Verify specific color combination
const result = verifyContrast("rgba(255, 255, 255, 0.7)", "#232323");
console.log(`Ratio: ${result.ratio}:1, Passes: ${result.passes}`);
```

### Manual Testing Tools

1. **WebAIM Contrast Checker**
   - URL: https://webaim.org/resources/contrastchecker/
   - Test all text/background combinations
   - Verify both normal and large text (18pt+)

2. **Chrome DevTools**
   - Open DevTools → Elements → Computed
   - Check computed color values
   - Use browser extensions for contrast checking

3. **Color Contrast Analyzer (CCA)**
   - Desktop application for Windows/Mac
   - Tests WCAG AA and AAA compliance
   - Supports color blindness simulation

### Common Color Combinations to Test

- White text (`#ffffff`) on dark background (`#232323`) ✅
- 70% white text (`rgba(255, 255, 255, 0.7)`) on dark ⚠️
- 60% white text (`rgba(255, 255, 255, 0.6)`) on dark ⚠️
- 50% white text (`rgba(255, 255, 255, 0.5)`) on dark ❌
- Accent text (`#ba9988`) on dark background ⚠️
- Status colors on dark backgrounds

### Expected Results

- **WCAG AA (4.5:1):** Minimum for normal text
- **WCAG AAA (7:1):** Enhanced for large text (18pt+ or 14pt+ bold)

---

## 2. Screen Reader Testing

### iOS - VoiceOver

**Setup:**
1. Settings → Accessibility → VoiceOver → On
2. Triple-click home button (or side button) to toggle
3. Swipe right to navigate forward, left to go back

**Testing Checklist:**
- [ ] All buttons announce their labels
- [ ] Form inputs announce their labels and hints
- [ ] Images have descriptive labels
- [ ] Navigation is logical and sequential
- [ ] Modal dialogs are announced when opened
- [ ] Error messages are announced
- [ ] Loading states are announced
- [ ] Tab bar items are accessible

**Common Commands:**
- Swipe right: Next element
- Swipe left: Previous element
- Double tap: Activate
- Swipe up/down: Change rotor settings
- Two-finger double tap: Pause/resume

### Android - TalkBack

**Setup:**
1. Settings → Accessibility → TalkBack → On
2. Volume up + Volume down to toggle

**Testing Checklist:**
- [ ] All interactive elements are announced
- [ ] Form inputs have labels
- [ ] Buttons have descriptive labels
- [ ] Navigation is logical
- [ ] Modals trap focus correctly
- [ ] Error messages are announced

**Common Gestures:**
- Swipe right: Next element
- Swipe left: Previous element
- Double tap: Activate
- Swipe up then right: Open TalkBack menu

### Web - NVDA (Windows)

**Setup:**
1. Download NVDA from https://www.nvaccess.org/
2. Install and launch
3. Use keyboard navigation (Tab, Arrow keys)

**Testing Checklist:**
- [ ] All buttons are keyboard accessible
- [ ] Form inputs have labels
- [ ] Focus indicators are visible
- [ ] Modals trap focus
- [ ] Skip links work correctly
- [ ] ARIA labels are announced
- [ ] Error messages are announced

**Common Commands:**
- Tab: Next interactive element
- Shift+Tab: Previous element
- Enter/Space: Activate
- Arrow keys: Navigate within groups
- Escape: Close modals/dialogs

### Web - JAWS (Windows)

**Setup:**
1. Download JAWS from https://www.freedomscientific.com/
2. Install and launch
3. Use keyboard navigation

**Testing Checklist:**
- [ ] All content is readable
- [ ] Navigation is logical
- [ ] Forms are accessible
- [ ] Modals work correctly
- [ ] Error messages are announced

### Web - VoiceOver (macOS)

**Setup:**
1. System Preferences → Accessibility → VoiceOver
2. Enable VoiceOver (Cmd+F5)
3. Use keyboard navigation

**Testing Checklist:**
- [ ] All interactive elements are accessible
- [ ] Focus management works
- [ ] Modals trap focus
- [ ] Forms are accessible

**Common Commands:**
- Tab: Next element
- Shift+Tab: Previous element
- Cmd+Option+Right: Next element
- Cmd+Option+Left: Previous element
- Cmd+Option+Space: Activate

---

## 3. Keyboard Navigation Testing

### Web Keyboard Testing

**Test All Interactive Elements:**
- [ ] Tab through all buttons
- [ ] Tab through all form inputs
- [ ] Tab through all links
- [ ] Use Enter/Space to activate buttons
- [ ] Use Escape to close modals
- [ ] Use Arrow keys in dropdowns/selects
- [ ] Use Arrow keys in radio groups

**Focus Indicators:**
- [ ] All focused elements have visible outline
- [ ] Focus outline is at least 2px
- [ ] Focus color contrasts with background
- [ ] Focus is not obscured by other elements

**Focus Management:**
- [ ] Modals trap focus (can't tab outside)
- [ ] Focus returns to trigger element when modal closes
- [ ] Focus moves to first element when modal opens
- [ ] Skip links work correctly

**Keyboard Shortcuts:**
- [ ] Escape closes modals
- [ ] Enter submits forms
- [ ] Tab navigates forward
- [ ] Shift+Tab navigates backward

### Mobile Keyboard Testing

**iOS:**
- [ ] External keyboard navigation works
- [ ] Tab key moves focus
- [ ] Return key activates buttons
- [ ] Escape key closes modals

**Android:**
- [ ] External keyboard navigation works
- [ ] Tab key moves focus
- [ ] Enter key activates buttons

---

## 4. Touch Target Testing

### Minimum Size Requirements

- **iOS:** 44x44 points minimum
- **Android:** 48x48 dp minimum
- **Web:** 44x44 CSS pixels minimum

### Testing Checklist

- [ ] All buttons meet minimum size
- [ ] Icon-only buttons have adequate hit area
- [ ] `hitSlop` is used for small touch targets
- [ ] Links have adequate touch area
- [ ] Form inputs are at least 44px tall
- [ ] Checkboxes/radio buttons have adequate area

### Tools

- **iOS Simulator:** Use Accessibility Inspector
- **Android Studio:** Use Layout Inspector
- **Browser DevTools:** Measure element sizes

---

## 5. Form Accessibility Testing

### Form Input Testing

- [ ] All inputs have labels
- [ ] Labels are associated with inputs (for/id)
- [ ] Required fields are indicated
- [ ] Error messages are announced
- [ ] Error messages are associated with inputs
- [ ] Placeholders are not the only label
- [ ] Form validation is accessible

### Form Navigation

- [ ] Tab order is logical
- [ ] Can navigate between fields with keyboard
- [ ] Can submit form with keyboard
- [ ] Can clear/reset form with keyboard

---

## 6. Modal/Dialog Testing

### Focus Management

- [ ] Focus moves to modal when opened
- [ ] Focus is trapped within modal
- [ ] Can't tab outside modal
- [ ] Escape key closes modal
- [ ] Focus returns to trigger when closed
- [ ] Modal is announced to screen readers

### Keyboard Navigation

- [ ] Can navigate all elements in modal
- [ ] Can close modal with Escape
- [ ] Can activate buttons with Enter/Space
- [ ] Tab order is logical within modal

---

## 7. Image Accessibility Testing

### Image Labels

- [ ] All images have `accessibilityLabel`
- [ ] Decorative images have `accessible={false}`
- [ ] Informative images have descriptive labels
- [ ] Complex images have detailed descriptions

### Testing Checklist

- [ ] Screen reader announces image labels
- [ ] Decorative images are skipped
- [ ] Image labels are descriptive and meaningful
- [ ] Images with text have the text in the label

---

## 8. Color Blindness Testing

### Simulation Tools

1. **Chrome DevTools**
   - DevTools → Rendering → Emulate vision deficiencies
   - Test: Protanopia, Deuteranopia, Tritanopia

2. **Color Oracle**
   - Desktop application
   - Simulates various color vision deficiencies

3. **WebAIM Contrast Checker**
   - Tests contrast for color blindness

### Testing Checklist

- [ ] Information doesn't rely solely on color
- [ ] Error states use icons/text in addition to color
- [ ] Links are underlined or otherwise distinguished
- [ ] Form validation uses text/icons, not just color
- [ ] Status indicators use shapes/icons

---

## 9. Testing Checklist Summary

### Critical (Must Pass)

- [ ] All interactive elements are keyboard accessible
- [ ] All buttons have accessibility labels
- [ ] All form inputs have labels
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Touch targets meet minimum size (44x44)
- [ ] Screen reader can navigate entire app
- [ ] Focus indicators are visible

### Important (Should Pass)

- [ ] Modals trap focus correctly
- [ ] Error messages are announced
- [ ] Images have descriptive labels
- [ ] Keyboard shortcuts work
- [ ] Skip links are available (web)

### Enhanced (Nice to Have)

- [ ] Color contrast meets WCAG AAA (7:1)
- [ ] Live regions for dynamic content
- [ ] Reduced motion support
- [ ] High contrast mode support

---

## 10. Testing Tools

### Automated Testing

- **axe DevTools:** Browser extension for accessibility testing
- **Lighthouse:** Built into Chrome DevTools
- **WAVE:** Web accessibility evaluation tool
- **Pa11y:** Command-line accessibility testing

### Manual Testing

- **Screen Readers:** VoiceOver, TalkBack, NVDA, JAWS
- **Keyboard Navigation:** Test with keyboard only
- **Color Contrast Checkers:** WebAIM, CCA
- **Browser Extensions:** axe, WAVE, Accessibility Insights

---

## 11. Reporting Issues

When reporting accessibility issues, include:

1. **Issue Description:** What's wrong?
2. **Location:** Where does it occur?
3. **Impact:** Who is affected?
4. **Steps to Reproduce:** How to find it?
5. **Expected Behavior:** What should happen?
6. **Actual Behavior:** What actually happens?
7. **Screen Reader:** Which screen reader was used?
8. **Platform:** iOS, Android, Web
9. **Severity:** Critical, High, Medium, Low

---

## 12. Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [Expo Accessibility](https://docs.expo.dev/guides/accessibility/)

---

## 13. Quick Reference

### WCAG Compliance Levels

- **Level A:** Basic accessibility (must meet)
- **Level AA:** Standard accessibility (should meet) - **Target**
- **Level AAA:** Enhanced accessibility (nice to have)

### Contrast Ratios

- **Normal Text (AA):** 4.5:1 minimum
- **Large Text (AA):** 3:1 minimum (18pt+ or 14pt+ bold)
- **Normal Text (AAA):** 7:1 minimum
- **Large Text (AAA):** 4.5:1 minimum

### Touch Target Sizes

- **iOS:** 44x44 points
- **Android:** 48x48 dp
- **Web:** 44x44 CSS pixels

---

**Last Updated:** January 25, 2025
