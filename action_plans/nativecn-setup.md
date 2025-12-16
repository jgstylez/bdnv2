# NativeCN Setup Documentation

## Overview

NativeCN (Shadcn-inspired UI for React Native) has been successfully set up in the BDN project.

## What Was Installed

1. **NativeCN CLI** - `@nativecn/cli`
2. **NativeCN Components** - Button and Card components
3. **NativeCN Preset** - Theme configuration (`nativecn-preset.js`)
4. **Utility Functions** - `lib/utils.ts` with `cn()` helper

## Configuration Files

### Babel Config (`babel.config.js`)
- NativeWind preset with `jsxImportSource: "nativewind"`
- NativeWind Babel plugin
- React Native Reanimated plugin (must be last)

### Tailwind Config (`tailwind.config.js`)
- NativeWind preset
- NativeCN preset
- Custom BDN color scheme (for backward compatibility)

### NativeCN Preset (`nativecn-preset.js`)
- Dark theme colors matching BDN design system:
  - Background: `#232323`
  - Card: `#474747`
  - Accent: `#ba9988`
  - Text: `#ffffff`

## Components Available

### Button Component
Location: `components/ui/button/`

Usage:
```tsx
import { Button } from "components/ui";

<Button variant="default" size="default">
  Click me
</Button>
```

### Card Component
Location: `components/ui/card/`

Usage:
```tsx
import { Card } from "components/ui";

<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>
    Content here
  </Card.Content>
</Card>
```

## Adding More Components

To add additional NativeCN components:

```bash
npx @nativecn/cli add [component-name]
```

Available components include:
- `input`
- `label`
- `select`
- `textarea`
- `switch`
- `checkbox`
- `radio-group`
- `slider`
- `tabs`
- `dialog`
- `sheet`
- `dropdown-menu`
- `popover`
- `tooltip`
- `alert`
- `badge`
- `avatar`
- `separator`
- `skeleton`
- `progress`
- `toast`

## Styling Approach

### Using Tailwind Classes (NativeCN Way)
```tsx
import { View, Text } from "react-native";

<View className="bg-dark-background p-4 rounded-xl">
  <Text className="text-dark-foreground text-lg">Hello</Text>
</View>
```

### Using cn() Utility
```tsx
import { cn } from "lib/utils";

<View className={cn("bg-dark-background", isActive && "bg-dark-accent")}>
  ...
</View>
```

### Mixing with Inline Styles
You can still use inline styles alongside NativeCN components:
```tsx
<Button 
  className="bg-dark-accent"
  style={{ paddingHorizontal: 20 }}
>
  Click
</Button>
```

## Migration Strategy

1. **Gradual Migration**: Start using NativeCN components in new features
2. **Keep Existing**: Current inline-styled components continue to work
3. **Hybrid Approach**: Mix NativeCN components with custom components
4. **Refactor Over Time**: Gradually convert custom components to use NativeCN

## Theme Customization

Edit `nativecn-preset.js` to customize colors, spacing, and other design tokens.

## Resources

- [NativeCN Documentation](https://www.nativecn.xyz)
- [NativeWind Documentation](https://www.nativewind.dev)
- [Shadcn/ui (Web Reference)](https://ui.shadcn.com)

