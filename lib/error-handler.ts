/**
 * Error Handler
 * 
 * Centralized error handling and user-friendly error messages
 * - Transforms API errors to user-friendly messages
 * - Handles different error types
 * - Provides error recovery suggestions
 */

import { Alert, Platform } from 'react-native';
import { ApiError } from './api-client';
import { logger } from './logger';

export interface UserFriendlyError {
  title: string;
  message: string;
  action?: string;
  onAction?: () => void;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: Error | ApiError | unknown): UserFriendlyError {
  // Handle API errors
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const apiError = error as ApiError;
    
    switch (apiError.statusCode) {
      case 400:
        return {
          title: 'Invalid Request',
          message: apiError.message || 'Please check your input and try again.',
        };
      case 401:
        return {
          title: 'Authentication Required',
          message: 'Please log in to continue.',
          action: 'Go to Login',
        };
      case 403:
        return {
          title: 'Access Denied',
          message: 'You don\'t have permission to perform this action.',
        };
      case 404:
        return {
          title: 'Not Found',
          message: 'The requested resource could not be found.',
        };
      case 409:
        return {
          title: 'Conflict',
          message: apiError.message || 'This action conflicts with existing data.',
        };
      case 422:
        return {
          title: 'Validation Error',
          message: apiError.message || 'Please check your input and try again.',
        };
      case 429:
        return {
          title: 'Too Many Requests',
          message: 'Please wait a moment and try again.',
        };
      case 500:
      case 502:
      case 503:
        return {
          title: 'Server Error',
          message: 'Something went wrong on our end. Please try again later.',
        };
      default:
        return {
          title: 'Error',
          message: apiError.message || 'An unexpected error occurred.',
        };
    }
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      title: 'Connection Error',
      message: 'Please check your internet connection and try again.',
    };
  }

  // Handle generic errors
  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes('timeout')) {
      return {
        title: 'Request Timeout',
        message: 'The request took too long. Please try again.',
      };
    }

    if (error.message.includes('network')) {
      return {
        title: 'Network Error',
        message: 'Please check your internet connection and try again.',
      };
    }

    return {
      title: 'Error',
      message: error.message || 'An unexpected error occurred.',
    };
  }

  // Fallback
  return {
    title: 'Error',
    message: 'An unexpected error occurred. Please try again.',
  };
}

/**
 * Show error alert to user
 */
export function showErrorAlert(
  error: Error | ApiError | unknown,
  options?: {
    title?: string;
    onDismiss?: () => void;
    showRetry?: boolean;
    onRetry?: () => void;
  }
): void {
  const { title, onDismiss, showRetry, onRetry } = options || {};
  const friendlyError = getUserFriendlyMessage(error);

  const buttons: any[] = [];

  if (showRetry && onRetry) {
    buttons.push({
      text: 'Retry',
      onPress: onRetry,
      style: 'default',
    });
  }

  buttons.push({
    text: 'OK',
    onPress: onDismiss,
    style: 'default',
  });

  Alert.alert(
    title || friendlyError.title,
    friendlyError.message,
    buttons,
    { cancelable: true }
  );
}

/**
 * Handle API error with logging and user notification
 */
export function handleApiError(
  error: Error | ApiError | unknown,
  context?: string,
  options?: {
    showAlert?: boolean;
    onRetry?: () => void;
  }
): void {
  const { showAlert = true, onRetry } = options || {};

  // Log error
  logger.error(`API Error${context ? ` in ${context}` : ''}`, error);

  // Show alert if requested
  if (showAlert) {
    showErrorAlert(error, {
      showRetry: !!onRetry,
      onRetry,
    });
  }
}

/**
 * Handle error silently (log only, no user notification)
 */
export function handleErrorSilently(
  error: Error | ApiError | unknown,
  context?: string
): void {
  logger.error(`Error${context ? ` in ${context}` : ''}`, error);
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: Error | ApiError | unknown): boolean {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const apiError = error as ApiError;
    // Retry on server errors (5xx) and rate limiting (429)
    return apiError.statusCode === undefined || 
           apiError.statusCode >= 500 || 
           apiError.statusCode === 429;
  }

  // Retry on network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  return false;
}

