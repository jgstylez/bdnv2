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

- **Expo** (~51.0.0) - Cross-platform framework
- **React Native** (^0.74.5) - UI framework
- **TypeScript** - Type safety
- **Expo Router** (~3.5.0) - File-based routing
- **NativeWind** (^4.0.1) - Tailwind CSS for RN
- **NativeCN** - Shadcn-inspired UI components for React Native
- **React Native Reanimated** (~3.10.0) - Animations
- **Expo Linear Gradient** (~13.0.2) - Gradients

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

## Animation Guidelines

- Use React Native Reanimated for all animations
- Stagger animations with delays (200ms increments)
- Use spring animations for natural feel
- Keep animation durations between 600-1000ms

