# BDN - Black Dollar Network

Modern, cross-platform application (web, iOS, Android) built with Expo and React Native.

## Quick Start

```bash
npm install
npm start
```

## Environment Setup

### Firebase Configuration (Optional for Development)

Firebase is used for authentication and Firestore in production. **For development, you can run the app without Firebase configured** - it will automatically run in development mode with mock authentication.

To enable Firebase, set up your Firebase project and configure the following environment variables:

**Option 1: Using `.env` file (recommended for development)**

Create a `.env` file in the root directory:

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

**Option 2: Using `app.json` (for build-time config)**

Add Firebase config to `app.json` under `expo.extra`:

```json
{
  "expo": {
    "extra": {
      "firebaseApiKey": "your-firebase-api-key",
      "firebaseAuthDomain": "your-project.firebaseapp.com",
      "firebaseProjectId": "your-project-id",
      "firebaseStorageBucket": "your-project.appspot.com",
      "firebaseMessagingSenderId": "your-messaging-sender-id",
      "firebaseAppId": "your-app-id"
    }
  }
}
```

**Getting Firebase Credentials:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app icon (`</>`) to add a web app
6. Copy the config values from the Firebase SDK setup

**Note:** For production builds, use EAS Secrets to securely store Firebase credentials:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_API_KEY --value your-api-key
```

### Development Mode (Without Firebase)

If Firebase is not configured, the app will automatically run in **development mode**:
- You'll be automatically logged in as a mock user (`dev@example.com`)
- All authentication flows will work without Firebase
- Feature flags will use default values
- You can view and test the entire app without setting up Firebase

This is perfect for:
- UI/UX development and testing
- Frontend feature development
- Design review and iteration
- Local development without backend dependencies

**To disable development mode**, simply configure Firebase as described above.

## Documentation

All project documentation is located in the [`action_plans/`](./action_plans/) folder:

- [Project Overview](./action_plans/project-overview.md) - Complete project documentation
- [Architecture](./action_plans/architecture.md) - Architecture and design system
- [Refactoring Plan](./action_plans/refactoring-plan.md) - Code organization strategy

## Key Features

- Single codebase for all platforms
- Dark theme with custom color palette
- Mobile-first responsive design
- Smooth animations and transitions
- Component-based architecture (max 400 LOC per file)
