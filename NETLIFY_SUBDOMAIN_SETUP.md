# Netlify Subdomain Setup Guide

This guide explains how to configure subdomains in Netlify for your BDN 2.0 application.

## Quick Start: Testing Locally

**Want to test subdomain behavior right now?** Use `.localhost` subdomains - no configuration needed!

```bash
# Start your dev server
npm start

# Then visit:
http://developer.localhost:8081  # Developer portal
http://operator.localhost:8081   # Admin portal
http://localhost:8081/developer # Also works
http://localhost:8081/admin     # Also works
```

Modern browsers automatically resolve `.localhost` to `127.0.0.1`. See [Step 6: Localhost Subdomain Simulation](#step-6-localhost-subdomain-simulation-local-development) for details.

## Overview

Your application uses context-aware routing based on subdomains:
- `blackdollarnetwork.com` - Main marketing site
- `sandbox.blackdollarnetwork.com` - Sandbox environment (already configured)
- `developer.blackdollarnetwork.com` - Developer portal (routes to `/developer`)
- `operator.blackdollarnetwork.com` - Admin/Operator portal (routes to `/admin`)

**Local Development:**
- `localhost:8081` - Main site (all routes accessible)
- `developer.localhost:8081` - Simulates developer subdomain
- `operator.localhost:8081` - Simulates operator subdomain

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

# Redirect rules - subdomains redirect to main domain paths
# Production subdomains
[[redirects]]
  from = "https://developer.blackdollarnetwork.com/*"
  to = "https://blackdollarnetwork.com/developer/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://operator.blackdollarnetwork.com/*"
  to = "https://blackdollarnetwork.com/admin/:splat"
  status = 301
  force = true

# Sandbox subdomains (redirect to main domain paths)
[[redirects]]
  from = "https://developer.sandbox.blackdollarnetwork.com/*"
  to = "https://blackdollarnetwork.com/developer/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://operator.sandbox.blackdollarnetwork.com/*"
  to = "https://blackdollarnetwork.com/admin/:splat"
  status = 301
  force = true

# Also handle HTTP redirects (before HTTPS is forced)
[[redirects]]
  from = "http://developer.blackdollarnetwork.com/*"
  to = "https://blackdollarnetwork.com/developer/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://operator.blackdollarnetwork.com/*"
  to = "https://blackdollarnetwork.com/admin/:splat"
  status = 301
  force = true

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

**Note:** These redirect rules ensure that subdomains redirect to the main domain with the appropriate path. The app's redirect components (`DeveloperRedirect` and `AdminRedirect`) also handle this client-side, but server-side redirects are better for SEO and user experience.

**Important:** The redirect components automatically handle both production and sandbox subdomains:
- `developer.blackdollarnetwork.com` → redirects to `blackdollarnetwork.com/developer`
- `developer.sandbox.blackdollarnetwork.com` → redirects to `blackdollarnetwork.com/developer`
- `operator.blackdollarnetwork.com` → redirects to `blackdollarnetwork.com/admin`
- `operator.sandbox.blackdollarnetwork.com` → redirects to `blackdollarnetwork.com/admin`

## Step 6: Localhost Subdomain Simulation (Local Development)

To test subdomain behavior locally, you can use `.localhost` subdomains. Modern browsers automatically resolve `.localhost` subdomains to `127.0.0.1`, so no configuration is needed!

### Option A: Using .localhost (Recommended - No Configuration Needed)

Modern browsers (Chrome, Firefox, Safari, Edge) automatically resolve `.localhost` subdomains:

1. **Start your development server:**
   ```bash
   npm start
   # or
   expo start --web
   ```

2. **Access subdomains directly:**
   - `http://developer.localhost:8081` - Developer portal
   - `http://operator.localhost:8081` - Admin portal
   - `http://localhost:8081` - Main site

3. **Behavior:**
   - `developer.localhost:8081` → Shows developer dashboard (no redirect on localhost)
   - `operator.localhost:8081` → Shows admin dashboard (no redirect on localhost)
   - `localhost:8081/developer` → Shows developer dashboard
   - `localhost:8081/admin` → Shows admin dashboard

**Note:** The redirect components (`DeveloperRedirect` and `AdminRedirect`) recognize `.localhost` subdomains and show content directly without redirecting, allowing you to test the subdomain behavior locally.

### Option B: Using /etc/hosts File (Alternative)

If `.localhost` doesn't work or you want to simulate the exact domain structure:

1. **Edit hosts file:**

   **macOS/Linux:**
   ```bash
   sudo nano /etc/hosts
   ```

   **Windows:**
   ```
   C:\Windows\System32\drivers\etc\hosts
   ```
   (Open as Administrator)

2. **Add these lines:**
   ```
   127.0.0.1  developer.localhost
   127.0.0.1  operator.localhost
   ```

3. **Save and flush DNS cache:**

   **macOS:**
   ```bash
   sudo dscacheutil -flushcache
   ```

   **Linux:**
   ```bash
   sudo systemd-resolve --flush-caches
   # or
   sudo service network-manager restart
   ```

   **Windows:**
   ```bash
   ipconfig /flushdns
   ```

4. **Access subdomains:**
   - `http://developer.localhost:8081`
   - `http://operator.localhost:8081`

### Testing Localhost Subdomain Behavior

1. **Developer Portal:**
   - Visit: `http://developer.localhost:8081`
   - Should show developer dashboard (no redirect)
   - Visit: `http://localhost:8081/developer`
   - Should show developer dashboard (no redirect)

2. **Operator Portal:**
   - Visit: `http://operator.localhost:8081`
   - Should show admin dashboard (no redirect, requires admin login)
   - Visit: `http://localhost:8081/admin`
   - Should show admin dashboard (no redirect)

3. **Verify Redirect Logic:**
   - The redirect components detect `.localhost` and show content directly
   - This allows you to test subdomain-specific behavior without deploying

### Troubleshooting Localhost Subdomains

**Issue: `.localhost` not resolving**
- Ensure you're using a modern browser (Chrome 63+, Firefox 63+, Safari 11+)
- Try clearing browser cache
- Use Option B (hosts file) as fallback

**Issue: Port not working with subdomain**
- Ensure your dev server is running on the correct port
- Try: `http://developer.localhost:8081` (include port)
- Some browsers may require explicit port in URL

**Issue: CORS or connection errors**
- Ensure dev server allows requests from subdomains
- Check that Expo/Next.js is configured to accept subdomain requests
- Verify `window.location.hostname` in browser console

## Step 7: Environment-Specific Configuration

### For Sandbox Environment:

✅ **Sandbox subdomains are already configured:**
- `developer.sandbox.blackdollarnetwork.com` - Domain alias (DNS propagating)
- `operator.sandbox.blackdollarnetwork.com` - Domain alias (DNS propagating)

**What happens next:**

1. **Wait for DNS Propagation** (usually 5-60 minutes, can take up to 24 hours)
   - Netlify will automatically detect when DNS records are properly configured
   - Check status in Netlify Dashboard → Domain settings
   - Status will change from "DNS propagating..." to "Verified" ✅

2. **SSL Certificate Auto-Provisioning**
   - Once DNS is verified, Netlify automatically provisions SSL certificates
   - Domain aliases are included in the SSL certificate automatically
   - This usually takes 5-15 minutes after DNS verification
   - You can manually trigger SSL provisioning if needed:
     - Domain settings → HTTPS → "Renew certificate"

3. **Verify Setup**
   - Check that both subdomains show as "Verified" in Netlify
   - Ensure SSL certificates are issued (green lock icon)
   - Test the subdomains:
     - `https://developer.sandbox.blackdollarnetwork.com`
     - `https://operator.sandbox.blackdollarnetwork.com`

**Note:** If using Netlify DNS, the CNAME records are created automatically. If using external DNS, ensure these records exist:
```
developer.sandbox.blackdollarnetwork.com  →  CNAME  →  [sandbox-netlify-site].netlify.app
operator.sandbox.blackdollarnetwork.com   →  CNAME  →  [sandbox-netlify-site].netlify.app
```

## Step 8: Testing

After DNS propagation completes and SSL certificates are issued, test each subdomain:

### Production Subdomains:

1. **Developer Portal:**
   - Visit: `https://developer.blackdollarnetwork.com`
   - Should redirect to `https://blackdollarnetwork.com/developer`
   - Visit: `https://blackdollarnetwork.com/developer`
   - Should show developer dashboard (no redirect)

2. **Operator Portal:**
   - Visit: `https://operator.blackdollarnetwork.com`
   - Should redirect to `https://blackdollarnetwork.com/admin`
   - Visit: `https://blackdollarnetwork.com/admin`
   - Should show admin dashboard (no redirect, requires admin login)

### Sandbox Subdomains (After DNS Propagation):

3. **Sandbox Developer Portal:**
   - Visit: `https://developer.sandbox.blackdollarnetwork.com`
   - Should redirect to `https://blackdollarnetwork.com/developer`
   - Visit: `https://sandbox.blackdollarnetwork.com/developer`
   - Should redirect to `https://blackdollarnetwork.com/developer`

4. **Sandbox Operator Portal:**
   - Visit: `https://operator.sandbox.blackdollarnetwork.com`
   - Should redirect to `https://blackdollarnetwork.com/admin`
   - Visit: `https://sandbox.blackdollarnetwork.com/admin`
   - Should redirect to `https://blackdollarnetwork.com/admin`

### Main Site:

5. **Main Site:**
   - Visit: `https://blackdollarnetwork.com`
   - Should show marketing site

### Localhost Testing (Local Development):

6. **Localhost Subdomains:**
   - Visit: `http://developer.localhost:8081`
   - Should show developer dashboard (no redirect)
   - Visit: `http://operator.localhost:8081`
   - Should show admin dashboard (no redirect)
   - Visit: `http://localhost:8081/developer`
   - Should show developer dashboard (no redirect)
   - Visit: `http://localhost:8081/admin`
   - Should show admin dashboard (no redirect)

**Note:** 
- If DNS is still propagating, you may see connection errors. Wait for DNS propagation to complete before testing production/sandbox subdomains.
- Localhost subdomains work immediately without DNS configuration.

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
   - Certificates are automatically provisioned after DNS verification
   - Domain aliases are automatically included in the certificate
2. **Check certificate status** in Netlify dashboard
   - Domain settings → HTTPS → Check certificate status
   - All domain aliases should be listed under the certificate
3. **Manually trigger certificate** if needed:
   - Domain settings → HTTPS → "Renew certificate"
   - Or use Netlify API: `POST /api/v1/sites/{site_id}/ssl`

### DNS Propagation Taking Too Long

1. **Check propagation status:**
   - Use https://dnschecker.org/ to check globally
   - Enter your subdomain and check multiple locations
2. **Verify DNS records are correct:**
   - Ensure CNAME records point to correct Netlify site
   - Check TTL values (lower TTL = faster updates)
3. **If using Netlify DNS:**
   - Records should propagate faster (usually within minutes)
   - Check Netlify DNS dashboard for status
4. **If using external DNS:**
   - Some providers cache DNS longer
   - May need to wait up to 24 hours for full propagation

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
6. **Test locally first** using `.localhost` subdomains before deploying
7. **Use localhost subdomains** to verify redirect logic works correctly

## Additional Resources

- [Netlify Custom Domains Docs](https://docs.netlify.com/domains-https/custom-domains/)
- [Netlify DNS Docs](https://docs.netlify.com/domains-https/netlify-dns/)
- [Netlify Redirects Docs](https://docs.netlify.com/routing/redirects/)

## Quick Reference: DNS Records Needed

```
# Production (if not using Netlify DNS)
developer.blackdollarnetwork.com  →  CNAME  →  [your-site].netlify.app
operator.blackdollarnetwork.com   →  CNAME  →  [your-site].netlify.app

# Sandbox (already configured as domain aliases in Netlify)
developer.sandbox.blackdollarnetwork.com  →  CNAME  →  [sandbox-site].netlify.app ✅
operator.sandbox.blackdollarnetwork.com   →  CNAME  →  [sandbox-site].netlify.app ✅

# Localhost (no DNS needed - works automatically)
developer.localhost:8081  →  127.0.0.1 (automatic)
operator.localhost:8081  →  127.0.0.1 (automatic)
```

**Current Status:**
- ✅ Sandbox subdomains added as domain aliases in Netlify
- ⏳ DNS propagation in progress
- ⏳ SSL certificates will auto-provision after DNS verification
- ✅ Localhost subdomains ready for local testing (no configuration needed)

Replace `[your-site]` and `[sandbox-site]` with your actual Netlify site names.

## Next Steps After DNS Propagation

Once DNS propagation completes:

1. **Verify domains in Netlify:**
   - Check Domain settings → All domains show "Verified" ✅
   - Status changes from "DNS propagating..." to "Verified"

2. **Verify SSL certificates:**
   - Domain settings → HTTPS → Check certificate includes all aliases
   - Should see green lock icon for all domains

3. **Test redirects:**
   - Visit each subdomain and verify redirects work
   - Check browser console for any errors

4. **Update netlify.toml:**
   - Add redirect rules (see Step 5)
   - Deploy to apply redirect rules

5. **Monitor:**
   - Check Netlify deployment logs
   - Monitor SSL certificate expiration (auto-renewed by Netlify)
