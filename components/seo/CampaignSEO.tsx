import { SEOHead } from '@/components/SEOHead';
import { Organization, PayItForward } from '@/types/nonprofit';
import { 
  generateCampaignStructuredData, 
  getCampaignPublicUrl,
  SEOMetadata,
  shouldEnableSEO 
} from '@/lib/seo-utils';

/**
 * SEO component for nonprofit campaign detail pages
 * Provides comprehensive SEO metadata including structured data
 */
export interface CampaignSEOProps {
  campaign: PayItForward;
  organization: Organization;
}

export function CampaignSEO({ campaign, organization }: CampaignSEOProps) {
  if (!shouldEnableSEO()) {
    return null;
  }

  const publicUrl = getCampaignPublicUrl(campaign.id);
  const baseUrl = typeof window !== 'undefined' 
    ? `https://${window.location.hostname}` 
    : 'https://blackdollarnetwork.com';
  
  const imageUrl = campaign.imageUrl || organization.logoUrl || `${baseUrl}/bdn-logo.svg`;
  
  const locationText = organization.address 
    ? `${organization.address.city || ''}${organization.address.state ? `, ${organization.address.state}` : ''}`.trim()
    : '';

  const progressPercent = campaign.targetAmount 
    ? Math.round((campaign.currentAmount / campaign.targetAmount) * 100)
    : 0;

  const title = `${campaign.title} by ${organization.name} | Black Dollar Network`;
  const description = campaign.description || 
    `Support ${campaign.title}${locationText ? ` in ${locationText}` : ''}. ${campaign.targetAmount ? `Goal: ${campaign.targetAmount} ${campaign.currency}. ` : ''}${progressPercent > 0 ? `Progress: ${progressPercent}%. ` : ''}Help make a difference through Black Dollar Network.`;

  const keywords = [
    campaign.title,
    organization.name,
    'nonprofit',
    'donation',
    'fundraiser',
    'Black Dollar Network',
    ...(locationText ? [locationText] : []),
    ...(campaign.tags || []),
  ];

  const metadata: SEOMetadata = {
    title,
    description,
    keywords,
    image: imageUrl,
    url: publicUrl,
    type: 'article',
    publishedTime: campaign.createdAt,
    canonicalUrl: publicUrl,
  };

  const structuredData = generateCampaignStructuredData(campaign, organization);

  return (
    <SEOHead 
      metadata={metadata}
      structuredData={structuredData}
      enableBDNStructuredData={true}
    />
  );
}
