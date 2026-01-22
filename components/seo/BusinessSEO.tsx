import { SEOHead } from '@/components/SEOHead';
import { Merchant } from '@/types/merchant';
import { 
  generateBusinessStructuredData, 
  generateBusinessKeywords,
  getBusinessPublicUrl,
  SEOMetadata,
  shouldEnableSEO 
} from '@/lib/seo-utils';

/**
 * SEO component for business/merchant detail pages
 * Provides comprehensive SEO metadata including structured data
 */
export interface BusinessSEOProps {
  business: Merchant & { rating?: number; reviewCount?: number; imageUrl?: string };
}

export function BusinessSEO({ business }: BusinessSEOProps) {
  if (!shouldEnableSEO()) {
    return null;
  }

  const publicUrl = getBusinessPublicUrl(business.id);
  const baseUrl = typeof window !== 'undefined' 
    ? `https://${window.location.hostname}` 
    : 'https://blackdollarnetwork.com';
  
  const imageUrl = business.imageUrl || business.logoUrl || `${baseUrl}/bdn-logo.svg`;
  const keywords = generateBusinessKeywords(business);
  
  const locationText = business.address 
    ? `${business.address.city || ''}${business.address.state ? `, ${business.address.state}` : ''}`.trim()
    : '';

  const title = `${business.name}${locationText ? ` in ${locationText}` : ''} | Black Dollar Network`;
  const description = business.description || 
    `${business.name} is a Black-owned ${business.category || 'business'}${locationText ? ` in ${locationText}` : ''}. Discover and support Black-owned businesses on Black Dollar Network.`;

  const metadata: SEOMetadata = {
    title,
    description,
    keywords,
    image: imageUrl,
    url: publicUrl,
    type: 'business.business',
    canonicalUrl: publicUrl,
  };

  const structuredData = generateBusinessStructuredData(business);

  return (
    <SEOHead 
      metadata={metadata}
      structuredData={structuredData}
      enableBDNStructuredData={true}
    />
  );
}
