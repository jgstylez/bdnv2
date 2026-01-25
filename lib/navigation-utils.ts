/**
 * Navigation Utilities
 * 
 * Utilities for filtering navigation items based on feature flags
 */

import { NavGroup, NavItem } from '@/config/navigation';
import { FeatureFlags } from '@/types/feature-flags';

// Router type from expo-router - has push, replace, back methods
type Router = {
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
};

/**
 * Routes that require authentication
 * These routes are part of the authenticated app area
 */
const AUTHENTICATED_ROUTES = [
  '/(tabs)/',
  '/pages/',
  '/admin/',
];

/**
 * Check if a route requires authentication
 */
export function requiresAuthentication(route: string): boolean {
  return AUTHENTICATED_ROUTES.some(prefix => route.startsWith(prefix));
}

/**
 * Navigate to an authenticated route
 * 
 * TODO: When actual authentication is implemented, check if user is authenticated
 * before navigating. If not authenticated, redirect to login page.
 * 
 * For now, all authenticated routes redirect to login page.
 * 
 * @param router - Expo Router instance
 * @param route - Route to navigate to (if authenticated)
 */
export function navigateToAuthenticatedRoute(router: Router, route: string): void {
  // TODO: Add authentication check when auth is implemented
  // if (!isAuthenticated) {
  //   router.push('/(auth)/login');
  //   return;
  // }
  // router.push(route);
  
  // For now, redirect to login page
  router.push('/(auth)/login');
}

/**
 * Feature flag mappings for navigation items
 * Maps navigation hrefs to their required feature flags
 */
const navigationFeatureFlags: Record<string, keyof FeatureFlags> = {
  // Main
  '/(tabs)/marketplace': 'businessDirectory', // Marketplace uses directory
  '/pages/businesses': 'businessDirectory',
  '/pages/search': 'search',
  
  // MyImpact
  '/pages/myimpact': 'myImpact',
  '/pages/myimpact/leaderboard': 'myImpactLeaderboard',
  '/pages/myimpact/points': 'myImpactPoints',
  '/pages/myimpact/cashback': 'myImpactCashback',
  '/pages/myimpact/earnings': 'myImpactEarnings',
  '/pages/myimpact/donations': 'myImpactDonations',
  '/pages/tokens': 'tokens',
  '/pages/myimpact/badges': 'badges',
  
  // Business
  '/pages/merchant/dashboard': 'merchantDashboard',
  '/pages/merchant/analytics': 'analytics',
  '/pages/merchant/invoices': 'invoices',
  
  // Nonprofit
  '/pages/nonprofit/dashboard': 'nonprofitDashboard',
  '/pages/nonprofit/campaigns': 'campaigns',
  
  // Events
  '/pages/events': 'events',
  '/pages/events/tickets': 'eventTicketing',
  '/pages/events/create': 'eventCreation',
  '/pages/events/my-events': 'eventManagement',
  
  // Media
  '/pages/media': 'media',
  '/pages/media/bdn-tv': 'mediaBDNTV',
  '/pages/media/channels': 'mediaChannels',
  '/pages/university/blog': 'universityBlog', // Blog is shared between media and university
  
  // BDN University
  '/pages/university': 'university',
  '/pages/university/guides': 'universityGuides',
  '/pages/university/videos': 'universityVideos',
  '/pages/university/help': 'universityHelp',
  
  // Premium
  '/pages/bdn-plus': 'bdnPlus',
};

/**
 * Filter navigation groups and items based on feature flags
 */
export function filterNavigationByFeatureFlags(
  navigationMenu: NavGroup[],
  flags: FeatureFlags
): NavGroup[] {
  return navigationMenu
    .map((group) => {
      // Filter items within the group
      const filteredItems = group.items.filter((item) => {
        const requiredFlag = navigationFeatureFlags[item.href];
        
        // If no flag is required, always show the item
        if (!requiredFlag) {
          return true;
        }
        
        // Check if the required flag is enabled
        return flags[requiredFlag] === true;
      });
      
      // Only include groups that have at least one visible item
      if (filteredItems.length === 0) {
        return null;
      }
      
      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group): group is NavGroup => group !== null);
}

/**
 * Check if a navigation item should be visible based on feature flags
 */
export function isNavigationItemVisible(
  href: string,
  flags: FeatureFlags
): boolean {
  const requiredFlag = navigationFeatureFlags[href];
  
  // If no flag is required, always show
  if (!requiredFlag) {
    return true;
  }
  
  // Check if the required flag is enabled
  return flags[requiredFlag] === true;
}

