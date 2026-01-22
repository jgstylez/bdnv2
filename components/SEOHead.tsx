import { useEffect } from 'react';
import { Platform } from 'react-native';
import { isProductionDomain } from '@/lib/subdomain-utils';

/**
 * SEO Head component that manages meta robots tags based on domain
 * Only allows indexing on production domains:
 * - blackdollarnetwork.com
 * - www.blackdollarnetwork.com
 * 
 * Prevents indexing of all other subdomains (sandbox, app, operator, developer, etc.)
 */
export function SEOHead() {
  useEffect(() => {
    // Only run on web platform
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    const isProduction = isProductionDomain();
    
    // Find or create robots meta tag
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }

    // Set robots content based on domain
    if (isProduction) {
      // Allow indexing on production domains (blackdollarnetwork.com and www.blackdollarnetwork.com)
      robotsMeta.setAttribute('content', 'index, follow');
      if (__DEV__) {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
        console.log(`[SEOHead] Production domain detected (${hostname}) - allowing indexing`);
      }
    } else {
      // Prevent indexing of all subdomains (sandbox, app, operator, developer, etc.)
      robotsMeta.setAttribute('content', 'noindex, nofollow');
      if (__DEV__) {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
        console.log(`[SEOHead] Non-production domain detected (${hostname}) - setting noindex, nofollow`);
      }
    }

    // Cleanup function (optional, but good practice)
    return () => {
      // Meta tags persist, so no cleanup needed
    };
  }, []);

  return null; // This component doesn't render anything
}
