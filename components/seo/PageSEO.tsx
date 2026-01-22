import { SEOHead } from '@/components/SEOHead';
import { SEOMetadata, shouldEnableSEO } from '@/lib/seo-utils';

/**
 * Generic SEO component for any page
 * Provides comprehensive SEO metadata
 */
export interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'business.business' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  enableBDNStructuredData?: boolean;
  customStructuredData?: string;
}

export function PageSEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  enableBDNStructuredData = false,
  customStructuredData,
}: PageSEOProps) {
  if (!shouldEnableSEO()) {
    return null;
  }

  const baseUrl = typeof window !== 'undefined' 
    ? `https://${window.location.hostname}` 
    : 'https://blackdollarnetwork.com';
  
  const metadata: SEOMetadata = {
    title,
    description,
    keywords,
    image: image || `${baseUrl}/bdn-logo.svg`,
    url: url || (typeof window !== 'undefined' ? window.location.href : baseUrl),
    type,
    author: author || 'Black Dollar Network',
    publishedTime,
    modifiedTime,
    canonicalUrl: url || (typeof window !== 'undefined' ? window.location.href : baseUrl),
  };

  return (
    <SEOHead 
      metadata={metadata}
      structuredData={customStructuredData}
      enableBDNStructuredData={enableBDNStructuredData}
    />
  );
}
