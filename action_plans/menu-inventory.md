# Menu Inventory & Link Verification

Last Updated: 2024-02-15

## Navigation Structure

### Tab Navigation (`app/(tabs)/`)
Core navigation tabs visible on mobile bottom bar:
1. **Home** (`/(tabs)/dashboard`) ✓
2. **Shop** (`/(tabs)/businesses`) ✓
3. **Pay** (`/(tabs)/pay`) ✓
4. **Account** (`/(tabs)/profile`) ✓

### Sidebar Navigation (`components/Sidebar.tsx`)
Desktop sidebar menu items:
1. **Dashboard** → `/(tabs)/dashboard` ✓
2. **Edit Profile** → `/(tabs)/profile` ✓
3. **Account Settings** → `/(tabs)/profile` ✓
4. **Enroll Business** → `/pages/enroll-business` ✓
5. **Enroll Nonprofit** → `/pages/enroll-nonprofit` ✓
6. **Referral Program** → `/pages/referrals` ✓
7. **Transaction History** → `/(tabs)/profile` ✓
8. **Support** → `/(tabs)/profile` ✓
9. **Sign Out** → `/(auth)/login` ✓

### Menu Panel (`components/MenuPanel.tsx`)
Mobile slide-out menu items:
1. **Edit Profile** → `/(tabs)/profile` ✓
2. **Account Settings** → `/(tabs)/profile` ✓
3. **Enroll Business** → `/pages/enroll-business` ✓ (FIXED)
4. **Enroll Nonprofit** → `/pages/enroll-nonprofit` ✓ (FIXED)
5. **Referral Program** → `/pages/referrals` ✓ (FIXED)
6. **Transaction History** → `/(tabs)/profile` ✓
7. **Support** → `/(tabs)/profile` ✓
8. **Sign Out** → `/(auth)/login` ✓

### Admin Sidebar (`components/AdminSidebar.tsx`)
Admin dashboard navigation:
1. **Dashboard** → `/admin` ✓
2. **User Management** → `/admin/users` ✓
3. **Business Management** → `/admin/businesses` ✓
4. **Content Management** → `/admin/content` ✓
5. **Analytics & Reports** → `/admin/analytics` ✓
6. **Platform Settings** → `/admin/settings` ✓

### Admin Menu Panel (`components/AdminMenuPanel.tsx`)
Admin mobile menu:
1. **Dashboard** → `/admin` ✓
2. **User Management** → `/admin/users` ✓
3. **Business Management** → `/admin/businesses` ✓
4. **Content Management** → `/admin/content` ✓
5. **Analytics & Reports** → `/admin/analytics` ✓
6. **Platform Settings** → `/admin/settings` ✓

## Page Routes Inventory

### Core Tab Pages (`app/(tabs)/`)
- `dashboard.tsx` ✓
- `businesses.tsx` ✓
- `pay.tsx` ✓
- `profile.tsx` ✓

### Pages Directory (`app/pages/`)
- `enroll-business.tsx` ✓
- `enroll-nonprofit.tsx` ✓
- `tokens.tsx` ✓
- `referrals.tsx` ✓
- `businesses/[id].tsx` ✓ (Business detail page)
- `merchant/` (Merchant platform) ✓
- `myimpact/` (MyImpact tracking) ✓
- `university/` (BDN University) ✓
- `media/` (Media & Content) ✓
- `search/` (Search & Discovery) ✓

### Admin Pages (`app/admin/`)
- `index.tsx` ✓
- `users.tsx` ✓
- `businesses.tsx` ✓
- `content.tsx` ✓
- `analytics.tsx` ✓
- `settings.tsx` ✓

## Link Verification Status

### ✅ Fixed Links
- All business detail page links updated from `/(tabs)/businesses/[id]` to `/pages/businesses/[id]`
- MenuPanel enrollment links fixed to use `/pages/` routes

### ✅ Verified Working Links
- Dashboard quick actions
- Search results navigation
- Location search navigation
- Business directory navigation
- All sidebar navigation items
- All menu panel items

## Routing Rules

**IMPORTANT**: All new pages MUST be placed in `app/pages/` directory, NOT in `app/(tabs)/`.

- Core tab navigation stays in `app/(tabs)/`
- All other pages go in `app/pages/`
- Business detail pages: `app/pages/businesses/[id].tsx`
- Admin pages: `app/admin/*`

## Notes
- Business detail pages are accessed via `/pages/businesses/[id]`
- All enrollment pages are in `/pages/`
- Search functionality routes to `/pages/search/*`
- Merchant platform routes to `/pages/merchant/*`

