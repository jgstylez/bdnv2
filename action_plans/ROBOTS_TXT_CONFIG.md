# robots.txt Configuration

## Overview

To prevent all non-production domains from being indexed by search engines while allowing only production domains to be indexed, we use a two-pronged approach:

1. **Meta Robots Tags** (Primary - Already Implemented)
   - The `SEOHead` component automatically adds `<meta name="robots" content="noindex, nofollow">` to all pages on non-production domains
   - Only these production domains get `index, follow`:
     - `blackdollarnetwork.com`
     - `www.blackdollarnetwork.com`
   - All other subdomains (sandbox, app, operator, developer, etc.) get `noindex, nofollow`
   - This is the most reliable method and is already active

2. **robots.txt File** (Secondary - Server Configuration Required)
   - Should be configured at the web server/deployment level
   - Place a `robots.txt` file at the root of your domain

## Server-Level robots.txt Configuration

### For sandbox.blackdollarnetwork.com and all other subdomains

Create a `robots.txt` file that disallows all crawling for non-production domains:

```
# robots.txt for Black Dollar Network (Non-Production)
# This environment should not be indexed by search engines
# Applies to: sandbox.*, app.*, operator.*, developer.*, and all other subdomains

User-agent: *
Disallow: /
```

### For blackdollarnetwork.com

Create a `robots.txt` file that allows crawling:

```
# robots.txt for Black Dollar Network
# Production environment - allow crawling

User-agent: *
Allow: /

# Sitemap location
Sitemap: https://blackdollarnetwork.com/sitemap.xml
```

## Deployment Platform Instructions

### Vercel
1. Create a `public/robots.txt` file in your project root
2. Vercel will automatically serve it at `/robots.txt`
3. Use environment-specific builds or middleware to serve different content based on domain

### Netlify
1. Create a `public/robots.txt` file in your project root
2. Netlify will automatically serve it at `/robots.txt`
3. Use redirect rules or build plugins to customize per domain

### Custom Server
1. Configure your web server (nginx, Apache, etc.) to serve `robots.txt` at the root
2. Use server-side logic to serve different content based on the `Host` header

## Current Implementation

The primary protection is already implemented via the `SEOHead` component in `components/SEOHead.tsx`, which:
- Detects production domain using `isProductionDomain()` from `lib/subdomain-utils.ts`
- Only allows indexing on production domains: `blackdollarnetwork.com` and `www.blackdollarnetwork.com`
- Automatically adds `noindex, nofollow` meta tags to all pages on ALL other domains (sandbox, app, operator, developer, etc.)
- Allows indexing (`index, follow`) only on the production domains listed above

This meta tag approach is more reliable than robots.txt alone because:
- It prevents indexing even if robots.txt is not properly configured
- It works immediately without waiting for search engines to re-crawl
- It's enforced at the page level, not just the crawling level
- It ensures that the same codebase deployed to sandbox first, then production, will have correct SEO behavior on both

## Sitemap

A sitemap has been created at `app/sitemap.xml.tsx` that:
- Only serves sitemap content on production domains (`blackdollarnetwork.com` and `www.blackdollarnetwork.com`)
- Includes all public marketing pages that should be indexed
- Blocks access on all non-production domains
- Can be accessed at `https://blackdollarnetwork.com/sitemap.xml` or `https://www.blackdollarnetwork.com/sitemap.xml`

The sitemap generator utility is in `lib/sitemap-generator.ts` and can be customized to add/remove pages as needed.

## Testing

To verify the implementation:

1. **Check Meta Tags on Sandbox**: Visit any page on `sandbox.blackdollarnetwork.com` and inspect the HTML source. You should see:
   ```html
   <meta name="robots" content="noindex, nofollow">
   ```

2. **Check Meta Tags on Other Subdomains**: Visit pages on `app.blackdollarnetwork.com`, `operator.blackdollarnetwork.com`, `developer.blackdollarnetwork.com` - all should have:
   ```html
   <meta name="robots" content="noindex, nofollow">
   ```

3. **Check Production**: Visit any page on `blackdollarnetwork.com` or `www.blackdollarnetwork.com` and inspect the HTML source. You should see:
   ```html
   <meta name="robots" content="index, follow">
   ```

4. **Verify Sitemap**: 
   - Visit `https://blackdollarnetwork.com/sitemap.xml` - should show XML sitemap
   - Visit `https://www.blackdollarnetwork.com/sitemap.xml` - should show XML sitemap
   - Visit `https://sandbox.blackdollarnetwork.com/sitemap.xml` - should show 404 or blocked

5. **Verify robots.txt**: Visit `https://sandbox.blackdollarnetwork.com/robots.txt` and `https://blackdollarnetwork.com/robots.txt` to verify server-level configuration (if implemented).
