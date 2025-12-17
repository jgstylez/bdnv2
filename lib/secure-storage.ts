/**
 * Secure Storage Utilities
 * 
 * Wrapper around expo-secure-store for secure data storage
 * - Tokens (auth, refresh)
 * - PIN codes
 * - Sensitive user data
 * - Payment methods (if storing locally)
 */

import * as SecureStore from 'expo-secure-store';
import { logger } from './logger';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  PIN: 'userPin',
  BIOMETRIC_ENABLED: 'biometricEnabled',
  SELECTED_BUSINESS: 'selectedBusiness',
  SELECTED_NONPROFIT: 'selectedNonprofit',
} as const;

/**
 * Store a value securely
 */
export async function setSecureItem(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
    logger.debug(`Stored secure item: ${key}`);
  } catch (error) {
    logger.error(`Failed to store secure item: ${key}`, error);
    throw new Error(`Failed to store ${key}`);
  }
}

/**
 * Get a value from secure storage
 */
export async function getSecureItem(key: string): Promise<string | null> {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value;
  } catch (error) {
    logger.error(`Failed to get secure item: ${key}`, error);
    return null;
  }
}

/**
 * Delete a value from secure storage
 */
export async function deleteSecureItem(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
    logger.debug(`Deleted secure item: ${key}`);
  } catch (error) {
    logger.error(`Failed to delete secure item: ${key}`, error);
    throw new Error(`Failed to delete ${key}`);
  }
}

/**
 * Check if a key exists in secure storage
 */
export async function hasSecureItem(key: string): Promise<boolean> {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Clear all secure storage (use with caution)
 */
export async function clearAllSecureStorage(): Promise<void> {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await Promise.all(keys.map(key => deleteSecureItem(key)));
    logger.info('Cleared all secure storage');
  } catch (error) {
    logger.error('Failed to clear secure storage', error);
    throw error;
  }
}

/**
 * Store auth tokens
 */
export async function storeAuthTokens(token: string, refreshToken?: string): Promise<void> {
  await setSecureItem(STORAGE_KEYS.AUTH_TOKEN, token);
  if (refreshToken) {
    await setSecureItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
}

/**
 * Get auth tokens
 */
export async function getAuthTokens(): Promise<{ token: string | null; refreshToken: string | null }> {
  const token = await getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
  const refreshToken = await getSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
  return { token, refreshToken };
}

/**
 * Clear auth tokens
 */
export async function clearAuthTokens(): Promise<void> {
  await deleteSecureItem(STORAGE_KEYS.AUTH_TOKEN);
  await deleteSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Store PIN securely
 */
export async function storePIN(pin: string): Promise<void> {
  await setSecureItem(STORAGE_KEYS.PIN, pin);
}

/**
 * Get PIN
 */
export async function getPIN(): Promise<string | null> {
  return getSecureItem(STORAGE_KEYS.PIN);
}

/**
 * Clear PIN
 */
export async function clearPIN(): Promise<void> {
  await deleteSecureItem(STORAGE_KEYS.PIN);
}

/**
 * Enable or disable biometric authentication
 */
export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  await setSecureItem(STORAGE_KEYS.BIOMETRIC_ENABLED, JSON.stringify(enabled));
}

/**
 * Check if biometric authentication is enabled
 */
export async function isBiometricEnabled(): Promise<boolean> {
  const value = await getSecureItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
  return value ? JSON.parse(value) : false;
}
