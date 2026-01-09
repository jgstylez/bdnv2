/**
 * Cross-platform Storage Utility
 * 
 * Provides a unified storage API that works across:
 * - React Native (iOS/Android) - uses AsyncStorage if available
 * - Web - uses localStorage
 * - Expo Go - gracefully falls back to in-memory storage
 */

import { Platform } from "react-native";
import { logger } from "./logger";

// Try to import AsyncStorage for React Native
let AsyncStorage: any = null;
try {
  AsyncStorage = require("@react-native-async-storage/async-storage").default;
} catch {
  // AsyncStorage not available - will use fallback
}

// In-memory storage fallback for environments without persistent storage
const memoryStorage: Record<string, string> = {};

/**
 * Check if localStorage is available (web only)
 */
function isLocalStorageAvailable(): boolean {
  if (Platform.OS !== "web") {
    return false;
  }
  
  try {
    if (typeof window === "undefined") {
      return false;
    }
    
    // Check if localStorage exists and is accessible
    if (!window.localStorage) {
      return false;
    }
    
    // Test if we can actually use it
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, "test");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get an item from storage
 */
export async function getStorageItem(key: string): Promise<string | null> {
  try {
    // Use AsyncStorage if available (React Native)
    if (AsyncStorage) {
      return await AsyncStorage.getItem(key);
    }
    
    // Use localStorage if available (Web)
    if (isLocalStorageAvailable()) {
      return window.localStorage.getItem(key);
    }
    
    // Fallback to in-memory storage
    return memoryStorage[key] || null;
  } catch (error) {
    logger.error(`Error getting storage item: ${key}`, error);
    return null;
  }
}

/**
 * Set an item in storage
 */
export async function setStorageItem(key: string, value: string): Promise<void> {
  try {
    // Use AsyncStorage if available (React Native)
    if (AsyncStorage) {
      await AsyncStorage.setItem(key, value);
      return;
    }
    
    // Use localStorage if available (Web)
    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(key, value);
      return;
    }
    
    // Fallback to in-memory storage
    memoryStorage[key] = value;
  } catch (error) {
    logger.error(`Error setting storage item: ${key}`, error);
    // Don't throw - gracefully degrade to in-memory storage
    memoryStorage[key] = value;
  }
}

/**
 * Remove an item from storage
 */
export async function removeStorageItem(key: string): Promise<void> {
  try {
    // Use AsyncStorage if available (React Native)
    if (AsyncStorage) {
      await AsyncStorage.removeItem(key);
      return;
    }
    
    // Use localStorage if available (Web)
    if (isLocalStorageAvailable()) {
      window.localStorage.removeItem(key);
      return;
    }
    
    // Fallback to in-memory storage
    delete memoryStorage[key];
  } catch (error) {
    logger.error(`Error removing storage item: ${key}`, error);
    // Don't throw - gracefully degrade
    delete memoryStorage[key];
  }
}

/**
 * Clear all storage
 */
export async function clearStorage(): Promise<void> {
  try {
    // Use AsyncStorage if available (React Native)
    if (AsyncStorage) {
      await AsyncStorage.clear();
      return;
    }
    
    // Use localStorage if available (Web)
    if (isLocalStorageAvailable()) {
      window.localStorage.clear();
      return;
    }
    
    // Fallback to in-memory storage
    Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
  } catch (error) {
    logger.error("Error clearing storage", error);
  }
}

/**
 * Get all keys from storage
 */
export async function getAllStorageKeys(): Promise<string[]> {
  try {
    // Use AsyncStorage if available (React Native)
    if (AsyncStorage) {
      return await AsyncStorage.getAllKeys();
    }
    
    // Use localStorage if available (Web)
    if (isLocalStorageAvailable()) {
      return Object.keys(window.localStorage);
    }
    
    // Fallback to in-memory storage
    return Object.keys(memoryStorage);
  } catch (error) {
    logger.error("Error getting storage keys", error);
    return [];
  }
}
