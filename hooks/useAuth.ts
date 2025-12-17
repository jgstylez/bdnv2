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

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { token } = await getAuthTokens();
      if (token) {
        setIsAuthenticated(true);
        const biometricsEnabled = await isBiometricEnabled();
        if (biometricsEnabled) {
          handleBiometricAuth();
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    // Replace with your actual API call
    // const { token, refreshToken } = await api.login(email, password);
    const token = 'fake-token'; // Replace with actual token
    await storeAuthTokens(token);
    setIsAuthenticated(true);
    router.push('/(tabs)/dashboard');
  };

  const logout = async () => {
    await clearAuthTokens();
    setIsAuthenticated(false);
    router.push('/(auth)/login');
  };

  const handleBiometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      return; // Or show an alert
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      return; // Or show an alert
    }

    const { success } = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to login',
    });

    if (success) {
      setIsAuthenticated(true);
      router.push('/(tabs)/dashboard');
    } else {
      // Handle failed authentication
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
    handleBiometricAuth,
    enableBiometrics,
    disableBiometrics,
  };
}
