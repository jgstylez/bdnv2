import { Platform } from 'react-native';

/**
 * Detects the subdomain from the current hostname (web only)
 * @param searchParams - Optional search params object (from useLocalSearchParams or useSearchParams)
 * @returns The subdomain string (e.g., 'app') or null if no subdomain
 */
export function getSubdomain(searchParams?: { subdomain?: string }): string | null {
  if (Platform.OS !== 'web') {
    return null; // Mobile apps don't have subdomains
  }

  if (typeof window === 'undefined' || !window.location) {
    return null;
  }

  const hostname = window.location.hostname;
  
  // Handle localhost for development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // First, check if searchParams were passed in (from expo-router)
    if (searchParams?.subdomain === 'app') {
      if (__DEV__) {
        console.log('[SubdomainUtils] ✓ Detected app subdomain via expo-router searchParams');
      }
      return 'app';
    }
    
    // Fallback: parse from window.location
    // Handle both encoded and non-encoded URLs
    const searchString = window.location?.search || window.location?.hash?.split('?')[1] || '';
    const urlSearchParams = new URLSearchParams(searchString);
    const testSubdomain = urlSearchParams.get('subdomain');
    
    if (__DEV__) {
      console.log('[SubdomainUtils] Checking subdomain:', {
        hostname,
        fullUrl: window.location?.href || 'N/A',
        search: window.location?.search || 'N/A',
        hash: window.location?.hash || 'N/A',
        searchString,
        testSubdomain,
        allParams: Object.fromEntries(urlSearchParams.entries()),
        expoSearchParams: searchParams,
      });
    }
    
    if (testSubdomain === 'app') {
      if (__DEV__) {
        console.log('[SubdomainUtils] ✓ Detected app subdomain via query param');
      }
      return 'app';
    }
    
    // Also check if the URL contains subdomain=app in any form (fallback for encoded URLs)
    const urlString = window.location?.href?.toLowerCase() || '';
    if (urlString.includes('subdomain=app') || urlString.includes('subdomain%3dapp')) {
      if (__DEV__) {
        console.log('[SubdomainUtils] ✓ Detected app subdomain via URL string match');
      }
      return 'app';
    }
    
    if (__DEV__ && testSubdomain) {
      console.log('[SubdomainUtils] Unknown subdomain value:', testSubdomain);
    }
    if (__DEV__) {
      console.log('[SubdomainUtils] No app subdomain detected, returning null (marketing site)');
    }
    return null; // Default to marketing site in localhost
  }

  const parts = hostname.split('.');
  
  // For blackdollarnetwork.com -> no subdomain (marketing)
  // For app.blackdollarnetwork.com -> 'app' subdomain
  if (parts.length >= 3 && parts[0] === 'app') {
    return 'app';
  }
  
  // No subdomain or www -> marketing site
  return null;
}

/**
 * Checks if the current hostname is the app subdomain
 * @param searchParams - Optional search params object (from useLocalSearchParams or useSearchParams)
 * @returns true if on app.blackdollarnetwork.com, false otherwise
 */
export function isAppSubdomain(searchParams?: { subdomain?: string }): boolean {
  return getSubdomain(searchParams) === 'app';
}

/**
 * Checks if the current hostname is a sandbox domain
 * @returns true if on sandbox.blackdollarnetwork.com or any sandbox subdomain, false otherwise
 */
export function isSandboxDomain(): boolean {
  if (typeof window === 'undefined' || !window.location) {
    return false;
  }

  const hostname = window.location.hostname;
  
  // Check if hostname contains 'sandbox'
  return hostname.includes('sandbox');
}

/**
 * Checks if the current hostname is a production domain that should be indexed
 * Only these exact domains should be indexed by search engines:
 * - blackdollarnetwork.com
 * - www.blackdollarnetwork.com
 * 
 * All other subdomains (app, operator, developer, sandbox, etc.) should NOT be indexed
 * @returns true if on blackdollarnetwork.com or www.blackdollarnetwork.com, false otherwise
 */
export function isProductionDomain(): boolean {
  if (typeof window === 'undefined' || !window.location) {
    return false;
  }

  const hostname = window.location.hostname.toLowerCase();
  
  // Exact match for production domains that should be indexed
  // Allow: blackdollarnetwork.com, www.blackdollarnetwork.com
  // Disallow: app.blackdollarnetwork.com, sandbox.blackdollarnetwork.com, operator.*, developer.*, etc.
  return hostname === 'blackdollarnetwork.com' || hostname === 'www.blackdollarnetwork.com';
}
