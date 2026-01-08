import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import Constants from "expo-constants";

// Helper function to get Firebase config values
// Supports both EXPO_PUBLIC_* env vars and Constants.expoConfig?.extra (for backwards compatibility)
const getFirebaseConfigValue = (key: string): string => {
  // Convert camelCase to UPPER_SNAKE_CASE (e.g., firebaseApiKey -> FIREBASE_API_KEY)
  const envKey = `EXPO_PUBLIC_${key
    .replace(/([A-Z])/g, "_$1")
    .toUpperCase()}`;
  return (
    process.env[envKey] ||
    Constants.expoConfig?.extra?.[key] ||
    Constants.expoConfig?.extra?.[envKey] ||
    ""
  );
};

const firebaseConfig = {
  apiKey: getFirebaseConfigValue("firebaseApiKey"),
  authDomain: getFirebaseConfigValue("firebaseAuthDomain"),
  projectId: getFirebaseConfigValue("firebaseProjectId"),
  storageBucket: getFirebaseConfigValue("firebaseStorageBucket"),
  messagingSenderId: getFirebaseConfigValue("firebaseMessagingSenderId"),
  appId: getFirebaseConfigValue("firebaseAppId"),
};

// Check if Firebase is configured
const isFirebaseConfigured = (): boolean => {
  const requiredFields = ["apiKey", "authDomain", "projectId", "appId"];
  return requiredFields.every(
    (field) => firebaseConfig[field as keyof typeof firebaseConfig]
  );
};

export const FIREBASE_ENABLED = isFirebaseConfigured();

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (FIREBASE_ENABLED) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    // Firebase initialization failed - app will run in development mode
    // Silently fail to avoid console noise in development
  }
} else {
  // Firebase is not configured - app will run in development mode
  // This is expected behavior for local development
}

export { auth, db };
