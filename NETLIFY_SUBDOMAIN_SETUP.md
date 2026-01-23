# Netlify Subdomain Setup Guide

This guide explains how to configure subdomains in Netlify for your BDN 2.0 application.

## Overview

Your application uses context-aware routing based on subdomains:
- `blackdollarnetwork.com` - Main marketing site
- `sandbox.blackdollarnetwork.com` - Sandbox environment (already configured)
- `developer.blackdollarnetwork.com` - Developer portal (routes to `/developer`)
- `operator.blackdollarnetwork.com` - Admin/Operator portal (routes to `/admin`)

## Step 1: Add Custom Domains in Netlify

### For Production Site:

1. **Go to Netlify Dashboard**
   - Navigate to your site
   - Click on **"Domain settings"** in the left sidebar

2. **Add Custom Domains**
   - Click **"Add custom domain"**
   - Add each subdomain one at a time:
     - `developer.blackdollarnetwork.com`
     - `operator.blackdollarnetwork.com`
   - Netlify will verify domain ownership

3. **Domain Verification**
   - Netlify will show DNS records needed
   - You'll need to add these to your DNS provider (wherever `blackdollarnetwork.com` is managed)

## Step 2: DNS Configuration

### Option A: Using Netlify DNS (Recommended)

If you're using Netlify DNS for your domain:

1. **Go to Netlify DNS**
   - In Netlify dashboard → **"Domain management"** → **"DNS"**
   - Find your domain `blackdollarnetwork.com`

2. **Add CNAME Records**
   - Click **"Add new record"**
   - Add these records:
   
   ```
   Type: CNAME
   Name: developer
   Value: [your-netlify-site].netlify.app
   TTL: Auto
   
   Type: CNAME
   Name: operator
   Value: [your-netlify-site].netlify.app
   TTL: Auto
   ```

   **Note:** Replace `[your-netlify-site]` with your actual Netlify site name (e.g., `bdn-v2.netlify.app`)

### Option B: Using External DNS Provider

If your DNS is managed elsewhere (GoDaddy, Namecheap, Cloudflare, etc.):

1. **Log into your DNS provider**
2. **Add CNAME records** for each subdomain:

   ```
   developer.blackdollarnetwork.com  →  CNAME  →  [your-netlify-site].netlify.app
   operator.blackdollarnetwork.com  →  CNAME  →  [your-netlify-site].netlify.app
   ```

3. **Wait for DNS propagation** (usually 5-60 minutes)

## Step 3: Verify Domain Setup

After adding DNS records:

1. **Check DNS propagation:**
   ```bash
   # Check if DNS is resolving
   dig developer.blackdollarnetwork.com
   dig operator.blackdollarnetwork.com
   ```

2. **In Netlify Dashboard:**
   - Go to **"Domain settings"**
   - Check that domains show as **"Verified"** (green checkmark)
   - If not verified, click **"Verify DNS configuration"**

## Step 4: SSL Certificate Setup

Netlify automatically provisions SSL certificates:

1. **Automatic HTTPS**
   - Netlify will automatically request SSL certificates from Let's Encrypt
   - This happens automatically after DNS is verified
   - Usually takes 5-15 minutes

2. **Check SSL Status**
   - In **"Domain settings"** → **"HTTPS"**
   - Ensure certificates are issued for all subdomains
   - Enable **"Force HTTPS"** (redirect HTTP → HTTPS)

## Step 5: Create netlify.toml (Optional but Recommended)

Create a `netlify.toml` file in your project root to configure redirects and build settings:

```toml
[build]
  command = "npm run build"
  publish = ".output/public"

# Redirect rules (if needed)
[[redirects]]
  from = "https://developer.blackdollarnetwork.com/*"
  to = "/developer/:splat"
  status = 200
  force = false

[[redirects]]
  from = "https://operator.blackdollarnetwork.com/*"
  to = "/admin/:splat"
  status = 200
  force = false

# Headers for security
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Headers for API routes
[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
```

**Note:** The redirect rules above are optional because your app handles routing client-side. The redirects ensure that if someone visits `developer.blackdollarnetwork.com` directly, they still get the right content.

## Step 6: Environment-Specific Configuration

### For Sandbox Environment:

If you have a separate Netlify site for sandbox:

1. **Add sandbox subdomains:**
   - `developer.sandbox.blackdollarnetwork.com`
   - `operator.sandbox.blackdollarnetwork.com`

2. **DNS Configuration:**
   ```
   developer.sandbox.blackdollarnetwork.com  →  CNAME  →  [sandbox-netlify-site].netlify.app
   operator.sandbox.blackdollarnetwork.com   →  CNAME  →  [sandbox-netlify-site].netlify.app
   ```

## Step 7: Testing

After setup, test each subdomain:

1. **Developer Portal:**
   - Visit: `https://developer.blackdollarnetwork.com`
   - Should show developer dashboard
   - Visit: `https://sandbox.blackdollarnetwork.com/developer`
   - Should redirect to `https://developer.blackdollarnetwork.com`

2. **Operator Portal:**
   - Visit: `https://operator.blackdollarnetwork.com`
   - Should show admin dashboard (requires admin login)
   - Visit: `https://sandbox.blackdollarnetwork.com/admin`
   - Should redirect to `https://operator.blackdollarnetwork.com`

3. **Main Site:**
   - Visit: `https://blackdollarnetwork.com`
   - Should show marketing site

## Troubleshooting

### DNS Not Resolving

1. **Check DNS propagation:**
   - Use https://dnschecker.org/
   - Enter your subdomain and check globally

2. **Verify CNAME records:**
   - Ensure CNAME points to correct Netlify site
   - Check for typos in domain names

3. **Clear DNS cache:**
   ```bash
   # macOS/Linux
   sudo dscacheutil -flushcache
   
   # Windows
   ipconfig /flushdns
   ```

### SSL Certificate Issues

1. **Wait for certificate provisioning** (can take up to 24 hours)
2. **Check certificate status** in Netlify dashboard
3. **Manually trigger certificate** if needed:
   - Domain settings → HTTPS → "Renew certificate"

### Subdomain Not Routing Correctly

1. **Check browser console** for errors
2. **Verify redirect components** are working:
   - `components/DeveloperRedirect.tsx`
   - `components/AdminRedirect.tsx`
3. **Check hostname detection** in browser:
   ```javascript
   console.log(window.location.hostname);
   ```

### Multiple Netlify Sites

If you have separate sites for production and sandbox:

1. **Production site:**
   - `blackdollarnetwork.com`
   - `developer.blackdollarnetwork.com`
   - `operator.blackdollarnetwork.com`

2. **Sandbox site:**
   - `sandbox.blackdollarnetwork.com`
   - `developer.sandbox.blackdollarnetwork.com`
   - `operator.sandbox.blackdollarnetwork.com`

Each site needs its own domain configuration in Netlify.

## Best Practices

1. **Use Netlify DNS** if possible (easier management)
2. **Enable Force HTTPS** for all domains
3. **Set up redirects** in `netlify.toml` for better SEO
4. **Monitor SSL certificates** - Netlify auto-renews, but check periodically
5. **Test subdomains** after each deployment

## Additional Resources

- [Netlify Custom Domains Docs](https://docs.netlify.com/domains-https/custom-domains/)
- [Netlify DNS Docs](https://docs.netlify.com/domains-https/netlify-dns/)
- [Netlify Redirects Docs](https://docs.netlify.com/routing/redirects/)

## Quick Reference: DNS Records Needed

```
# Production
developer.blackdollarnetwork.com  →  CNAME  →  [your-site].netlify.app
operator.blackdollarnetwork.com   →  CNAME  →  [your-site].netlify.app

# Sandbox (if separate site)
developer.sandbox.blackdollarnetwork.com  →  CNAME  →  [sandbox-site].netlify.app
operator.sandbox.blackdollarnetwork.com   →  CNAME  →  [sandbox-site].netlify.app
```

Replace `[your-site]` and `[sandbox-site]` with your actual Netlify site names.
