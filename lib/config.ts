/**
 * Configuration
 * 
 * Centralized configuration management
 * - Environment variables
 * - API endpoints
 * - Feature flags
 */

import Constants from 'expo-constants';

// Get environment variables
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = Constants.expoConfig?.extra?.[key] || 
                process.env[key] || 
                defaultValue;
  return value || '';
};

// API Configuration
export const API_CONFIG = {
  baseURL: getEnvVar('EXPO_PUBLIC_API_URL', 'https://api.bdn.app'),
  timeout: 30000,
  retries: 3,
} as const;

// Environment
export const ENV = {
  isDevelopment: getEnvVar('EXPO_PUBLIC_ENVIRONMENT', 'development') === 'development',
  isProduction: getEnvVar('EXPO_PUBLIC_ENVIRONMENT', 'development') === 'production',
  environment: getEnvVar('EXPO_PUBLIC_ENVIRONMENT', 'development'),
} as const;

// Feature Flags
export const FEATURES = {
  enableAnalytics: getEnvVar('EXPO_PUBLIC_ENABLE_ANALYTICS', 'false') === 'true',
  enableErrorTracking: getEnvVar('EXPO_PUBLIC_ENABLE_ERROR_TRACKING', 'false') === 'true',
} as const;

// Export all config
export const config = {
  api: API_CONFIG,
  env: ENV,
  features: FEATURES,
} as const;

