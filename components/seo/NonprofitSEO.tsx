import { SEOHead } from '@/components/SEOHead';
import { Organization } from '@/types/nonprofit';
import { 
  generateNonprofitStructuredData, 
  generateNonprofitKeywords,
  getNonprofitPublicUrl,
  SEOMetadata,
  shouldEnableSEO 
} from '@/lib/seo-utils';

/**
 * SEO component for nonprofit organization detail pages
 * Provides comprehensive SEO metadata including structured data
 */
export interface NonprofitSEOProps {
  organization: Organization & { rating?: number; reviewCount?: number };
}

export function NonprofitSEO({ organization }: NonprofitSEOProps) {
  if (!shouldEnableSEO()) {
    return null;
  }

  const publicUrl = getNonprofitPublicUrl(organization.id);
  const baseUrl = typeof window !== 'undefined' 
    ? `https://${window.location.hostname}` 
    : 'https://blackdollarnetwork.com';
  
  const imageUrl = organization.logoUrl || organization.images?.[0] || `${baseUrl}/bdn-logo.svg`;
  const keywords = generateNonprofitKeywords(organization);
  
  const locationText = organization.address 
    ? `${organization.address.city || ''}${organization.address.state ? `, ${organization.address.state}` : ''}`.trim()
    : '';

  const title = `${organization.name}${locationText ? ` in ${locationText}` : ''} | Black Dollar Network`;
  const description = organization.description || 
    `${organization.name} is a ${organization.type || 'nonprofit'}${locationText ? ` in ${locationText}` : ''}. ${organization.mission || 'Supporting community initiatives through Black Dollar Network.'}`;

  const metadata: SEOMetadata = {
    title,
    description,
    keywords,
    image: imageUrl,
    url: publicUrl,
    type: 'website',
    canonicalUrl: publicUrl,
  };

  const structuredData = generateNonprofitStructuredData(organization);

  return (
    <SEOHead 
      metadata={metadata}
      structuredData={structuredData}
      enableBDNStructuredData={true}
    />
  );
}
