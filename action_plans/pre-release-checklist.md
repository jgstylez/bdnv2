# BDN 2.0 Pre-Release Checklist

**Quick Reference Checklist** - See [pre-release-analysis.md](./pre-release-analysis.md) for detailed information

---

## 🔴 CRITICAL - Must Complete Before Release

### Backend API Integration
- [ ] **Authentication System**
  - [ ] Login API (`POST /api/auth/login`)
  - [ ] Signup API (`POST /api/auth/signup`)
  - [ ] Token refresh API (`POST /api/auth/refresh`)
  - [ ] Password reset API (`POST /api/auth/reset-password`)
  - [ ] Secure token storage (expo-secure-store)

- [ ] **Payment Processing**
  - [ ] Checkout API (`POST /api/orders/checkout`)
  - [ ] BLKD purchase API (`POST /api/blkd/purchase`)
  - [ ] Gift card order API (`POST /api/gift-cards/order`)
  - [ ] C2B payment API (`POST /api/payments/c2b`)
  - [ ] Token purchase API (`POST /api/tokens/purchase`)
  - [ ] Payment webhook handlers

- [ ] **Core Data APIs**
  - [ ] Business data APIs (list, detail, products, reviews)
  - [ ] Product data APIs (CRUD operations)
  - [ ] Transaction APIs (list, detail, refund)
  - [ ] Wallet/Account APIs
  - [ ] User profile APIs

### API Client Infrastructure
- [ ] Create `lib/api-client.ts` with:
  - [ ] Request/response interceptors
  - [ ] Authentication token handling
  - [ ] Refresh token logic
  - [ ] Error handling
  - [ ] Retry logic
  - [ ] Request caching

### Expo Production Configuration
- [ ] Create `eas.json` configuration
- [ ] Set up EAS Build profiles (dev, preview, production)
- [ ] Configure app signing certificates
- [ ] Set up environment variables (`.env` files)
- [ ] Configure EAS Secrets for sensitive data
- [ ] Update `app.json` with production settings
- [ ] Verify bundle identifiers and package names

### Security
- [ ] Implement secure token storage (expo-secure-store)
- [ ] Review API endpoint security
- [ ] Set up secrets management (EAS Secrets)
- [ ] Implement input validation
- [ ] Review environment variable security
- [ ] Set up HTTPS-only communication

### Error Handling & Monitoring
- [ ] Set up Sentry (or alternative error tracking)
- [ ] Integrate error tracking with Expo
- [ ] Add React error boundaries
- [ ] Implement user-friendly error messages
- [ ] Configure error alerting

---

## 🟡 HIGH PRIORITY - Should Complete Before Release

### Push Notifications
- [ ] Configure APNs for iOS
- [ ] Configure FCM for Android
- [ ] Implement push token registration API
- [ ] Set up notification server endpoints
- [ ] Test notifications on both platforms

### Testing
- [ ] Set up Jest for unit tests
- [ ] Write tests for authentication flow
- [ ] Write tests for payment processing
- [ ] Write tests for checkout flow
- [ ] Set up E2E testing (Detox/Maestro)
- [ ] Test critical user flows

### Performance Optimization
- [ ] Refactor files >400 LOC
- [ ] Optimize CartContext performance
- [ ] Implement React.memo() for expensive components
- [ ] Add lazy loading for admin pages
- [ ] Optimize image loading (use expo-image)
- [ ] Implement list virtualization

### App Store Preparation
- [ ] Generate app icons (all sizes: 1024x1024, etc.)
- [ ] Create splash screens
- [ ] Prepare iOS App Store assets
  - [ ] Screenshots (all device sizes)
  - [ ] App description
  - [ ] Privacy policy URL
  - [ ] Support URL
- [ ] Prepare Google Play Store assets
  - [ ] Screenshots (all device sizes)
  - [ ] Feature graphic
  - [ ] App description
  - [ ] Privacy policy URL

---

## 🟢 MEDIUM PRIORITY - Can Complete Post-Release

### Analytics & Monitoring
- [ ] Set up analytics service (Mixpanel/Amplitude/Firebase)
- [ ] Implement event tracking
- [ ] Set up performance monitoring
- [ ] Track key user flows

### Documentation
- [ ] Write API documentation
- [ ] Document environment variables
- [ ] Create developer setup guide
- [ ] Document deployment process

### Third-Party Integrations
- [ ] Set up email service (SendGrid/AWS SES)
- [ ] Configure Elasticsearch (for search)
- [ ] Set up file storage (S3/Cloudinary)
- [ ] Configure exchange rate API

### Real-Time Features
- [ ] Set up WebSocket connection
- [ ] Implement real-time notifications
- [ ] Add real-time transaction updates

---

## 📋 Quick Setup Commands

### EAS Build Setup
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS Build
eas build:configure

# Create development build
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Environment Variables Setup
```bash
# Create .env file
touch .env

# Add to .env (example)
EXPO_PUBLIC_API_URL=https://api.bdn.app
EXPO_PUBLIC_ELASTICSEARCH_ENDPOINT=https://search.bdn.app

# Set EAS Secrets (for sensitive data)
eas secret:create --scope project --name API_SECRET_KEY --value your-secret-value
```

### Error Tracking Setup (Sentry)
```bash
# Install Sentry
npx expo install @sentry/react-native

# Initialize Sentry
npx @sentry/wizard -i reactNative -p ios android
```

---

## 🎯 Priority Order

1. **Week 1-2:** Backend API development (authentication, payments)
2. **Week 2-3:** API client implementation and integration
3. **Week 3-4:** Expo production configuration
4. **Week 4-5:** Security hardening and error tracking
5. **Week 5-6:** Testing and QA
6. **Week 6-7:** App store preparation and submission

---

## 📝 Notes

- See [pre-release-analysis.md](./pre-release-analysis.md) for detailed explanations
- See [api-integration-tracking.md](./api-integration-tracking.md) for API integration details
- Update this checklist as items are completed
- Review weekly with team

---

**Last Updated:** 2025-01-XX

