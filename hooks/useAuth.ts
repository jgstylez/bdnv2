import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import {
  getAuthTokens,
  storeAuthTokens,
  clearAuthTokens,
  isBiometricEnabled,
  setBiometricEnabled,
} from '../lib/secure-storage';
import { auth, db, FIREBASE_ENABLED } from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Development mode: Allow viewing app without Firebase
const DEV_MODE_AUTH = !FIREBASE_ENABLED;

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(DEV_MODE_AUTH);
  const [isLoading, setIsLoading] = useState(!DEV_MODE_AUTH);
  const [user, setUser] = useState<any>(DEV_MODE_AUTH ? { email: 'dev@example.com', role: 'user' } : null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If Firebase is not configured, run in development mode
    if (DEV_MODE_AUTH) {
      setIsLoading(false);
      return;
    }

    // Firebase is configured, use normal auth flow
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        await storeAuthTokens(token);
        setIsAuthenticated(true);
        if (db) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(userData);
            if (userData.role === 'admin') {
              setIsAdmin(true);
            }
          }
        }
        const biometricsEnabled = await isBiometricEnabled();
        if (biometricsEnabled) {
          handleBiometricAuth();
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (DEV_MODE_AUTH) {
      // Development mode: auto-login
      setIsAuthenticated(true);
      setUser({ email, role: 'user' });
      router.push('/(tabs)/dashboard');
      return;
    }

    if (!auth) {
      console.error('Firebase auth is not available');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/(tabs)/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const signup = async (email, password) => {
    if (DEV_MODE_AUTH) {
      // Development mode: auto-signup
      setIsAuthenticated(true);
      setUser({ email, role: 'user' });
      router.push('/(tabs)/dashboard');
      return;
    }

    if (!auth || !db) {
      console.error('Firebase is not available');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Create a new document in the 'users' collection
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
        role: 'user', // Assign a default role of 'user'
      });
      router.push('/(tabs)/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const logout = async () => {
    if (DEV_MODE_AUTH) {
      // Development mode: just clear local state
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
      await clearAuthTokens();
      router.push('/(auth)/login');
      return;
    }

    if (!auth) {
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
      await clearAuthTokens();
      router.push('/(auth)/login');
      return;
    }

    await signOut(auth);
    await clearAuthTokens();
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    router.push('/(auth)/login');
  };

  const handleBiometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      return;
    }

    const { success } = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to login',
    });

    if (success) {
      setIsAuthenticated(true);
      router.push('/(tabs)/dashboard');
    }
  };

  const enableBiometrics = async () => {
    await setBiometricEnabled(true);
  };

  const disableBiometrics = async () => {
    await setBiometricEnabled(false);
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    isAdmin,
    login,
    logout,
    signup,
    handleBiometricAuth,
    enableBiometrics,
    disableBiometrics,
  };
}
