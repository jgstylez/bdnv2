# Screen Reader Testing Checklist

**Date:** January 25, 2025  
**Purpose:** Comprehensive checklist for testing accessibility with screen readers

---

## 📱 iOS - VoiceOver Testing

### Setup
1. Settings → Accessibility → VoiceOver → On
2. Triple-click home button (or side button) to toggle
3. Swipe right to navigate forward, left to go back

### Testing Checklist

#### Navigation
- [ ] Can navigate entire app using swipe gestures
- [ ] All buttons are announced with labels
- [ ] All links are announced with labels
- [ ] Tab bar items are accessible and announced
- [ ] Navigation flow is logical and sequential

#### Forms
- [ ] All form inputs have labels
- [ ] Labels are announced when focusing inputs
- [ ] Placeholders are announced (if no label)
- [ ] Error messages are announced
- [ ] Required fields are indicated
- [ ] Can submit forms using VoiceOver

#### Modals/Dialogs
- [ ] Modal title is announced when opened
- [ ] Can navigate all elements within modal
- [ ] Close button is accessible
- [ ] Action buttons are announced with labels
- [ ] Can close modal with VoiceOver gesture
- [ ] Focus returns to trigger element when closed

#### Images
- [ ] All images have descriptive labels
- [ ] Decorative images are skipped
- [ ] Product images have meaningful descriptions
- [ ] Icons have appropriate labels

#### Interactive Elements
- [ ] All buttons have descriptive labels
- [ ] Icon-only buttons have labels
- [ ] Links are announced with destination
- [ ] Toggle switches are announced with state
- [ ] Checkboxes are announced with state
- [ ] Radio buttons are announced with state

#### Content
- [ ] Headings are announced correctly
- [ ] Lists are announced with item count
- [ ] Tables are navigable
- [ ] Dynamic content updates are announced

### Common VoiceOver Gestures
- **Swipe Right:** Next element
- **Swipe Left:** Previous element
- **Double Tap:** Activate
- **Swipe Up/Down:** Change rotor settings
- **Two-finger Double Tap:** Pause/resume
- **Three-finger Swipe:** Scroll

---

## 🤖 Android - TalkBack Testing

### Setup
1. Settings → Accessibility → TalkBack → On
2. Volume up + Volume down to toggle

### Testing Checklist

#### Navigation
- [ ] Can navigate entire app using swipe gestures
- [ ] All buttons are announced
- [ ] All links are announced
- [ ] Navigation is logical
- [ ] Can navigate back using system back button

#### Forms
- [ ] All inputs have labels
- [ ] Labels are announced
- [ ] Error messages are announced
- [ ] Can submit forms

#### Modals/Dialogs
- [ ] Modal is announced when opened
- [ ] Can navigate within modal
- [ ] Close button is accessible
- [ ] Can close modal
- [ ] Focus returns correctly

#### Images
- [ ] Images have labels
- [ ] Decorative images are skipped
- [ ] Product images have descriptions

#### Interactive Elements
- [ ] Buttons have labels
- [ ] Links are announced
- [ ] Toggles announce state
- [ ] Checkboxes announce state

### Common TalkBack Gestures
- **Swipe Right:** Next element
- **Swipe Left:** Previous element
- **Double Tap:** Activate
- **Swipe Up then Right:** Open TalkBack menu

---

## 💻 Web - NVDA Testing (Windows)

### Setup
1. Download NVDA from https://www.nvaccess.org/
2. Install and launch
3. Use keyboard navigation (Tab, Arrow keys)

### Testing Checklist

#### Keyboard Navigation
- [ ] Can navigate entire site with Tab key
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Tab order is logical
- [ ] Can activate buttons with Enter/Space

#### Forms
- [ ] All inputs have labels
- [ ] Labels are associated with inputs (for/id)
- [ ] Error messages are announced
- [ ] Can submit forms with keyboard
- [ ] Required fields are indicated

#### Modals/Dialogs
- [ ] Modal is announced when opened
- [ ] Focus is trapped within modal
- [ ] Can navigate within modal with Tab
- [ ] Escape key closes modal
- [ ] Focus returns to trigger element
- [ ] Cannot tab outside modal when open

#### ARIA Labels
- [ ] Buttons have aria-label or visible text
- [ ] Links have descriptive text
- [ ] Images have alt text
- [ ] Form inputs have labels
- [ ] Landmarks are properly marked

#### Dynamic Content
- [ ] Loading states are announced
- [ ] Error messages are announced
- [ ] Success messages are announced
- [ ] Content updates are announced (if using live regions)

### Common NVDA Commands
- **Tab:** Next interactive element
- **Shift+Tab:** Previous element
- **Enter/Space:** Activate
- **Arrow Keys:** Navigate within groups
- **Escape:** Close modals/dialogs
- **H:** Next heading
- **L:** Next list
- **F:** Next form field

---

## 💻 Web - JAWS Testing (Windows)

### Setup
1. Download JAWS from https://www.freedomscientific.com/
2. Install and launch
3. Use keyboard navigation

### Testing Checklist

#### Navigation
- [ ] Can navigate entire site
- [ ] All content is readable
- [ ] Navigation is logical
- [ ] Headings are properly structured

#### Forms
- [ ] Forms are accessible
- [ ] Labels are associated
- [ ] Error messages are announced
- [ ] Can submit forms

#### Modals
- [ ] Modals work correctly
- [ ] Focus management works
- [ ] Can close modals

#### Content
- [ ] All text is readable
- [ ] Images have descriptions
- [ ] Links are descriptive
- [ ] Tables are navigable

### Common JAWS Commands
- **Tab:** Next element
- **Shift+Tab:** Previous element
- **Enter:** Activate
- **H:** Next heading
- **L:** Next list
- **F:** Next form field

---

## 💻 Web - VoiceOver Testing (macOS)

### Setup
1. System Preferences → Accessibility → VoiceOver
2. Enable VoiceOver (Cmd+F5)
3. Use keyboard navigation

### Testing Checklist

#### Keyboard Navigation
- [ ] All interactive elements are accessible
- [ ] Focus management works
- [ ] Modals trap focus
- [ ] Forms are accessible

#### Focus Indicators
- [ ] Focus is visible
- [ ] Focus outline is clear
- [ ] Focus color contrasts with background

#### Modals
- [ ] Modals trap focus
- [ ] Escape closes modals
- [ ] Focus returns correctly

### Common VoiceOver Commands (macOS)
- **Tab:** Next element
- **Shift+Tab:** Previous element
- **Cmd+Option+Right:** Next element
- **Cmd+Option+Left:** Previous element
- **Cmd+Option+Space:** Activate

---

## 🎯 Critical Test Scenarios

### Scenario 1: User Registration
1. Navigate to signup page
2. Fill out form fields
3. Submit form
4. Verify error messages are announced
5. Verify success message is announced

**Expected:** All steps are accessible and announced

### Scenario 2: Product Purchase
1. Navigate to product page
2. Select product variant
3. Add to cart
4. Proceed to checkout
5. Complete payment

**Expected:** All steps are accessible and announced

### Scenario 3: Modal Interaction
1. Click button to open modal
2. Navigate within modal
3. Fill out form in modal
4. Submit form
5. Close modal

**Expected:** Focus management works correctly

### Scenario 4: Navigation
1. Navigate through all main sections
2. Use tab bar navigation
3. Use sidebar navigation
4. Use back buttons

**Expected:** Navigation is logical and accessible

---

## 📋 Testing Checklist Summary

### Must Test (Critical)
- [ ] All buttons are accessible
- [ ] All forms are accessible
- [ ] All modals work correctly
- [ ] Navigation is logical
- [ ] Images have labels
- [ ] Error messages are announced

### Should Test (Important)
- [ ] Dynamic content updates
- [ ] Loading states
- [ ] Success messages
- [ ] Keyboard shortcuts
- [ ] Focus management

### Nice to Have (Enhanced)
- [ ] Live regions for updates
- [ ] Skip links
- [ ] Landmark navigation
- [ ] Table navigation

---

## 🐛 Common Issues to Watch For

### Issue: Buttons Not Announced
**Solution:** Add `accessibilityLabel` to buttons

### Issue: Forms Not Accessible
**Solution:** Ensure inputs have labels and use `FormInput` component

### Issue: Modals Not Trapping Focus
**Solution:** Verify focus trap implementation in `BaseModal`

### Issue: Images Not Described
**Solution:** Add `accessibilityLabel` to images

### Issue: Error Messages Not Announced
**Solution:** Use `accessibilityLiveRegion` for errors

---

## 📝 Testing Notes Template

**Date:** _____________  
**Screen Reader:** _____________  
**Platform:** _____________  
**Tester:** _____________  

### Issues Found
1. **Issue:** _____________  
   **Location:** _____________  
   **Severity:** _____________  
   **Steps to Reproduce:** _____________  

2. **Issue:** _____________  
   **Location:** _____________  
   **Severity:** _____________  
   **Steps to Reproduce:** _____________  

### Positive Findings
- _____________
- _____________
- _____________

---

## ✅ Completion Criteria

### Minimum (Must Pass)
- [ ] All critical user flows are accessible
- [ ] All forms are accessible
- [ ] All modals work correctly
- [ ] Navigation is logical
- [ ] No critical accessibility blockers

### Standard (Should Pass)
- [ ] All interactive elements are accessible
- [ ] All images have labels
- [ ] Error messages are announced
- [ ] Focus management works
- [ ] Keyboard navigation works

### Enhanced (Nice to Have)
- [ ] Live regions implemented
- [ ] Skip links available
- [ ] Enhanced ARIA labels
- [ ] Comprehensive testing completed

---

**Last Updated:** January 25, 2025
