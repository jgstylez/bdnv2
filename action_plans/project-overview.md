# BDN - Black Dollar Network

A modern, cross-platform application built with Expo and React Native for web, iOS, and Android.

## Features

- 🌐 Single codebase for web, iOS, and Android
- 🎨 Modern dark theme with custom color palette
- 📱 Mobile-first responsive design
- ✨ Smooth scroll animations and transitions
- 🎴 Bento card layout components
- 🎭 Gradient backgrounds and effects

## Design System

- **Primary Background**: #232323
- **Secondary Background**: #474747
- **Accent Color**: #ba9988
- **Primary Text**: #ffffff

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (install globally: `npm install -g expo-cli`)

### Installation

```bash
npm install
```

### Running the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## Project Structure

```
bdn2.0/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home page
├── components/             # Reusable components
│   ├── sections/          # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── BentoGrid.tsx
│   │   ├── FeatureHighlight.tsx
│   │   └── CTASection.tsx
│   ├── BentoCard.tsx
│   ├── GradientBackground.tsx
│   └── ScrollAnimatedView.tsx
├── action_plans/          # Documentation & planning
├── assets/                # Images and static assets
└── global.css             # Global styles
```

## Tech Stack

- **Expo** - Cross-platform framework
- **React Native** - UI framework
- **TypeScript** - Type safety
- **NativeWind** - Tailwind CSS for React Native
- **React Native Reanimated** - Smooth animations
- **Expo Router** - File-based routing

## Code Quality Standards

- Maximum 400 LOC per file
- Mobile-first responsive design
- TypeScript for type safety
- Component-based architecture
- Documentation in `action_plans/` folder

## License

Private

