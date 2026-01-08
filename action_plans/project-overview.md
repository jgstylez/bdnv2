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
bdnv2/
├── app/                    # Expo Router pages (174+ files)
│   ├── (tabs)/            # Core tab navigation (Dashboard, Shop, Pay, Account)
│   ├── (auth)/            # Authentication flows (Login, Signup, PIN)
│   ├── pages/             # All other pages (businesses, products, events, etc.)
│   ├── admin/             # Admin dashboard
│   ├── developer/         # Developer dashboard
│   └── public_pages/      # Public marketing pages
├── components/            # Reusable components (118+ files)
│   ├── admin/            # Admin-specific components
│   ├── forms/            # Form components
│   ├── header/           # Header components
│   ├── optimized/        # Performance-optimized components
│   └── ...               # Feature-specific components
├── contexts/              # React Context providers (5 files)
├── hooks/                 # Custom React hooks (9 files)
├── lib/                   # Utility libraries (15+ files)
├── types/                 # TypeScript type definitions (27 files)
├── data/mocks/            # Mock data for development
├── action_plans/          # Documentation & planning
├── assets/                # Images and static assets
└── server/                # Backend server code
```

## Tech Stack

- **Expo** ~51.0.0 - Cross-platform framework
- **React Native** ^0.74.5 - UI framework
- **TypeScript** ~5.3.3 - Type safety
- **NativeWind** ^4.0.1 - Tailwind CSS for React Native
- **NativeCN** ^0.3.7 - Shadcn-inspired UI components
- **React Native Reanimated** ~3.10.0 - Smooth animations
- **Expo Router** ~3.5.0 - File-based routing
- **Firebase** ^12.7.0 - Authentication and Firestore
- **React Native Toast Message** ^2.3.3 - Toast notifications

## Code Quality Standards

- Maximum 400 LOC per file
- Mobile-first responsive design
- TypeScript for type safety
- Component-based architecture
- Documentation in `action_plans/` folder

## License

Private

