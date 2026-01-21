---
name: Organization and Program Management Review
overview: Review the codebase flows for organization signup, program info entry/editing, and participant invitations to document current implementation, identify issues, and provide recommendations.
todos:
  - id: review-org-signup
    content: Review organization signup flow - document entry points, validation, error handling, and data creation
    status: pending
  - id: review-program-setup
    content: Review initial program setup flow - document wizard steps, data persistence, and default values
    status: pending
  - id: review-program-editing
    content: Review program editing capabilities - compare with initial setup, identify missing features
    status: pending
  - id: review-invitations
    content: Review participant invitation flow - document creation, email sending status, and invitation acceptance
    status: pending
  - id: create-branded-signup
    content: Create OrganizationSignup.tsx component - duplicate participant signup with organization branding (logo, program name, accent color)
    status: pending
  - id: add-org-signup-route
    content: Add new route /org-signup in App.tsx - handle invitation tokens and orgCode parameters
    status: pending
  - id: implement-branding
    content: Implement organization branding in OrganizationSignup - load org data, apply logo/colors/program name
    status: pending
  - id: update-invitation-links
    content: Update invitation link generation to route to /org-signup instead of /auth?invite=
    status: pending
  - id: identify-issues
    content: Identify inconsistencies, missing features, and potential bugs across all flows
    status: pending
  - id: document-recommendations
    content: Document recommendations for improvements and missing feature implementations
    status: pending
---

# Organization and Program Management Review Plan

## Overview

This plan reviews four key flows in the codebase:

1. Organization signup/registration
2. Program information entry (initial setup)
3. Program information editing
4. Participant invitations

## Current Implementation Analysis

### 1. Organization Signup Flow

**Entry Points:**

- `components/Authentication.tsx` - Main authentication component with `org-signup` mode
- `api/auth/google.ts` - Google OAuth endpoint for organization creation
- `functions/src/index.ts` - Firebase Cloud Function for Google auth

**Flow:**

1. User selects "Launch a Program" from initial choose screen
2. Enters: Name, Organization Name, Email, Password
3. System checks if email already exists (`findUserByEmail`)
4. Creates organization via `createOrganization()` in `services/database.ts`:

- Generates unique `organizationCode` (6-character alphanumeric)
- Sets default `programSettings` with empty fields array
- Sets subscription tier to "free"
- Sets trial period (14 days) and subscription status to "trialing"

5. Creates admin user with `Role.ADMIN`
6. Stores auth token and IDs in localStorage
7. Redirects to organization setup (`setup` page)

**Key Files:**

- `components/Authentication.tsx` (lines 156-216)
- `services/database.ts` (lines 52-63)
- `types.ts` (lines 15-31) - Organization interface

**Issues to Review:**

- Email validation and duplicate checking
- Password handling (currently simulated token)
- Trial period setup error handling
- Default program settings initialization

### 2. Program Information Entry (Initial Setup)

**Entry Point:**

- `components/OrganizationSetup.tsx` - Multi-step wizard component
- Triggered after organization signup via `setup` page in `App.tsx`

**Flow:**

1. Two-step wizard:

- **Step 1: Brand Your Program**
- Program name
- Accent color selection (7 predefined colors)
- Logo upload (local URL, not persisted to storage)
- Intro text for signup form
- **Step 2: Configure Signup Forms**
- Default fields with toggle for include/required
- Custom question creation (text, textarea, select, pills)
- Field preview

2. On completion, calls `handleSetupComplete()` in `App.tsx`:

- Updates organization with `programSettings`
- Marks onboarding as complete
- Redirects to dashboard

**Key Files:**

- `components/OrganizationSetup.tsx` (full component)
- `App.tsx` (lines 904-924) - `handleSetupComplete`
- `types.ts` (lines 239-270) - `ProgramSettings` interface

**Issues to Review:**

- Logo upload only creates local URL, not persisted to Firebase Storage
- Default fields hardcoded in component
- No validation before completion
- Settings can be edited later, but initial setup is separate flow

### 3. Program Information Editing

**Entry Point:**

- `components/SettingsView.tsx` - Settings page with "Program" tab
- Accessible to admins only (conditional rendering)

**Flow:**

1. Admin navigates to Settings → Program tab
2. Editable fields:

- Program Name (inline editing, auto-saves on change)
- Program Logo (UI exists but functionality unclear)
- Accent Color (not visible in current code snippet)
- Intro Text (not visible in current code snippet)
- Signup Form Fields (not visible in current code snippet)

3. Changes call `onUpdateOrganization()` prop which updates Firestore

**Key Files:**

- `components/SettingsView.tsx` (lines 460-490) - Program name editing
- `services/database.ts` (lines 99-102) - `updateOrganization`

**Issues to Review:**

- Limited editing capabilities compared to initial setup
- Program logo editing not fully implemented
- Accent color and intro text editing may be missing
- Signup form fields editing may not be available in settings

### 4. Participant Invitations

**Entry Points:**

- `components/Referrals.tsx` - Main invitation UI component
- `App.tsx` - `handleSendInvite` function
- `components/Participants.tsx` - May have invitation functionality

**Flow:**

1. Admin navigates to Referrals page
2. Three tabs available:

- **Invite** - Single invitation form
- **Bulk** - CSV upload (UI exists, implementation unclear)
- **Track** - View existing invitations

3. Single invite form collects:

- First Name, Last Name
- Email Address
- Role (Mentor/Mentee)
- Personal Note (optional)

4. On submit, calls `handleSendInvite()`:

- Creates invitation via `createInvitation()` in `database.ts`
- Generates unique token and invitation link
- Sets expiration (30 days default)
- Copies link to clipboard
- **Note:** Email sending is TODO (link created but not emailed)

5. Invitation link format: `{appUrl}/auth?invite={token}`
6. When user clicks link:

- `Authentication.tsx` detects `invite` param in URL
- Loads invitation by token
- Pre-fills email and sets role
- Pre-selects participant signup mode

**Key Files:**

- `components/Referrals.tsx` (full component)
- `App.tsx` (lines 851-902) - `handleSendInvite`
- `services/database.ts` (lines 1072-1085) - `createInvitation`
- `components/Authentication.tsx` (lines 84-124) - Invitation token handling
- `services/emailService.ts` (lines 598-678) - Email template (not currently called)

**Issues to Review:**

- Email sending not implemented (TODO comment in code)
- Bulk invitation CSV parsing not implemented
- Invitation tracking/management UI completeness
- Invitation expiration handling
- Organization code vs invitation token flow differences

## Review Tasks

1. **Document complete flows** - Map all user journeys end-to-end
2. **Identify inconsistencies** - Compare initial setup vs editing capabilities
3. **Check data persistence** - Verify all settings are saved correctly
4. **Review error handling** - Check for proper error messages and fallbacks
5. **Validate security** - Ensure proper authorization checks
6. **Test edge cases** - Duplicate emails, expired invitations, etc.
7. **Document missing features** - Email sending, bulk upload, etc.
8. **Review UI/UX** - Check for user experience issues

## Key Questions to Answer

1. Can admins edit all program settings after initial setup?
2. Is logo upload persisted to Firebase Storage?
3. Why is email sending for invitations not implemented?
4. How does bulk invitation CSV upload work?
5. Are there any differences between organization code join vs invitation token join?
6. What happens if an invitation expires?
7. Can invitations be revoked or resent?
8. Is there validation for program settings before saving?

## New Requirement: Organization-Branded Participant Signup Page

### Requirement

Create a duplicate of the participant signup page that is customized per organization with:

- Organization logo
- Program name
- Brand colors (accent color)

This page should be used when:

- Participants accept invitations (via invitation token)
- Participants sign up with organization code

The existing `Authentication.tsx` component should remain unchanged for non-organization signups.

### Implementation Plan

**1. Create New Component**

- File: `components/OrganizationSignup.tsx`
- Duplicate participant signup functionality from `Authentication.tsx`
- Add organization branding support:
  - Load organization data from invitation token or orgCode
  - Display organization logo (if available)
  - Use program name instead of generic "Meant2Grow"
  - Apply accent color to buttons, links, and accent elements
  - Use intro text from `programSettings.introText`

**2. Create New Route**

- Route: `/org-signup` or `/join/:orgCode`
- Handle both invitation tokens (`?invite=token`) and orgCode (`?orgCode=ABC123`)
- Priority: invitation token first, then orgCode fallback

**3. Update Routing Logic**

- In `App.tsx`, add new route for organization signup
- Update invitation link generation to use new route
- Keep existing `/auth` route for non-organization signups

**4. Branding Implementation**

- Load organization via `getOrganization()` or `getOrganizationByCode()`
- Extract branding from `organization.programSettings`:
  - `programName` - Display as page title
  - `logo` - Display in header
  - `accentColor` - Apply to primary buttons and accents
  - `introText` - Display as welcome message
- Fallback to defaults if organization not found or settings missing

**5. Preserve Existing Functionality**

- Keep `Authentication.tsx` component completely unchanged
- Existing `/auth` route continues to work for:
  - Organization admin signup
  - Generic participant signup (without org)
  - Login functionality

### Files to Create/Modify

**New Files:**

- `components/OrganizationSignup.tsx` - New branded signup component

**Files to Modify:**

- `App.tsx` - Add new route and routing logic
- `services/database.ts` - Ensure `getOrganizationByCode` exists (already exists)
- `components/Referrals.tsx` - Update invitation link to use new route (optional, can keep existing)

### Technical Details

**Branding Data Source:**

```typescript
interface OrganizationBranding {
  programName: string;
  logo: string | null;
  accentColor: string;
  introText: string;
}
```

**Route Handling:**

- `/org-signup?invite={token}` - Load org from invitation
- `/org-signup?orgCode={code}` - Load org by code
- `/org-signup` - Show error if no org identifier

**Styling:**

- Use dynamic accent color for:
  - Primary button background
  - Link colors
  - Focus states
  - Progress indicators
  - Success messages
