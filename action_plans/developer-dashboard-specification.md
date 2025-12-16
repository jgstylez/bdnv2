# Developer Dashboard Specification

**Date:** 2024-12-19  
**Purpose:** Complete specification for the BDN Developer Dashboard

---

## Overview

The Developer Dashboard provides a comprehensive interface for developers to integrate with the BDN API. It includes API documentation, key management, webhook configuration, SDK downloads, logging, and testing tools.

---

## Structure

### Main Dashboard (`/developer`)

**Purpose:** Overview of developer resources and quick stats

**Features:**
- Quick stats: API calls today, rate limit remaining, active API keys, average response time
- Developer tools navigation cards
- Quick links to getting started, API status, and support

**Stats Displayed:**
- Total API calls today
- Rate limit remaining (with progress bar)
- Active API keys count
- Average response time

---

## Pages

### 1. API Documentation (`/developer/api-docs`)

**Purpose:** Complete API reference documentation

**Features:**
- Getting started guide
- Code examples in multiple languages (cURL, JavaScript, Python)
- Expandable endpoint list with:
  - HTTP method (color-coded)
  - Endpoint path
  - Description
  - Category
- Rate limits information
- Request/response examples

**Endpoints Covered:**
- Businesses: `GET /api/v1/businesses`, `GET /api/v1/businesses/{id}`
- Payments: `POST /api/v1/payments/c2b`
- Transactions: `GET /api/v1/transactions`
- Webhooks: `POST /api/v1/webhooks`
- Users: `GET /api/v1/users/me`

**Rate Limits:**
- 10,000 requests per hour per API key
- Rate limit headers included in responses

---

### 2. API Keys (`/developer/api-keys`)

**Purpose:** Manage API keys and access credentials

**Features:**
- List all API keys (active and revoked)
- Create new API keys (sandbox or live)
- View key details (expanded view)
- Copy keys to clipboard
- Revoke keys
- Security best practices notice

**Key Information:**
- Key name
- Environment (sandbox/live)
- Status (active/revoked)
- Created date
- Last used date
- Full key value (masked until expanded)

**Security Features:**
- Visual distinction between sandbox and live keys
- Warning banners for live keys
- Revocation confirmation dialogs
- Security best practices displayed

---

### 3. Webhooks (`/developer/webhooks`)

**Purpose:** Configure and manage webhook endpoints

**Features:**
- List all webhooks
- Create new webhooks
- Configure webhook URL
- Select events to subscribe to
- Activate/deactivate webhooks
- Delete webhooks
- View webhook secret
- Webhook documentation

**Webhook Information:**
- Webhook name
- URL
- Subscribed events
- Status (active/inactive)
- Created date
- Last triggered timestamp
- Webhook secret (for signature verification)

**Available Events:**
- `payment.completed`
- `payment.failed`
- `transaction.created`
- `transaction.updated`
- `user.created`
- `user.updated`
- `business.created`
- `business.updated`

**Webhook Security:**
- Signature verification using webhook secret
- Timestamp validation
- Documentation on verification process

---

### 4. SDKs & Code Examples (`/developer/sdks`)

**Purpose:** Download SDKs and view code examples

**Features:**
- List official SDKs:
  - JavaScript/TypeScript (v2.1.0)
  - Python (v1.8.0)
  - PHP (v1.5.0)
  - Ruby (v1.3.0)
- Installation commands (copyable)
- Quick start code examples
- Language selector for examples
- Additional resources links

**Code Examples Include:**
- SDK initialization
- List businesses
- Create payment
- Error handling

**Additional Resources:**
- GitHub repository
- API reference link
- Changelog

---

### 5. Logs & Debugging (`/developer/logs`)

**Purpose:** View API request logs and debug issues

**Features:**
- Filter logs by status (all/success/errors)
- Expandable log entries
- Request details:
  - HTTP method
  - Endpoint path
  - Status code
  - Response time
  - API key used
  - Error messages (if any)
- Statistics:
  - Total requests today
  - Error rate
  - Average response time

**Log Entry Information:**
- Timestamp
- HTTP method (color-coded)
- Endpoint path
- Status code (color-coded)
- Response time
- API key (masked)
- Error message (if applicable)

**Color Coding:**
- GET: Blue
- POST: Green
- PUT/PATCH: Orange
- DELETE: Red
- Status 2xx: Green
- Status 4xx: Orange
- Status 5xx: Red

---

### 6. Testing Tools (`/developer/testing`)

**Purpose:** Test API endpoints and validate integrations

**Features:**
- Quick test scenarios:
  - List Businesses
  - Get Business
  - Create Payment
  - List Transactions
- Request builder:
  - HTTP method selector
  - Endpoint input
  - Request body editor (for POST/PUT)
  - Test button
- Response viewer
- cURL command generator
- Copy to clipboard functionality

**Test Scenarios:**
Pre-configured test cases that populate the request builder with common API calls.

**Request Builder:**
- Method: GET, POST, PUT, DELETE
- Endpoint: Full API path
- Body: JSON editor for POST/PUT requests

**Response Display:**
- Formatted JSON response
- Copy button for easy sharing

**cURL Generator:**
- Generates complete cURL command
- Includes headers and authentication
- Includes request body if applicable

---

## Navigation

### Sidebar Navigation (Desktop)
- Dashboard
- API Documentation
- API Keys
- Webhooks
- SDKs & Examples
- Logs & Debugging
- Testing Tools

### Header
- Page title (dynamic based on current page)
- Back to User Dashboard button
- Menu button (mobile)

---

## Design System

### Colors
- Primary background: `#232323`
- Secondary background: `#474747`
- Accent: `#ba9988`
- Info: `#2196f3` (for developer theme)
- Success: `#4caf50`
- Warning: `#ff9800`
- Error: `#ff4444`

### Typography
- Headings: Bold, 20-32px
- Body: Regular, 14-16px
- Code: Monospace, 12-14px

### Components
- Cards: Rounded corners (16px), border, padding
- Buttons: Rounded (8-12px), accent background
- Inputs: Rounded (8-12px), dark background
- Code blocks: Dark background, monospace font

---

## API Integration Points

### Mock Data
Currently using mock data for:
- API keys list
- Webhooks list
- Logs entries
- Stats

### Future API Endpoints Needed

**API Keys:**
- `GET /api/developer/api-keys` - List API keys
- `POST /api/developer/api-keys` - Create API key
- `DELETE /api/developer/api-keys/{id}` - Revoke API key

**Webhooks:**
- `GET /api/developer/webhooks` - List webhooks
- `POST /api/developer/webhooks` - Create webhook
- `PUT /api/developer/webhooks/{id}` - Update webhook
- `DELETE /api/developer/webhooks/{id}` - Delete webhook
- `POST /api/developer/webhooks/{id}/test` - Test webhook

**Logs:**
- `GET /api/developer/logs` - Get API logs
- `GET /api/developer/logs/stats` - Get log statistics

**Testing:**
- `POST /api/developer/test` - Execute test request

---

## Security Considerations

1. **API Keys:**
   - Never display full keys in lists (only when expanded)
   - Warn users about live keys
   - Require confirmation for revocation
   - Display security best practices

2. **Webhooks:**
   - Validate URLs (must be HTTPS)
   - Display webhook secrets securely
   - Provide signature verification documentation

3. **Logs:**
   - Mask sensitive data in logs
   - Filter by API key if needed
   - Limit log retention period

4. **Testing:**
   - Use sandbox environment by default
   - Warn about live environment usage
   - Don't store test requests/responses

---

## Future Enhancements

1. **API Versioning:**
   - Support multiple API versions
   - Version selector in documentation

2. **GraphQL Support:**
   - GraphQL endpoint documentation
   - GraphQL playground

3. **Webhook Testing:**
   - Test webhook delivery
   - View webhook delivery history
   - Retry failed deliveries

4. **Analytics:**
   - Usage charts and graphs
   - Request patterns analysis
   - Performance metrics

5. **Team Management:**
   - Multiple developers per account
   - Role-based access control
   - Activity logs per developer

6. **Documentation:**
   - Interactive API explorer
   - Postman collection download
   - OpenAPI/Swagger spec

---

## File Structure

```
app/developer/
  _layout.tsx          # Developer layout with sidebar
  index.tsx            # Developer dashboard
  api-docs.tsx         # API documentation
  api-keys.tsx         # API key management
  webhooks.tsx         # Webhook management
  sdks.tsx             # SDK downloads and examples
  logs.tsx             # Logs and debugging
  testing.tsx           # Testing tools

components/
  DeveloperSidebar.tsx # Sidebar navigation
  DeveloperHeader.tsx  # Header with title and actions
```

---

## Access Control

The developer dashboard should be accessible to:
- Users with developer role/permissions
- Users who have created at least one API key
- Admin users (full access)

Access can be controlled via:
- User role/permissions check
- Feature flag
- API key ownership verification

---

## Related Documentation

- `action_plans/api-integration-tracking.md` - API integration status
- `action_plans/platform-features.md` - Platform features overview
- `app/admin/api-playground.tsx` - Admin API playground (reference)

---

## Notes

- All pages follow the same design system as admin dashboard
- Mobile-responsive design
- Dark theme consistent with platform
- Code examples use monospace fonts
- Copy-to-clipboard functionality for all code snippets
- Expandable sections for detailed information

