/**
 * SEO Utilities
 * Comprehensive SEO helper functions for generating structured data,
 * meta tags, and Open Graph tags for BDN brand, businesses, and nonprofits
 */

import { Merchant } from '@/types/merchant';
import { Organization, PayItForward } from '@/types/nonprofit';
import { isProductionDomain } from './subdomain-utils';

/**
 * SEO Metadata Configuration
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'business.business' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonicalUrl?: string;
}

/**
 * Structured Data Types
 */
export interface OrganizationStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  legalName?: string;
  url?: string;
  logo?: string;
  description?: string;
  foundingDate?: string;
  contactPoint?: {
    '@type': string;
    telephone?: string;
    email?: string;
    contactType?: string;
  };
  address?: {
    '@type': string;
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  sameAs?: string[];
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    reviewCount: string;
  };
}

/**
 * Generate JSON-LD structured data for Black Dollar Network (BDN) brand
 */
export function generateBDNStructuredData(): string {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Black Dollar Network',
    legalName: 'Black Dollar Network, LLC',
    url: 'https://blackdollarnetwork.com',
    logo: 'https://blackdollarnetwork.com/bdn-logo.svg',
    description: 'The backbone of group economics and the cornerstone of community empowerment, connecting Black dollars with Black businesses worldwide.',
    foundingDate: '2016',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@blackdollarnetwork.com',
      contactType: 'Customer Service',
    },
    sameAs: [
      'https://www.instagram.com/blackdollarnetwork',
      'https://www.facebook.com/blackdollarnetwork',
      'https://www.youtube.com/@blackdollarnetwork',
      'https://www.tiktok.com/@blackdollarnetwork',
      'https://twitter.com/blackdollarnetwork',
      'https://www.linkedin.com/company/blackdollarnetwork',
    ],
  };

  return JSON.stringify(structuredData, null, 2);
}

/**
 * Generate JSON-LD structured data for a business/merchant
 */
export function generateBusinessStructuredData(
  business: Merchant & { rating?: number; reviewCount?: number; imageUrl?: string }
): string {
  const baseUrl = typeof window !== 'undefined' 
    ? `https://${window.location.hostname}` 
    : 'https://blackdollarnetwork.com';
  
  const businessUrl = `${baseUrl}/pages/businesses/${business.id}`;
  const imageUrl = business.imageUrl || `${baseUrl}/bdn-logo.svg`;

  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
    url: business.website || businessUrl,
    image: imageUrl,
  };

  // Add address if available
  if (business.address) {
    structuredData.address = {
      '@type': 'PostalAddress',
      streetAddress: business.address.street + (business.address.street2 ? `, ${business.address.street2}` : ''),
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country || 'US',
    };
  }

  // Add contact information
  if (business.phone || business.email) {
    structuredData.contactPoint = {
      '@type': 'ContactPoint',
    };
    if (business.phone) {
      structuredData.contactPoint.telephone = business.phone;
    }
    if (business.email) {
      structuredData.contactPoint.email = business.email;
    }
  }

  // Add rating if available
  if (business.rating && business.reviewCount) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: business.rating.toString(),
      reviewCount: business.reviewCount.toString(),
    };
  }

  // Add category
  if (business.category) {
    structuredData.additionalType = `https://schema.org/${business.category}`;
  }

  // Add black-owned verification
  if (business.blackOwnedVerificationStatus === 'verified') {
    structuredData.additionalProperty = [
      {
        '@type': 'PropertyValue',
        name: 'Black-Owned',
        value: 'Verified',
      },
    ];
  }

  return JSON.stringify(structuredData, null, 2);
}

/**
 * Generate JSON-LD structured data for a nonprofit organization
 */
export function generateNonprofitStructuredData(
  organization: Organization & { rating?: number; reviewCount?: number }
): string {
  const baseUrl = typeof window !== 'undefined' 
    ? `https://${window.location.hostname}` 
    : 'https://blackdollarnetwork.com';
  
  const orgUrl = `${baseUrl}/pages/nonprofit/${organization.id}`;
  const imageUrl = organization.logoUrl || organization.images?.[0] || `${baseUrl}/bdn-logo.svg`;

  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: organization.name,
    description: organization.description,
    mission: organization.mission,
    url: organization.website || orgUrl,
    image: imageUrl,
  };

  // Add address if available
  if (organization.address) {
    structuredData.address = {
      '@type': 'PostalAddress',
      streetAddress: organization.address.street + (organization.address.street2 ? `, ${organization.address.street2}` : ''),
      addressLocality: organization.address.city,
      addressRegion: organization.address.state,
      postalCode: organization.address.postalCode,
      addressCountry: organization.address.country || 'US',
    };
  }

  // Add contact information
  if (organization.phone || organization.email) {
    structuredData.contactPoint = {
      '@type': 'ContactPoint',
    };
    if (organization.phone) {
      structuredData.contactPoint.telephone = organization.phone;
    }
    if (organization.email) {
      structuredData.contactPoint.email = organization.email;
    }
  }

  // Add rating if available
  if (organization.rating && organization.reviewCount) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: organization.rating.toString(),
      reviewCount: organization.reviewCount.toString(),
    };
  }

  // Add tax identification if available
  if (organization.taxIdentification) {
    structuredData.taxID = organization.taxIdentification.number;
  }

  return JSON.stringify(structuredData, null, 2);
}

/**
 * Generate JSON-LD structured data for a nonprofit campaign
 */
export function generateCampaignStructuredData(
  campaign: PayItForward,
  organization: Organization
): string {
  const baseUrl = typeof window !== 'undefined' 
    ? `https://${window.location.hostname}` 
    : 'https://blackdollarnetwork.com';
  
  const campaignUrl = `${baseUrl}/pages/nonprofit/campaigns/${campaign.id}`;
  const imageUrl = campaign.imageUrl || organization.logoUrl || `${baseUrl}/bdn-logo.svg`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'DonateAction',
    name: campaign.title,
    description: campaign.description,
    image: imageUrl,
    url: campaignUrl,
    target: {
      '@type': 'EntryPoint',
      urlTemplate: campaignUrl,
    },
    object: {
      '@type': 'Organization',
      name: organization.name,
      url: organization.website || `${baseUrl}/pages/nonprofit/${organization.id}`,
    },
    startTime: campaign.startDate,
    endTime: campaign.endDate,
    amount: campaign.targetAmount ? {
      '@type': 'MonetaryAmount',
      currency: campaign.currency,
      value: campaign.targetAmount,
    } : undefined,
  };

  return JSON.stringify(structuredData, null, 2);
}

/**
 * Generate meta tags HTML string
 */
export function generateMetaTags(metadata: SEOMetadata): string {
  const baseUrl = typeof window !== 'undefined' 
    ? `https://${window.location.hostname}` 
    : 'https://blackdollarnetwork.com';
  
  const url = metadata.url || (typeof window !== 'undefined' ? window.location.href : baseUrl);
  const image = metadata.image || `${baseUrl}/bdn-logo.svg`;
  const title = metadata.title || 'Black Dollar Network | Educate. Equip. Empower.';
  const description = metadata.description || 'The backbone of group economics and the cornerstone of community empowerment.';

  let metaTags = '';

  // Basic meta tags
  metaTags += `<meta name="title" content="${escapeHtml(title)}" />\n`;
  metaTags += `<meta name="description" content="${escapeHtml(description)}" />\n`;
  
  if (metadata.keywords && metadata.keywords.length > 0) {
    metaTags += `<meta name="keywords" content="${escapeHtml(metadata.keywords.join(', '))}" />\n`;
  }

  if (metadata.author) {
    metaTags += `<meta name="author" content="${escapeHtml(metadata.author)}" />\n`;
  }

  // Canonical URL
  const canonical = metadata.canonicalUrl || url;
  metaTags += `<link rel="canonical" href="${escapeHtml(canonical)}" />\n`;

  // Open Graph tags
  metaTags += `<meta property="og:type" content="${metadata.type || 'website'}" />\n`;
  metaTags += `<meta property="og:title" content="${escapeHtml(title)}" />\n`;
  metaTags += `<meta property="og:description" content="${escapeHtml(description)}" />\n`;
  metaTags += `<meta property="og:image" content="${escapeHtml(image)}" />\n`;
  metaTags += `<meta property="og:url" content="${escapeHtml(url)}" />\n`;
  metaTags += `<meta property="og:site_name" content="Black Dollar Network" />\n`;

  if (metadata.publishedTime) {
    metaTags += `<meta property="article:published_time" content="${escapeHtml(metadata.publishedTime)}" />\n`;
  }

  if (metadata.modifiedTime) {
    metaTags += `<meta property="article:modified_time" content="${escapeHtml(metadata.modifiedTime)}" />\n`;
  }

  // Twitter Card tags
  metaTags += `<meta name="twitter:card" content="summary_large_image" />\n`;
  metaTags += `<meta name="twitter:title" content="${escapeHtml(title)}" />\n`;
  metaTags += `<meta name="twitter:description" content="${escapeHtml(description)}" />\n`;
  metaTags += `<meta name="twitter:image" content="${escapeHtml(image)}" />\n`;

  return metaTags;
}

/**
 * Generate keywords for a business based on its attributes
 */
export function generateBusinessKeywords(business: Merchant): string[] {
  const keywords: string[] = [
    business.name,
    business.category,
    'Black-owned business',
    'Black Dollar Network',
  ];

  if (business.address) {
    keywords.push(business.address.city || '');
    keywords.push(business.address.state || '');
    if (business.address.city && business.address.state) {
      keywords.push(`${business.address.city} ${business.address.state}`);
    }
  }

  if (business.blackOwnedVerificationStatus === 'verified') {
    keywords.push('verified Black-owned', 'Black-owned verified');
  }

  if (business.type) {
    keywords.push(business.type);
  }

  return keywords.filter(Boolean);
}

/**
 * Generate keywords for a nonprofit based on its attributes
 */
export function generateNonprofitKeywords(organization: Organization): string[] {
  const keywords: string[] = [
    organization.name,
    organization.type,
    'nonprofit',
    'Black Dollar Network',
    'community organization',
  ];

  if (organization.address) {
    keywords.push(organization.address.city || '');
    keywords.push(organization.address.state || '');
    if (organization.address.city && organization.address.state) {
      keywords.push(`${organization.address.city} ${organization.address.state}`);
    }
  }

  if (organization.mission) {
    // Extract key terms from mission statement
    const missionKeywords = organization.mission
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 4)
      .slice(0, 5);
    keywords.push(...missionKeywords);
  }

  return keywords.filter(Boolean);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Get public URL for a business (even if gated, this is the public-facing URL)
 */
export function getBusinessPublicUrl(businessId: string): string {
  const baseUrl = typeof window !== 'undefined' 
    ? `https://${window.location.hostname}` 
    : 'https://blackdollarnetwork.com';
  return `${baseUrl}/pages/businesses/${businessId}`;
}

/**
 * Get public URL for a nonprofit (even if gated, this is the public-facing URL)
 */
export function getNonprofitPublicUrl(organizationId: string): string {
  const baseUrl = typeof window !== 'undefined' 
    ? `https://${window.location.hostname}` 
    : 'https://blackdollarnetwork.com';
  return `${baseUrl}/pages/nonprofit/${organizationId}`;
}

/**
 * Get public URL for a campaign (even if gated, this is the public-facing URL)
 */
export function getCampaignPublicUrl(campaignId: string): string {
  const baseUrl = typeof window !== 'undefined' 
    ? `https://${window.location.hostname}` 
    : 'https://blackdollarnetwork.com';
  return `${baseUrl}/pages/nonprofit/campaigns/${campaignId}`;
}

/**
 * Check if SEO should be enabled (only on production domains)
 */
export function shouldEnableSEO(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return isProductionDomain();
}
