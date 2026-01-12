# Action Plans & Documentation

This folder contains all project documentation, planning documents, and architectural decisions for BDN 2.0.

## 📚 Documentation Structure

### Core Documentation
- **[CODEBASE-REVIEW-2025.md](./CODEBASE-REVIEW-2025.md)** - **START HERE** - Comprehensive, up-to-date codebase review
- **[project-overview.md](./project-overview.md)** - Project overview and getting started guide
- **[architecture.md](./architecture.md)** - Architecture and design system documentation

### Feature Documentation
- **[feature-flags-implementation.md](./feature-flags-implementation.md)** - Feature flags system documentation
- **[developer-quick-reference.md](./developer-quick-reference.md)** - Developer dashboard quick reference
- **[platform-features.md](./platform-features.md)** - Platform features and functionality overview

### Implementation & Progress
- **[implementation-progress.md](./implementation-progress.md)** - Current implementation status and progress
- **[api-integration-tracking.md](./api-integration-tracking.md)** - API integration TODO tracking
- **[refactoring-progress.md](./refactoring-progress.md)** - Refactoring progress and status

### Database & Compliance
- **[database-design.md](./database-design.md)** - Database schema and design
- **[database-design-summary.md](./database-design-summary.md)** - Database design summary
- **[database-design-pci-compliance.md](./database-design-pci-compliance.md)** - PCI compliance considerations
- **[database-indexes-plan.md](./database-indexes-plan.md)** - Database indexing strategy
- **[database-indexes-checklist.md](./database-indexes-checklist.md)** - Database indexes checklist
- **[pci-compliance-final-check.md](./pci-compliance-final-check.md)** - PCI compliance checklist

### Technical Guides
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
- **[expo-production-insights.md](./expo-production-insights.md)** - Expo production insights

### Refactoring & Optimization
- **[refactoring-plan.md](./refactoring-plan.md)** - Refactoring plan and strategy
- **[refactoring-progress.md](./refactoring-progress.md)** - Refactoring progress tracking
- **[refactoring-optimization-review.md](./refactoring-optimization-review.md)** - Refactoring and optimization review
- **[tokens-refactoring-plan.md](./tokens-refactoring-plan.md)** - Tokens page refactoring plan

### Business & Configuration
- **[fee-structure.md](./fee-structure.md)** - Fee structure documentation
- **[internationalization.md](./internationalization.md)** - Internationalization/i18n documentation
- **[platform-specific-code.md](./platform-specific-code.md)** - Platform-specific code documentation

### Troubleshooting
- **[troubleshooting.md](./troubleshooting.md)** - Troubleshooting guide
- **[TROUBLESHOOTING copy.md](./TROUBLESHOOTING%20copy.md)** - Troubleshooting copy (duplicate, can be removed)

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

**Last Updated:** 2025-01-XX

### Recent Updates
- **[CODEBASE-REVIEW-UPDATE-2025.md](./CODEBASE-REVIEW-UPDATE-2025.md)** - Comprehensive codebase review and documentation update (January 2025)
