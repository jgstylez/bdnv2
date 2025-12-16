import { logger } from './logger';
import Toast from 'react-native-toast-message';

/**
 * Get a user-friendly error message from a generic error.
 * This can be expanded to handle specific error codes or types.
 */
function getUserFriendlyMessage(error: any): string {
  if (error.message) {
    if (error.message.includes('Network request failed')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    // You can add more specific checks here for different error messages
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Centralized error handler.
 * 
 * @param error The error object.
 * @param context A string providing context for the error (e.g., the name of the function where the error occurred).
 */
export function handleError(error: any, context?: string) {
  const message = `Error in ${context || 'unspecified context'}`;
  logger.error(message, error);

  // Show a user-friendly toast message
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: getUserFriendlyMessage(error),
  });

  // In a production environment, you would also send the error to a tracking service like Sentry.
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { extra: { context } });
  // }
}
