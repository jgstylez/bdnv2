import { useEffect } from 'react';
import { Platform } from 'react-native';
import { isProductionDomain } from '@/lib/subdomain-utils';
import { SEOMetadata, generateMetaTags, generateBDNStructuredData } from '@/lib/seo-utils';

/**
 * SEO Head component that manages comprehensive SEO metadata
 * Only allows indexing on production domains:
 * - blackdollarnetwork.com
 * - www.blackdollarnetwork.com
 * 
 * Prevents indexing of all other subdomains (sandbox, app, operator, developer, etc.)
 */
export interface SEOHeadProps {
  metadata?: SEOMetadata;
  structuredData?: string; // JSON-LD structured data string
  enableBDNStructuredData?: boolean; // Whether to include BDN brand structured data
}

export function SEOHead({ 
  metadata, 
  structuredData,
  enableBDNStructuredData = false 
}: SEOHeadProps) {
  useEffect(() => {
    // Only run on web platform
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    const isProduction = isProductionDomain();
    
    // Set robots meta tag
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }

    if (isProduction) {
      robotsMeta.setAttribute('content', 'index, follow');
      if (__DEV__) {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
        console.log(`[SEOHead] Production domain detected (${hostname}) - allowing indexing`);
      }
    } else {
      robotsMeta.setAttribute('content', 'noindex, nofollow');
      if (__DEV__) {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
        console.log(`[SEOHead] Non-production domain detected (${hostname}) - setting noindex, nofollow`);
      }
      // Don't add SEO metadata on non-production domains
      return;
    }

    // Add or update page title
    if (metadata?.title) {
      document.title = metadata.title;
    }

    // Add meta tags
    if (metadata) {
      const metaTagsHtml = generateMetaTags(metadata);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = metaTagsHtml;
      
      // Add each meta tag to head
      Array.from(tempDiv.children).forEach((element) => {
        const tagName = element.tagName.toLowerCase();
        const name = element.getAttribute('name') || element.getAttribute('property') || element.getAttribute('rel');
        
        if (!name) return;

        // Check if tag already exists
        let existingTag: HTMLMetaElement | HTMLLinkElement | null = null;
        
        if (tagName === 'meta') {
          existingTag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement;
        } else if (tagName === 'link') {
          existingTag = document.querySelector(`link[rel="${name}"]`) as HTMLLinkElement;
        }

        if (existingTag) {
          // Update existing tag
          if (tagName === 'meta') {
            existingTag.setAttribute('content', element.getAttribute('content') || '');
          } else if (tagName === 'link') {
            existingTag.setAttribute('href', element.getAttribute('href') || '');
          }
        } else {
          // Create new tag
          const newTag = document.createElement(tagName);
          Array.from(element.attributes).forEach((attr) => {
            newTag.setAttribute(attr.name, attr.value);
          });
          document.head.appendChild(newTag);
        }
      });
    }

    // Add structured data (JSON-LD)
    const addStructuredData = (jsonLd: string, id: string) => {
      // Remove existing script with same id
      const existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      }

      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = jsonLd;
      document.head.appendChild(script);
    };

    // Add BDN brand structured data if enabled
    if (enableBDNStructuredData) {
      const bdnStructuredData = generateBDNStructuredData();
      addStructuredData(bdnStructuredData, 'bdn-structured-data');
    }

    // Add custom structured data if provided
    if (structuredData) {
      addStructuredData(structuredData, 'custom-structured-data');
    }

    // Cleanup function
    return () => {
      // Meta tags persist, so no cleanup needed for them
      // Structured data scripts will be replaced on next render
    };
  }, [metadata, structuredData, enableBDNStructuredData]);

  return null; // This component doesn't render anything
}
