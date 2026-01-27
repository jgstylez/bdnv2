# Action Plans & Documentation

This folder contains all project documentation, planning documents, and architectural decisions for BDN 2.0.

## 📚 Documentation Structure

### Core Documentation
- **[implementation-status-2026.md](./implementation-status-2026.md)** - **CURRENT STATUS** - What's implemented vs planned
- **[CODEBASE-REVIEW-2025.md](./CODEBASE-REVIEW-2025.md)** - **START HERE** - Comprehensive, up-to-date codebase review
- **[project-overview.md](./project-overview.md)** - Project overview and getting started guide
- **[architecture.md](./architecture.md)** - Architecture and design system documentation

### Comprehensive Technical Plans
These plans cover the complete technical architecture and implementation strategy for BDN 2.0:

- **[bdn-2.0-comprehensive-technical-plan.md](./bdn-2.0-comprehensive-technical-plan.md)** - **MASTER PLAN** - Complete technical architecture, payment system, inventory management, content gating, admin panel, AI features, and implementation phases
  - **Note:** This document describes planned architecture. See [implementation-status-2026.md](./implementation-status-2026.md) for what's actually implemented.
- **[security-compliance-strategy.md](./security-compliance-strategy.md)** - Database security, PCI DSS compliance (USD transactions via processors), GDPR/CCPA, financial regulations
- **[unit-testing-strategy.md](./unit-testing-strategy.md)** - Unit testing strategy with tests written alongside features
- **[testing-strategy-expansion.md](./testing-strategy-expansion.md)** - Integration, E2E, and performance testing strategies
- **[infrastructure-deployment-strategy.md](./infrastructure-deployment-strategy.md)** - Docker, Cloud Run, CI/CD pipelines, environment management
- **[monitoring-observability-strategy.md](./monitoring-observability-strategy.md)** - Logging, alerting, metrics, performance monitoring, cost tracking
- **[disaster-recovery-business-continuity.md](./disaster-recovery-business-continuity.md)** - Backup procedures, failover strategies, recovery procedures, RTO/RPO targets
- **[documentation-strategy.md](./documentation-strategy.md)** - API docs (OpenAPI/Swagger), runbooks, ADRs, developer guides
- **[charting-blnkfinance-integration.md](./charting-blnkfinance-integration.md)** - Charting library migration (Victory) and BlnkFinance Core ledger integration
- **[firebase-sandbox-production-ci-cd.md](./firebase-sandbox-production-ci-cd.md)** - Firebase sandbox/production split and CI/CD setup (for legacy systems)

### Feature Documentation
- **[feature-flags-implementation.md](./feature-flags-implementation.md)** - Feature flags system documentation
- **[developer-quick-reference.md](./developer-quick-reference.md)** - Developer dashboard quick reference
- **[platform-features.md](./platform-features.md)** - Platform features and functionality overview

### Implementation & Progress
- **[implementation-status-2026.md](./implementation-status-2026.md)** - **CURRENT STATUS** - What's implemented vs planned (January 2026)
- **[implementation-progress.md](./implementation-progress.md)** - Implementation status and progress tracking
- **[api-integration-tracking.md](./api-integration-tracking.md)** - API integration TODO tracking
- **[refactoring-progress.md](./refactoring-progress.md)** - Refactoring progress and status
- **[RECENT-UPDATES-2025-01-25.md](./RECENT-UPDATES-2025-01-25.md)** - Summary of recent implementation work (January 25, 2025)
- **[documentation-review-update-plan.md](./documentation-review-update-plan.md)** - **NEW** - Documentation review and update plan (January 2026)

### Recent Implementation Work (January 2025)
- **[business-merchant-flows-implementation.md](./business-merchant-flows-implementation.md)** - Business onboarding, product management, order fulfillment, verification workflows
- **[shopping-checkout-flow-implementation.md](./shopping-checkout-flow-implementation.md)** - Shopping cart, checkout, order confirmation, and tracking flows
- **[navigation-flows-implementation.md](./navigation-flows-implementation.md)** - Critical navigation improvements and user flows
- **[error-handling-implementation.md](./error-handling-implementation.md)** - Error handling and feedback system implementation
- **[search-discovery-implementation.md](./search-discovery-implementation.md)** - Search filtering, sorting, map view, and category browsing
- **[account-management-implementation.md](./account-management-implementation.md)** - Profile editing, account deletion, password/email change, notifications
- **[invoice-flows-implementation.md](./invoice-flows-implementation.md)** - Invoice creation, draft saving, sending, and payment tracking

### Database & Compliance
- **[database-design.md](./database-design.md)** - Database schema and design
- **[database-design-summary.md](./database-design-summary.md)** - Database design summary
- **[database-design-pci-compliance.md](./database-design-pci-compliance.md)** - PCI compliance considerations
- **[database-indexes-plan.md](./database-indexes-plan.md)** - Database indexing strategy
- **[database-indexes-checklist.md](./database-indexes-checklist.md)** - Database indexes checklist
- **[pci-compliance-final-check.md](./pci-compliance-final-check.md)** - PCI compliance checklist

### Technical Guides
- **[expo-setup-consolidated-plan.md](./expo-setup-consolidated-plan.md)** - **NEW** - Consolidated Expo setup plan (environment variables, EAS Build, updates, notifications)
- **[expo-image-migration-guide.md](./expo-image-migration-guide.md)** - expo-image migration guide
- **[nativecn-setup.md](./nativecn-setup.md)** - NativeCN component library setup
- **[nativecn-examples.md](./nativecn-examples.md)** - NativeCN usage examples
- **[babel-fix.md](./babel-fix.md)** - Babel configuration fixes

### Navigation & UX
- **[menu-inventory.md](./menu-inventory.md)** - Navigation structure and menu inventory
- **[navigation-ux-review.md](./navigation-ux-review.md)** - Navigation UX review
- **[navigation-freeze-fix.md](./navigation-freeze-fix.md)** - Navigation freeze issues and fixes
- **[scrollview-tabbar-fix.md](./scrollview-tabbar-fix.md)** - ScrollView/TabBar interaction fixes
- **[scroll-touch-optimizations.md](./scroll-touch-optimizations.md)** - Scroll and touch performance optimizations
- **[back-to-top-button.md](./back-to-top-button.md)** - Back-to-top button feature documentation and iOS fix

### Feature Specifications
- **[admin-pages-specification.md](./admin-pages-specification.md)** - Admin pages specification
- **[admin-panel-review.md](./admin-panel-review.md)** - Admin panel review
- **[developer-dashboard-specification.md](./developer-dashboard-specification.md)** - Developer dashboard spec
- **[developer-dashboard-summary.md](./developer-dashboard-summary.md)** - Developer dashboard summary
- **[subscription-box-feature.md](./subscription-box-feature.md)** - Subscription box feature documentation
- **[daily-co-integration.md](./daily-co-integration.md)** - Daily.co video call integration

### Production & Release
- **[production-readiness-review.md](./production-readiness-review.md)** - Production readiness assessment
- **[pre-release-checklist.md](./pre-release-checklist.md)** - Pre-release checklist
- **[pre-release-analysis.md](./pre-release-analysis.md)** - Pre-release analysis
- **[expo-setup-consolidated-plan.md](./expo-setup-consolidated-plan.md)** - **NEW** - Consolidated Expo setup plan
- **[expo-production-insights.md](./expo-production-insights.md)** - Expo production insights (see consolidated plan for updates)

### Refactoring & Optimization
- **[refactoring-optimization-plan.md](./refactoring-optimization-plan.md)** - **NEW** - Comprehensive refactoring and optimization plan (recurring payments, redundant fields, statistics)
- **[refactoring-plan.md](./refactoring-plan.md)** - Refactoring plan and strategy
- **[refactoring-progress.md](./refactoring-progress.md)** - Refactoring progress tracking
- **[tokens-refactoring-plan.md](./tokens-refactoring-plan.md)** - Tokens page refactoring plan

### Business & Configuration
- **[fee-structure.md](./fee-structure.md)** - Fee structure documentation
- **[internationalization.md](./internationalization.md)** - Internationalization/i18n documentation
- **[platform-specific-code.md](./platform-specific-code.md)** - Platform-specific code documentation

### Troubleshooting
- **[troubleshooting.md](./troubleshooting.md)** - Troubleshooting guide
- **[TROUBLESHOOTING copy.md](./TROUBLESHOOTING%20copy.md)** - Troubleshooting copy (duplicate, can be removed)

### Specialized Plans & Reviews
- **[seo-enhancement-plan.md](./seo-enhancement-plan.md)** - SEO enhancement for landing pages (structured data, Open Graph, meta tags)
- **[legacy-300-landing-page.md](./legacy-300-landing-page.md)** - Legacy 300 landing page implementation plan
- **[error-fixes-mock-data-walkthrough.md](./error-fixes-mock-data-walkthrough.md)** - Error fixes and mock data for app walkthrough
- **[organization-program-management-review.md](./organization-program-management-review.md)** - Organization signup, program setup, and participant invitation flows review

### Historical Reviews (Archived)
These documents contain historical information and have been consolidated into **[CODEBASE-REVIEW-2025.md](./CODEBASE-REVIEW-2025.md)**:
- `codebase-review-2024.md` - December 2024 review (historical)
- `codebase-review-2025-01.md` - January 2025 review (historical)
- `comprehensive-codebase-review.md` - Comprehensive review (historical)
- `comprehensive-code-review-2025.md` - Comprehensive review 2025 (historical)
- `final-codebase-review.md` - Final review (historical)
- `codebase-error-review.md` - Error review (historical)
- `comprehensive-crud-flow-review.md` - CRUD flow review (historical)
- `crud-and-optimization-fixes.md` - CRUD fixes (historical)
- `todo-completion-summary.md` - TODO completion summary (historical)

**Note:** Historical reviews are kept for reference but should not be used as the primary source. Use **[CODEBASE-REVIEW-2025.md](./CODEBASE-REVIEW-2025.md)** for current state.

## 📋 Guidelines

- All documentation should be placed in this folder
- Keep files focused and under 400 LOC when possible
- Update documentation as the project evolves
- Use markdown for all documentation files
- Link to related documents when appropriate
- Mark historical/archived documents clearly

### Important: Mobile Definition
When referring to "mobile" in this codebase, it encompasses **both** mobile browser breakpoints (responsive web design) and native mobile display (React Native/Expo apps). See **[architecture.md](./architecture.md)** for detailed responsive design guidelines.

## 🔍 Quick Reference

### For New Developers
1. Start with **[project-overview.md](./project-overview.md)**
2. Read **[architecture.md](./architecture.md)** for architecture overview
3. Review **[CODEBASE-REVIEW-2025.md](./CODEBASE-REVIEW-2025.md)** for current state
4. Check **[developer-quick-reference.md](./developer-quick-reference.md)** for developer tools

### For API Integration
1. Review **[api-integration-tracking.md](./api-integration-tracking.md)** for TODO list
2. Check **[implementation-progress.md](./implementation-progress.md)** for current status
3. See **[CODEBASE-REVIEW-2025.md](./CODEBASE-REVIEW-2025.md)** for API infrastructure details

### For Production Deployment
1. Review **[production-readiness-review.md](./production-readiness-review.md)**
2. Check **[pre-release-checklist.md](./pre-release-checklist.md)**
3. Review **[expo-production-insights.md](./expo-production-insights.md)**

### For Troubleshooting
1. Check **[troubleshooting.md](./troubleshooting.md)**
2. Review relevant technical guides (navigation, scroll, etc.)

---

**Last Updated:** 2026-01-27

### Recent Updates (January 2026)

#### January 27, 2026
- **[expo-setup-consolidated-plan.md](./expo-setup-consolidated-plan.md)** - **NEW** - Consolidated Expo setup plan (resolves conflicts, aligns all Expo docs)
- **[documentation-review-update-plan.md](./documentation-review-update-plan.md)** - **NEW** - Comprehensive documentation review and update plan
- **[implementation-status-2026.md](./implementation-status-2026.md)** - **NEW** - Current implementation status of all features
- **[refactoring-optimization-plan.md](./refactoring-optimization-plan.md)** - **NEW** - Refactoring and optimization opportunities
- Updated **[bdn-2.0-comprehensive-technical-plan.md](./bdn-2.0-comprehensive-technical-plan.md)** with status indicators
- Updated **[expo-production-insights.md](./expo-production-insights.md)** to reflect current state
- Updated **[infrastructure-deployment-strategy.md](./infrastructure-deployment-strategy.md)** to clarify mobile vs backend deployment

### Recent Updates (January 2025)

#### January 25, 2025
- **[RECENT-UPDATES-2025-01-25.md](./RECENT-UPDATES-2025-01-25.md)** - **NEW** - Comprehensive summary of all recent implementation work
- **[business-merchant-flows-implementation.md](./business-merchant-flows-implementation.md)** - **NEW** - Business/merchant flows complete with API integration
- **[shopping-checkout-flow-implementation.md](./shopping-checkout-flow-implementation.md)** - **NEW** - Shopping & checkout flows with order tracking
- **[navigation-flows-implementation.md](./navigation-flows-implementation.md)** - **UPDATED** - Added order tracking UI details

#### Previous Updates
- **[CODEBASE-REVIEW-UPDATE-2025.md](./CODEBASE-REVIEW-UPDATE-2025.md)** - Comprehensive codebase review and documentation update (January 2025)
- **[error-handling-implementation.md](./error-handling-implementation.md)** - Error handling and feedback system
- **[search-discovery-implementation.md](./search-discovery-implementation.md)** - Search and discovery improvements
- **[account-management-implementation.md](./account-management-implementation.md)** - User account management features
- **[invoice-flows-implementation.md](./invoice-flows-implementation.md)** - Invoice workflow completion
