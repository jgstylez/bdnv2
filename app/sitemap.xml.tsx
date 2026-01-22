import { useEffect } from 'react';
import { Platform } from 'react-native';
import { isProductionDomain } from '@/lib/subdomain-utils';
import { generateSitemap } from '@/lib/sitemap-generator';

/**
 * Sitemap.xml route handler
 * Generates XML sitemap for search engines
 * Only serves sitemap on production domains:
 * - blackdollarnetwork.com
 * - www.blackdollarnetwork.com
 * 
 * Returns empty/blocked response on all other domains
 * 
 * NOTE: For proper XML serving with correct content-type headers,
 * this should be configured at the server/deployment level (Vercel, Netlify, etc.)
 * This component provides a fallback that displays the XML content.
 */
export default function SitemapXml() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const isProduction = isProductionDomain();
    
    if (!isProduction) {
      // On non-production domains, return 404 or empty response
      document.body.innerHTML = '<h1>404 Not Found</h1>';
      if (__DEV__) {
        const hostname = window.location.hostname;
        console.log(`[SitemapXml] Non-production domain (${hostname}) - blocking sitemap access`);
      }
      return;
    }

    // Generate sitemap XML using the utility function
    // Use the current domain (could be www or non-www) as base URL
    const baseUrl = typeof window !== 'undefined' 
      ? `https://${window.location.hostname}` 
      : 'https://blackdollarnetwork.com';
    const sitemap = generateSitemap(baseUrl);
    
    // Set content type and display XML
    // Note: For proper XML serving, this should be handled server-side
    // This is a fallback that displays the XML content
    document.body.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word; padding: 20px; font-family: monospace; background: #f5f5f5;">${escapeHtml(sitemap)}</pre>`;
    
    // Set content type header (if possible)
    if (__DEV__) {
      console.log('[SitemapXml] Sitemap generated for production domain');
      console.log('[SitemapXml] XML Content:', sitemap);
    }
  }, []);

  return null;
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
