# Web Pages Authentication Redirects

## Summary

All web pages in `app/web/` have been updated to redirect users to the login page when they attempt to navigate to authenticated routes (routes under `/pages/`, `/(tabs)/`, or `/admin/`).

## Implementation

### Utility Function

Created `navigateToAuthenticatedRoute()` function in `lib/navigation-utils.ts`:
- Checks if a route requires authentication
- Currently redirects all authenticated routes to `/(auth)/login`
- Includes TODO comments for when actual authentication is implemented

### Routes Requiring Authentication

The following route prefixes require authentication:
- `/(tabs)/` - Main app tabs (dashboard, marketplace, pay, account)
- `/pages/` - All pages routes (businesses, myimpact, events, merchant, university, etc.)
- `/admin/` - Admin routes

### Files Updated

1. **app/web/community.tsx**
   - `/pages/businesses` → redirects to login
   - `/pages/myimpact` → redirects to login
   - `/pages/events` → redirects to login

2. **app/web/docs.tsx**
   - `/pages/university/videos` → redirects to login

3. **app/web/for-businesses.tsx**
   - `/pages/merchant/onboarding` → redirects to login (2 instances)
   - `/pages/university` → redirects to login

4. **app/web/for-consumers.tsx**
   - `/pages/university` → redirects to login

5. **app/web/learn/index.tsx**
   - `/pages/university` → redirects to login (used in EDUCATIONAL_TOPICS and FEATURED_RESOURCES)

6. **app/web/learn/community-impact.tsx**
   - `/pages/merchant/onboarding` → redirects to login

7. **app/web/knowledge-base.tsx**
   - `/pages/support` → redirects to login

8. **app/web/blog.tsx**
   - `/pages/university/blog/{id}` → redirects to login

9. **app/web/pricing.tsx**
   - `/pages/bdn-plus` → redirects to login

## TODO: When Authentication is Implemented

When actual authentication is added to the app, update `navigateToAuthenticatedRoute()` in `lib/navigation-utils.ts` to:

1. Check if user is authenticated using `useAuth()` hook
2. If authenticated, navigate to the requested route
3. If not authenticated, redirect to `/(auth)/login`
4. Optionally, store the intended destination route to redirect after login

Example implementation:
```typescript
export function navigateToAuthenticatedRoute(router: Router, route: string): void {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Store intended route for redirect after login
    // router.push(`/(auth)/login?redirect=${encodeURIComponent(route)}`);
    router.push('/(auth)/login');
    return;
  }
  
  router.push(route);
}
```

## Notes

- All navigation calls include TODO comments noting that authentication checks should be added
- The utility function `requiresAuthentication()` can be used to check if a route requires auth before navigation
- Public routes (like `/(auth)/signup`, `/web/*`) are not affected and continue to work normally
