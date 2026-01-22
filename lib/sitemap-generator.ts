/**
 * Sitemap Generator Utility
 * Generates XML sitemap for public pages that should be indexed
 */

export interface SitemapPage {
  path: string;
  priority: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod?: string;
}

/**
 * List of public pages that should be included in the sitemap
 * Only includes pages on the production domain (blackdollarnetwork.com)
 */
export const PUBLIC_PAGES: SitemapPage[] = [
  { path: '', priority: '1.0', changefreq: 'weekly' }, // Home page
  { path: '/web/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/web/features', priority: '0.8', changefreq: 'monthly' },
  { path: '/web/community', priority: '0.8', changefreq: 'monthly' },
  { path: '/web/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/web/blog', priority: '0.7', changefreq: 'weekly' },
  { path: '/web/updates', priority: '0.7', changefreq: 'weekly' },
  { path: '/web/careers', priority: '0.6', changefreq: 'monthly' },
  { path: '/web/partnerships', priority: '0.6', changefreq: 'monthly' },
  { path: '/web/docs', priority: '0.6', changefreq: 'monthly' },
  { path: '/web/knowledge-base', priority: '0.6', changefreq: 'monthly' },
  { path: '/web/privacy', priority: '0.5', changefreq: 'yearly' },
  { path: '/web/terms', priority: '0.5', changefreq: 'yearly' },
  { path: '/web/security', priority: '0.6', changefreq: 'monthly' },
  { path: '/web/pricing', priority: '0.7', changefreq: 'monthly' },
  { path: '/web/for-consumers', priority: '0.7', changefreq: 'monthly' },
  { path: '/web/for-businesses', priority: '0.7', changefreq: 'monthly' },
  { path: '/web/roadmap', priority: '0.6', changefreq: 'monthly' },
  // Learn section pages
  { path: '/web/learn', priority: '0.7', changefreq: 'monthly' },
  { path: '/web/learn/group-economics', priority: '0.7', changefreq: 'monthly' },
  { path: '/web/learn/black-spending-power', priority: '0.7', changefreq: 'monthly' },
  { path: '/web/learn/community-impact', priority: '0.7', changefreq: 'monthly' },
];

/**
 * Generates the sitemap XML for public pages
 * @param baseUrl - The base URL for the sitemap (default: https://blackdollarnetwork.com)
 * @param pages - Optional custom list of pages (default: PUBLIC_PAGES)
 * @returns XML sitemap string
 */
export function generateSitemap(
  baseUrl: string = 'https://blackdollarnetwork.com',
  pages: SitemapPage[] = PUBLIC_PAGES
): string {
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Generate XML sitemap
  const urls = pages.map(page => {
    const url = page.path === '' ? baseUrl : `${baseUrl}${page.path}`;
    const lastmod = page.lastmod || currentDate;
    return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Escapes XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
