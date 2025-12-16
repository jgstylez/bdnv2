# NativeCN Usage Examples

## Basic Button Usage

```tsx
import { Button } from "components/ui";

// Default button
<Button variant="default" mode="dark">
  Click me
</Button>

// Accent colored button (BDN theme)
<Button 
  variant="default" 
  mode="dark"
  className="bg-dark-accent"
>
  Get Started
</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// Variants
<Button variant="outline" mode="dark">Outline</Button>
<Button variant="secondary" mode="dark">Secondary</Button>
<Button variant="ghost" mode="dark">Ghost</Button>
```

## Card Component Usage

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "components/ui";

<Card mode="dark" className="bg-dark-card">
  <CardHeader>
    <CardTitle mode="dark">Card Title</CardTitle>
    <CardDescription mode="dark">
      This is a description
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Text className="text-dark-foreground">
      Your content here
    </Text>
  </CardContent>
</Card>
```

## Mixing NativeCN with Custom Components

```tsx
import { View, Text } from "react-native";
import { Button } from "components/ui";
import { BentoCard } from "../BentoCard";

// You can mix NativeCN components with your custom components
<View className="bg-dark-background p-4">
  <BentoCard title="Custom Card" />
  <Button variant="default" mode="dark" className="mt-4">
    NativeCN Button
  </Button>
</View>
```

## Using Tailwind Classes

```tsx
import { View, Text } from "react-native";
import { cn } from "lib/utils";

// Basic Tailwind classes
<View className="bg-dark-background p-4 rounded-xl">
  <Text className="text-dark-foreground text-lg font-bold">
    Hello BDN
  </Text>
</View>

// Conditional classes with cn()
<View className={cn(
  "bg-dark-card p-4 rounded-lg",
  isActive && "bg-dark-accent",
  disabled && "opacity-50"
)}>
  <Text className="text-dark-foreground">Content</Text>
</View>
```

## Responsive Design with NativeCN

```tsx
import { View, useWindowDimensions } from "react-native";
import { Button } from "components/ui";

const { width } = useWindowDimensions();
const isMobile = width < 768;

<Button
  size={isMobile ? "default" : "lg"}
  className={cn(
    "bg-dark-accent",
    isMobile ? "px-6" : "px-12"
  )}
>
  Responsive Button
</Button>
```

## Dark Theme Colors Available

All colors from `nativecn-preset.js` are available:

- `bg-dark-background` - #232323
- `bg-dark-card` - #474747
- `bg-dark-accent` - #ba9988
- `text-dark-foreground` - #ffffff
- `text-dark-muted-foreground` - rgba(255, 255, 255, 0.7)
- `border-dark-border` - #474747

## Adding More Components

To add more NativeCN components:

```bash
# Add single component
npx @nativecn/cli add input

# Add multiple components
npx @nativecn/cli add input label textarea select

# Add with custom directory
npx @nativecn/cli add button --dir components/custom-ui
```

## Best Practices

1. **Use `mode="dark"`** for all components to match BDN theme
2. **Use `cn()` utility** for conditional classes
3. **Mix with inline styles** when needed for complex layouts
4. **Keep custom components** that work well, gradually migrate
5. **Use Tailwind classes** for spacing, colors, and layout

