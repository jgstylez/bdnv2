import * as Clipboard from 'expo-clipboard';
import { logError } from './logger';

/**
 * Copy text to clipboard
 * Works on web, iOS, and Android using expo-clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await Clipboard.setStringAsync(text);
    return true;
  } catch (error) {
    logError('Error copying to clipboard', error, { textLength: text.length });
    return false;
  }
}
