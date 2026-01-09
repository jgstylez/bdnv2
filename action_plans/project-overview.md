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
├── app/                    # Expo Router pages (183 files)
│   ├── (tabs)/            # Core tab navigation (Dashboard, Marketplace, Pay, Account)
│   ├── (auth)/            # Authentication flows (Login, Signup, PIN, Onboarding)
│   ├── pages/             # All other pages (~120+ files)
│   │   ├── businesses/    # Business pages
│   │   ├── products/      # Product pages
│   │   ├── events/        # Event pages
│   │   ├── merchant/      # Merchant platform
│   │   ├── nonprofit/      # Nonprofit pages
│   │   ├── myimpact/      # MyImpact rewards
│   │   ├── university/     # BDN University
│   │   ├── media/         # Media/BDN TV
│   │   ├── search/         # Search functionality
│   │   └── ...            # Other feature pages
│   ├── admin/             # Admin dashboard (30 files)
│   ├── developer/         # Developer dashboard (8 files)
│   └── public_pages/      # Public marketing pages (13 files)
├── components/            # Reusable components (154 files)
│   ├── admin/            # Admin-specific components
│   ├── forms/            # Form components (11 files)
│   ├── header/           # Header components (7 files)
│   ├── optimized/        # Performance-optimized components (6 files)
│   ├── tokens/           # Token-related components (11 files)
│   ├── c2b-payment/      # C2B payment components (8 files)
│   └── ...               # Feature-specific components
├── contexts/              # React Context providers (5 files)
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── FeatureFlagsContext.tsx
│   ├── BusinessContext.tsx
│   └── NonprofitContext.tsx
├── hooks/                 # Custom React hooks (9 files)
├── lib/                   # Utility libraries (20+ files)
├── types/                 # TypeScript type definitions (27 files)
├── data/mocks/            # Mock data for development
├── action_plans/          # Documentation & planning
├── assets/                # Images and static assets
└── server/                # Backend server code
```

## Tech Stack

- **Expo** ~54.0.0 - Cross-platform framework
- **React Native** 0.81.5 - UI framework
- **React** ^19.1.0 - UI library
- **TypeScript** ~5.9.2 - Type safety
- **NativeWind** ^4.0.1 - Tailwind CSS for React Native
- **NativeCN** ^0.3.7 - Shadcn-inspired UI components
- **React Native Reanimated** ~4.1.1 - Smooth animations
- **Expo Router** ~6.0.21 - File-based routing
- **Firebase** ^12.7.0 - Authentication and Firestore
- **React Native Toast Message** ^2.3.3 - Toast notifications
- **expo-image** ~3.0.11 - Optimized image component

## Code Quality Standards

- Maximum 400 LOC per file
- Mobile-first responsive design
- TypeScript for type safety
- Component-based architecture
- Documentation in `action_plans/` folder

## License

Private

