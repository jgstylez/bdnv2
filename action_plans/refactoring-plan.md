# BDN Refactoring Plan

## Code Organization Principles

1. **Maximum 400 LOC per file** - All files should be kept under 400 lines of code for maintainability
2. **Component extraction** - Break down large components into smaller, reusable pieces
3. **Separation of concerns** - Keep UI, logic, and styling separate where possible
4. **Documentation** - All documentation goes in the `action_plans` folder

## Current File Analysis

### Files Under 400 LOC ✅
- `components/BentoCard.tsx` - 95 lines
- `components/ScrollAnimatedView.tsx` - 49 lines
- `components/GradientBackground.tsx` - 27 lines
- `app/_layout.tsx` - 20 lines

### Files to Refactor 🔄
- ~~`app/index.tsx` - 263 lines~~ ✅ **COMPLETED** - Now 50 lines

## Refactoring Strategy

### Phase 1: Extract Page Sections ✅ COMPLETED
- [x] Extract Hero section into `components/sections/HeroSection.tsx` (67 lines)
- [x] Extract Bento Grid into `components/sections/BentoGrid.tsx` (78 lines)
- [x] Extract Feature Highlight into `components/sections/FeatureHighlight.tsx` (67 lines)
- [x] Extract CTA section into `components/sections/CTASection.tsx` (52 lines)
- [x] Refactor `app/index.tsx` to use extracted sections (50 lines)

### Phase 2: Extract Reusable Components
- [ ] Create `components/Button.tsx` for reusable button component
- [ ] Create `components/Typography.tsx` for text components
- [ ] Create `components/Container.tsx` for responsive containers

### Phase 3: Extract Styles & Constants
- [ ] Create `constants/theme.ts` for color and spacing constants
- [ ] Create `utils/responsive.ts` for responsive utilities
- [ ] Create `styles/` folder for shared style objects

## Future Considerations

- As features grow, continue to extract components
- Keep page components focused on composition, not implementation
- Use hooks for shared logic (e.g., `useResponsive`, `useAnimations`)

