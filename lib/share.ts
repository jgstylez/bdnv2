import { Share, Platform } from 'react-native';
import { logError } from './logger';

export interface ShareOptions {
  message: string;
  url?: string;
  title?: string;
}

/**
 * Share content using native share dialog on mobile, Web Share API on web,
 * or fallback to custom dialog on web if Web Share API is not available
 */
export async function shareContent(options: ShareOptions): Promise<boolean> {
  const { message, url, title } = options;

  try {
    // Native mobile platforms (iOS/Android)
    if (Platform.OS !== 'web') {
      const shareContent: { message?: string; url?: string; title?: string } = {};
      
      if (message) {
        shareContent.message = message;
      }
      
      if (url && Platform.OS === 'ios') {
        shareContent.url = url;
      }
      
      if (title && Platform.OS === 'android') {
        shareContent.title = title;
      }

      const result = await Share.share(shareContent, {
        dialogTitle: title || 'Share',
      });

      // On iOS, check if user dismissed the dialog
      if (Platform.OS === 'ios' && result.action === Share.dismissedAction) {
        return false;
      }

      return true;
    }

    // Web platform
    if (Platform.OS === 'web') {
      // Try Web Share API first (if available)
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          const shareData: ShareData = {
            text: message,
            title: title,
          };

          if (url) {
            shareData.url = url;
          }

          await navigator.share(shareData);
          return true;
        } catch (error: any) {
          // User cancelled or share failed
          if (error.name === 'AbortError') {
            return false;
          }
          // Fall through to fallback
        }
      }

      // Fallback: Show custom share dialog
      return showWebShareFallback(message, url || '');
    }

    return false;
  } catch (error) {
    logError('Error sharing content', error, { options });
    return false;
  }
}

/**
 * Fallback share dialog for web when Web Share API is not available
 * This version copies to clipboard as a simple fallback
 */
function showWebShareFallback(message: string, url: string): boolean {
  const fullText = url ? `${message}\n\n${url}` : message;
  
  // Create a temporary textarea to copy to clipboard
  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.value = fullText;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (successful) {
        return true;
      }
    } catch (err) {
      document.body.removeChild(textarea);
    }
  }
  
  return false;
}

/**
 * Share referral link with customized BDN App invitation message
 */
export async function shareReferralLink(referralCode: string, referralLink: string): Promise<boolean> {
  const message = `Join me on BDN! Use my referral code ${referralCode} to get started. Download the BDN App and start earning rewards!\n\n${referralLink}`;
  
  return shareContent({
    message,
    url: referralLink,
    title: 'Share BDN Referral Link',
  });
}
