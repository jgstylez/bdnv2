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
import { auth, db } from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        await storeAuthTokens(token);
        setIsAuthenticated(true);
        const biometricsEnabled = await isBiometricEnabled();
        if (biometricsEnabled) {
          handleBiometricAuth();
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/(tabs)/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Create a new document in the 'users' collection
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
      });
      router.push('/(tabs)/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    await clearAuthTokens();
    setIsAuthenticated(false);
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
    login,
    logout,
    signup,
    handleBiometricAuth,
    enableBiometrics,
    disableBiometrics,
  };
}
