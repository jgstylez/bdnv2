# BDN Architecture Documentation

## Project Structure

```
bdn2.0/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home page
├── components/             # Reusable components
│   ├── sections/          # Page sections
│   ├── ui/                # UI primitives
│   └── ...                # Feature components
├── constants/             # App constants
├── utils/                  # Utility functions
├── styles/                 # Shared styles
├── action_plans/          # Documentation & planning
└── assets/                # Static assets
```

## Technology Stack

- **Expo** (~54.0.0) - Cross-platform framework
- **React Native** (0.81.5) - UI framework
- **React** (^19.1.0) - UI library
- **TypeScript** (~5.9.2) - Type safety
- **Expo Router** (~6.0.21) - File-based routing
- **NativeWind** (^4.0.1) - Tailwind CSS for RN
- **NativeCN** (@nativecn/cli ^0.3.7) - Shadcn-inspired UI components for React Native
- **React Native Reanimated** (~4.1.1) - Animations
- **expo-image** (~3.0.11) - Optimized image component
- **Expo Linear Gradient** (~15.0.8) - Gradients

## Design System

### Colors
- Primary Background: `#232323`
- Secondary Background: `#474747`
- Accent: `#ba9988`
- Primary Text: `#ffffff`

### Typography
- System font stack
- Responsive sizing (mobile-first)
- Font weights: 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold)

### Spacing
- Mobile: 20px horizontal padding
- Desktop: 40px horizontal padding
- Consistent vertical spacing: 16, 32, 48, 60, 80px

### Border Radius
- Small: 16px
- Medium: 24px
- Large: 32px

## Component Guidelines

1. **Keep components under 400 LOC**
2. **Mobile-first responsive design**
3. **Use TypeScript for all components**
4. **Extract reusable logic into hooks**
5. **Use NativeCN components when possible** (Button, Card, etc.)
6. **Use Tailwind classes via NativeWind** for styling
7. **Mix NativeCN with custom components** as needed
8. **Use `cn()` utility** for conditional class names

## Responsive Design Guidelines

### Mobile Definition
When referring to "mobile" in this codebase, it encompasses **both**:
1. **Mobile browser breakpoints** (responsive web design, typically < 768px width)
2. **Native mobile display** (React Native/Expo apps running on iOS and Android devices)

This means that any mobile-specific styling, layout, or behavior should work consistently across:
- Mobile web browsers (responsive breakpoints)
- Native iOS apps
- Native Android apps

### Implementation Notes
- Use `isMobile` checks from `useResponsive()` hook or `useWindowDimensions()` for breakpoint detection
- Mobile-first approach: design for mobile first, then enhance for larger screens
- Ensure touch targets are appropriately sized for mobile (minimum 44x44px)
- Test layouts on both mobile web and native mobile apps
- When implementing mobile-specific features, ensure they work in both contexts

### Breakpoints
- **Mobile:** < 768px width
- **Tablet:** 768px - 1024px width
- **Desktop:** > 1024px width

## Animation Guidelines

- Use React Native Reanimated for all animations
- Stagger animations with delays (200ms increments)
- Use spring animations for natural feel
- Keep animation durations between 600-1000ms

