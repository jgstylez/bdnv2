# Gamification & Badges Game Plan

**Date:** 2026-01-27  
**Purpose:** Comprehensive implementation plan for gamification system and badge functionality  
**Status:** Planning Phase

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Gap Analysis](#gap-analysis)
4. [Implementation Roadmap](#implementation-roadmap)
5. [Technical Architecture](#technical-architecture)
6. [Badge System Details](#badge-system-details)
7. [Gamification Features](#gamification-features)
8. [Database Schema Updates](#database-schema-updates)
9. [API Endpoints](#api-endpoints)
10. [Frontend Components](#frontend-components)
11. [Testing Strategy](#testing-strategy)
12. [Analytics & Tracking](#analytics--tracking)
13. [Success Metrics](#success-metrics)

---

## Executive Summary

The BDN platform has a solid foundation for gamification with badge definitions, UI components, and a points system already in place. However, the badge system is currently **non-functional** - badges are defined but not automatically awarded, progress is not tracked, and there's no connection between user actions and badge achievements.

This plan outlines a comprehensive approach to:
- **Activate the badge system** with automatic awarding logic
- **Track badge progress** in real-time
- **Enhance gamification** with streaks, challenges, and social features
- **Align frontend/backend** point thresholds and systems
- **Create engaging user experiences** that drive platform engagement

---

## Current State Analysis

### ✅ What Exists

1. **Badge Definitions** (`types/badges.ts`)
   - 30+ badges defined across 6 categories
   - Badge types: Milestone, Purchase, Social, Community, Achievement, Education
   - Rarity system: Common, Rare, Epic, Legendary
   - Points rewards defined for each badge

2. **UI Components**
   - Badge display page (`app/pages/myimpact/badges.tsx`)
   - Badge icon component (`components/BadgeIcon.tsx`)
   - Responsive design (mobile/desktop)
   - Category filtering
   - Progress visualization

3. **Database Schema** (`server/prisma/schema.prisma`)
   - `Badge` model (badge definitions)
   - `UserBadge` model (user badge assignments)
   - Basic relationships established

4. **Points System**
   - Impact points tracking (`types/impact.ts`)
   - Points awarded for various activities
   - Level progression system (Basic, Bronze, Silver, Gold, Diamond, Black Diamond)
   - Leaderboard implementation

5. **My Impact Section**
   - Points display
   - Level progression visualization
   - Recent activity feed
   - Links to badges, points, earnings, leaderboard

### ❌ What's Missing

1. **Badge Awarding Logic**
   - No automatic badge awarding when users complete actions
   - No badge progress calculation service
   - No connection between user actions and badge requirements

2. **Progress Tracking**
   - Badge progress not calculated in real-time
   - No tracking of partial progress toward badges
   - Mock data used in UI instead of real data

3. **Activity Streaks**
   - Streak badges defined but not tracked
   - No daily activity tracking system
   - No streak maintenance logic

4. **Backend Integration**
   - Frontend/backend point threshold mismatches
   - No API endpoints for badge operations
   - No badge awarding service/worker

5. **Notifications**
   - No badge earned notifications
   - No progress milestone notifications
   - No celebration animations/UI

6. **Analytics**
   - No badge completion analytics
   - No gamification engagement metrics
   - No A/B testing framework for badge rewards

---

## Gap Analysis

### Critical Gaps

| Gap | Impact | Priority | Effort |
|-----|--------|----------|--------|
| Badge awarding logic | High - Core functionality missing | P0 | High |
| Progress tracking | High - Users can't see progress | P0 | Medium |
| Backend API endpoints | High - No data persistence | P0 | Medium |
| Activity streak tracking | Medium - Feature incomplete | P1 | Medium |
| Badge notifications | Medium - Poor UX without feedback | P1 | Low |
| Point threshold alignment | Medium - Confusing user experience | P1 | Low |
| Badge analytics | Low - Nice to have | P2 | Medium |

### Technical Debt

1. **Mock Data Usage**
   - `app/pages/myimpact/badges.tsx` uses hardcoded mock badges
   - No API integration for fetching user badges
   - No real-time updates

2. **Point Threshold Mismatches**
   - Frontend thresholds don't match backend (see `reward-levels-points-system.md`)
   - Bronze level logic differs (purchase vs points-based)
   - Badge level requirements may be misaligned

3. **Missing Database Fields**
   - `UserBadge` model lacks `progress` field
   - No `earnedAt` timestamp tracking
   - No badge requirement tracking

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
**Goal:** Make badges functional and trackable

- [ ] **1.1** Database schema updates
  - Add `progress` field to `UserBadge`
  - Add `earnedAt` timestamp
  - Add indexes for badge queries
  - Migrate badge definitions to database

- [ ] **1.2** Backend API endpoints
  - `GET /api/badges` - List all badges
  - `GET /api/users/:userId/badges` - Get user badges
  - `GET /api/users/:userId/badges/:badgeId/progress` - Get badge progress
  - `POST /api/users/:userId/badges/:badgeId/award` - Award badge (admin/internal)

- [ ] **1.3** Badge progress calculation service
  - Create `BadgeProgressService`
  - Calculate progress for each badge type
  - Handle cumulative vs. one-time badges

- [ ] **1.4** Connect frontend to API
  - Replace mock data with API calls
  - Implement real-time progress updates
  - Add loading states and error handling

### Phase 2: Badge Awarding (Weeks 3-4)
**Goal:** Automatically award badges when users complete actions

- [ ] **2.1** Badge awarding service
  - Create `BadgeAwardingService`
  - Event-driven badge checking
  - Handle badge requirements evaluation

- [ ] **2.2** Integration points
  - Purchase completion → Check purchase badges
  - Review submission → Check review badges
  - Referral completion → Check referral badges
  - Donation completion → Check donation badges
  - Event attendance → Check event badges
  - Profile completion → Check profile badges
  - Course completion → Check education badges

- [ ] **2.3** Badge awarding logic
  - Check all badge requirements on action
  - Award badges if requirements met
  - Update user badge progress
  - Award points for badge completion

- [ ] **2.4** Testing
  - Unit tests for badge logic
  - Integration tests for awarding flow
  - Edge case handling

### Phase 3: Activity Streaks (Weeks 5-6)
**Goal:** Implement activity streak tracking and badges

- [ ] **3.1** Activity tracking service
  - Track daily user activity
  - Calculate streak days
  - Handle streak breaks

- [ ] **3.2** Streak badge logic
  - Award streak badges (7-day, 30-day)
  - Track streak milestones
  - Handle streak recovery

- [ ] **3.3** Streak UI components
  - Display current streak
  - Show streak calendar
  - Streak maintenance reminders

### Phase 4: Notifications & UX (Weeks 7-8)
**Goal:** Enhance user experience with notifications and celebrations

- [ ] **4.1** Badge earned notifications
  - Push notifications
  - In-app notifications
  - Email notifications (optional)

- [ ] **4.2** Celebration animations
  - Badge unlock animation
  - Points awarded animation
  - Level up animation

- [ ] **4.3** Badge sharing
  - Share badge on social media
  - Badge showcase on profile
  - Badge collection display

### Phase 5: Advanced Features (Weeks 9-12)
**Goal:** Add advanced gamification features

- [ ] **5.1** Challenges/Quests
  - Weekly challenges
  - Monthly quests
  - Special event challenges

- [ ] **5.2** Badge collections
  - Collection themes
  - Collection completion rewards
  - Limited-time badges

- [ ] **5.3** Social features
  - Badge leaderboards
  - Badge comparisons
  - Badge recommendations

- [ ] **5.4** Analytics dashboard
  - Badge completion rates
  - Engagement metrics
  - A/B testing framework

---

## Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React Native)                 │
├─────────────────────────────────────────────────────────────┤
│  BadgeDisplay → BadgeAPI → BadgeService                      │
│  ProgressTracker → ActivityMonitor → StreakCalculator        │
│  NotificationCenter → CelebrationAnimations                  │
└─────────────────────────────────────────────────────────────┘
                            ↕ API Calls
┌─────────────────────────────────────────────────────────────┐
│                      Backend API Layer                        │
├─────────────────────────────────────────────────────────────┤
│  /api/badges/*          - Badge CRUD operations              │
│  /api/users/:id/badges  - User badge operations              │
│  /api/activity/streak   - Streak tracking                   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
├─────────────────────────────────────────────────────────────┤
│  BadgeAwardingService   - Award badges on actions           │
│  BadgeProgressService   - Calculate badge progress          │
│  ActivityTrackingService - Track user activity              │
│  StreakService          - Calculate/maintain streaks        │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                     │
├─────────────────────────────────────────────────────────────┤
│  badges          - Badge definitions                        │
│  user_badges     - User badge assignments & progress         │
│  activity_logs   - Daily activity tracking                   │
│  impact_points   - Points history                           │
└─────────────────────────────────────────────────────────────┘
                            ↕ Events
┌─────────────────────────────────────────────────────────────┐
│                    Event System                              │
├─────────────────────────────────────────────────────────────┤
│  purchase.completed  → Check purchase badges                │
│  review.submitted    → Check review badges                  │
│  referral.completed  → Check referral badges                │
│  donation.completed  → Check donation badges                │
│  activity.daily      → Update streak                        │
└─────────────────────────────────────────────────────────────┘
```

### Badge Awarding Flow

```
User Action (e.g., Purchase)
    ↓
Event Emitted (purchase.completed)
    ↓
BadgeAwardingService.listen()
    ↓
Get User's Current Badge Progress
    ↓
Check All Badge Requirements
    ↓
Calculate New Progress
    ↓
If Requirement Met:
    ├─ Award Badge
    ├─ Award Points
    ├─ Send Notification
    └─ Update Database
Else:
    └─ Update Progress Only
```

### Progress Calculation Logic

```typescript
// Example: Purchase count badge
function calculatePurchaseBadgeProgress(userId: string, badge: Badge) {
  const purchaseCount = await getPurchaseCount(userId);
  const requiredCount = badge.requirement.value;
  const progress = Math.min((purchaseCount / requiredCount) * 100, 100);
  const isEarned = purchaseCount >= requiredCount;
  
  return {
    progress,
    isEarned,
    currentValue: purchaseCount,
    requiredValue: requiredCount
  };
}
```

---

## Badge System Details

### Badge Categories

1. **Milestones** (6 badges)
   - First actions (purchase, review, referral, donation, event)
   - Profile completion

2. **Purchases** (4 badges)
   - Purchase count milestones (1, 5, 25, 100)

3. **Social** (4 badges)
   - Review milestones (1, 10, 50)
   - Referral milestones (1, 5, 25)

4. **Community** (3 badges)
   - Donation milestones (1, 10, 50)
   - Event attendance

5. **Achievements** (7 badges)
   - Level badges (Bronze, Silver, Gold, Diamond, Black Diamond)
   - Activity streaks (7-day, 30-day)

6. **Education** (2 badges)
   - Course completion (1, 5)

### Badge Requirements Types

| Requirement Type | Description | Tracking Method |
|-----------------|-------------|-----------------|
| `purchase_count` | Number of purchases | Count orders |
| `review_count` | Number of reviews | Count reviews |
| `referral_count` | Number of referrals | Count referrals |
| `donation_count` | Number of donations | Count donations |
| `event_attendance` | Event attendance | Count event RSVPs/check-ins |
| `course_completion` | Courses completed | Count course completions |
| `profile_completion` | Profile completion % | Calculate from profile fields |
| `level` | Points threshold | Check total points |
| `streak_days` | Consecutive activity days | Track daily activity |
| `token_purchase` | Token purchase made | Check token transactions |
| `business_enrollment` | Business enrolled | Check business enrollment |
| `nonprofit_enrollment` | Nonprofit enrolled | Check nonprofit enrollment |
| `demographics_completed` | Demographics study completed | Check demographics data |

### Badge Rarity Distribution

- **Common:** 60% of badges (18 badges)
- **Rare:** 25% of badges (8 badges)
- **Epic:** 12% of badges (4 badges)
- **Legendary:** 3% of badges (1 badge)

---

## Gamification Features

### 1. Activity Streaks

**Purpose:** Encourage daily platform engagement

**Implementation:**
- Track daily activity (login, purchase, review, etc.)
- Calculate consecutive days of activity
- Award streak badges at milestones
- Show streak calendar in UI
- Send reminders for streak maintenance

**Streak Rules:**
- Activity = Any meaningful action (purchase, review, login, etc.)
- Streak breaks if no activity for 24 hours
- Streak resets to 0 after break
- Streak badges are one-time awards

### 2. Challenges & Quests

**Purpose:** Create time-limited engagement opportunities

**Types:**
- **Weekly Challenges:** Complete X purchases, refer Y friends
- **Monthly Quests:** Multi-step challenges with rewards
- **Event Challenges:** Special challenges during events
- **Community Challenges:** Platform-wide goals

**Rewards:**
- Bonus points
- Exclusive badges
- Special discounts
- Leaderboard recognition

### 3. Badge Collections

**Purpose:** Group related badges for completion rewards

**Collections:**
- "First Steps" - All first-action badges
- "Social Butterfly" - All social badges
- "Community Champion" - All community badges
- "Scholar" - All education badges
- "Shopaholic" - All purchase badges

**Collection Rewards:**
- Bonus points for completing collection
- Special collection badge
- Profile badge showcase

### 4. Social Features

**Purpose:** Increase engagement through social interaction

**Features:**
- Badge showcase on profile
- Badge comparison with friends
- Badge leaderboards
- Badge sharing to social media
- Badge recommendations ("You're close to earning...")

### 5. Level Progression Enhancements

**Purpose:** Make level progression more engaging

**Enhancements:**
- Visual level up animations
- Level-specific benefits/perks
- Level milestone celebrations
- Level comparison with others
- Level progress predictions

---

## Database Schema Updates

### Updated UserBadge Model

```prisma
model UserBadge {
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  badge     Badge    @relation(fields: [badgeId], references: [id])
  badgeId   String
  
  // Progress tracking
  progress  Int      @default(0)  // 0-100 percentage
  currentValue Int   @default(0)  // Current progress value
  requiredValue Int               // Required value for badge
  
  // Status
  isEarned  Boolean  @default(false)
  earnedAt  DateTime?
  
  // Metadata
  assignedAt DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  @@id([userId, badgeId])
  @@index([userId, isEarned])
  @@index([badgeId])
  @@map("user_badges")
}
```

### New ActivityLog Model

```prisma
model ActivityLog {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  
  // Activity details
  activityType String  // "purchase" | "review" | "referral" | "donation" | "login" | "event"
  activityDate  DateTime @default(now()) // Date of activity (for streak calculation)
  
  // Related entities
  relatedId    String?  // Order ID, Review ID, etc.
  
  createdAt    DateTime @default(now())
  
  @@index([userId, activityDate])
  @@index([userId, activityType, activityDate])
  @@map("activity_logs")
}
```

### Updated Badge Model

```prisma
model Badge {
  id          String      @id @default(uuid())
  name        String      @unique
  description String
  icon        String      // MaterialIcons name
  iconUrl     String?     // Optional custom icon URL
  
  // Badge details
  category    String      // "purchases" | "social" | "community" | "achievement" | "education" | "milestone"
  rarity      String      // "common" | "rare" | "epic" | "legendary"
  
  // Requirements
  requirementType  String  // "purchase_count" | "review_count" | etc.
  requirementValue Int     // Required value
  requirementDescription String // Human-readable description
  
  // Rewards
  pointsReward Int         @default(0)
  
  // Visual
  color     String
  gradient  String[]        // Array of gradient colors
  
  // Status
  isActive  Boolean        @default(true)
  
  // Metadata
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
  
  users     UserBadge[]
  
  @@index([category])
  @@index([rarity])
  @@index([isActive])
  @@map("badges")
}
```

---

## API Endpoints

### Badge Endpoints

```
GET    /api/badges
  - List all badges
  - Query params: category, rarity, isActive
  - Response: Badge[]

GET    /api/badges/:badgeId
  - Get badge details
  - Response: Badge

GET    /api/users/:userId/badges
  - Get user's badges
  - Query params: category, isEarned
  - Response: UserBadge[]

GET    /api/users/:userId/badges/:badgeId
  - Get specific user badge
  - Response: UserBadge

GET    /api/users/:userId/badges/:badgeId/progress
  - Get badge progress details
  - Response: { progress: number, currentValue: number, requiredValue: number, isEarned: boolean }

POST   /api/users/:userId/badges/:badgeId/award
  - Award badge to user (internal/admin only)
  - Body: { awardedAt?: DateTime }
  - Response: UserBadge
```

### Activity Endpoints

```
GET    /api/users/:userId/activity/streak
  - Get current streak information
  - Response: { currentStreak: number, longestStreak: number, lastActivityDate: DateTime }

GET    /api/users/:userId/activity/logs
  - Get activity logs
  - Query params: startDate, endDate, activityType
  - Response: ActivityLog[]

POST   /api/users/:userId/activity/log
  - Log user activity (internal)
  - Body: { activityType: string, relatedId?: string }
  - Response: ActivityLog
```

### Challenge Endpoints (Future)

```
GET    /api/challenges
  - List active challenges
  - Response: Challenge[]

GET    /api/challenges/:challengeId
  - Get challenge details
  - Response: Challenge

GET    /api/users/:userId/challenges
  - Get user's challenge progress
  - Response: UserChallenge[]

POST   /api/users/:userId/challenges/:challengeId/join
  - Join a challenge
  - Response: UserChallenge
```

---

## Frontend Components

### New Components Needed

1. **BadgeProgressBar**
   - Visual progress indicator
   - Shows current/required values
   - Animated progress updates

2. **BadgeEarnedModal**
   - Celebration modal when badge earned
   - Shows badge details
   - Points awarded display
   - Share button

3. **StreakDisplay**
   - Current streak counter
   - Streak calendar
   - Streak maintenance tips

4. **BadgeCollectionCard**
   - Collection progress display
   - Badges in collection
   - Collection completion reward

5. **ChallengeCard**
   - Active challenge display
   - Progress tracking
   - Time remaining

6. **BadgeNotification**
   - Toast notification for badge earned
   - In-app notification badge
   - Notification center integration

### Updated Components

1. **BadgeIcon** (`components/BadgeIcon.tsx`)
   - ✅ Already exists
   - Add animation support
   - Add celebration state

2. **Badges Page** (`app/pages/myimpact/badges.tsx`)
   - Replace mock data with API calls
   - Add real-time progress updates
   - Add badge earned animations
   - Add sharing functionality

3. **My Impact Page** (`app/pages/myimpact/index.tsx`)
   - Add recent badges earned
   - Add streak display
   - Add challenge progress

---

## Testing Strategy

### Unit Tests

1. **BadgeProgressService**
   - Test progress calculation for each badge type
   - Test edge cases (0 progress, 100% progress)
   - Test cumulative vs. one-time badges

2. **BadgeAwardingService**
   - Test badge awarding logic
   - Test requirement evaluation
   - Test points awarding
   - Test duplicate badge prevention

3. **ActivityTrackingService**
   - Test streak calculation
   - Test streak break logic
   - Test activity logging

### Integration Tests

1. **Badge Awarding Flow**
   - Test purchase → badge check → award flow
   - Test review → badge check → award flow
   - Test referral → badge check → award flow

2. **API Endpoints**
   - Test badge CRUD operations
   - Test user badge retrieval
   - Test progress calculation endpoint

3. **Frontend Integration**
   - Test badge display updates
   - Test progress bar updates
   - Test notification display

### E2E Tests

1. **Badge Earning Flow**
   - User makes purchase → Badge earned → Notification shown
   - User writes review → Badge earned → Points awarded
   - User refers friend → Badge earned → Celebration shown

2. **Streak Flow**
   - User logs in daily → Streak increases → Streak badge earned
   - User misses day → Streak breaks → Streak resets

---

## Analytics & Tracking

### Key Metrics

1. **Badge Completion Rates**
   - % of users who earned each badge
   - Average time to earn badge
   - Badge completion funnel

2. **Engagement Metrics**
   - Badge page views
   - Badge sharing clicks
   - Badge collection completion rates

3. **Gamification Impact**
   - User retention by badge count
   - Activity increase after badge earned
   - Streak maintenance rates

4. **Badge Effectiveness**
   - Which badges drive most engagement
   - Badge rarity vs. completion rate
   - Points reward effectiveness

### Tracking Events

```typescript
// Badge events
badge.viewed({ badgeId, category })
badge.progress_updated({ badgeId, progress })
badge.earned({ badgeId, pointsAwarded })
badge.shared({ badgeId, platform })

// Streak events
streak.updated({ currentStreak, longestStreak })
streak.broken({ previousStreak })
streak.badge_earned({ badgeId, streakDays })

// Challenge events
challenge.viewed({ challengeId })
challenge.joined({ challengeId })
challenge.completed({ challengeId, reward })
```

---

## Success Metrics

### Phase 1 Success Criteria

- [ ] All badges trackable in database
- [ ] Badge progress visible in UI
- [ ] API endpoints functional
- [ ] No mock data in production

### Phase 2 Success Criteria

- [ ] Badges automatically awarded on actions
- [ ] 90%+ badge awarding accuracy
- [ ] <100ms badge check latency
- [ ] All badge types functional

### Phase 3 Success Criteria

- [ ] Streak tracking functional
- [ ] Streak badges awarded correctly
- [ ] 20%+ users maintain 7-day streak
- [ ] Streak UI components complete

### Phase 4 Success Criteria

- [ ] Badge notifications delivered
- [ ] Celebration animations working
- [ ] Badge sharing functional
- [ ] User satisfaction score >4.0/5.0

### Overall Success Metrics

- **Engagement:** 30%+ increase in daily active users
- **Retention:** 20%+ increase in 30-day retention
- **Badge Completion:** 50%+ users earn at least 5 badges
- **Streak Maintenance:** 25%+ users maintain weekly streaks
- **Social Sharing:** 10%+ badge share rate

---

## Risk Mitigation

### Technical Risks

1. **Performance Impact**
   - Risk: Badge checking slows down user actions
   - Mitigation: Async badge checking, caching, background jobs

2. **Data Consistency**
   - Risk: Badge progress out of sync
   - Mitigation: Event-driven updates, eventual consistency, reconciliation jobs

3. **Scalability**
   - Risk: Badge calculations don't scale
   - Mitigation: Indexed queries, materialized views, background processing

### Product Risks

1. **Gamification Fatigue**
   - Risk: Users get overwhelmed by badges
   - Mitigation: Limit notifications, allow opt-out, focus on quality over quantity

2. **Badge Inflation**
   - Risk: Too many badges devalue achievement
   - Mitigation: Maintain rarity distribution, limit new badges

3. **Unfair Advantage**
   - Risk: Power users dominate leaderboards
   - Mitigation: Multiple leaderboards, time-based competitions, categories

---

## Next Steps

### Immediate Actions (Week 1)

1. **Review & Approve Plan**
   - Stakeholder review
   - Technical review
   - Resource allocation

2. **Database Migration**
   - Create migration for schema updates
   - Migrate badge definitions to database
   - Set up indexes

3. **Backend Service Setup**
   - Create BadgeProgressService
   - Create BadgeAwardingService
   - Set up event listeners

4. **API Development**
   - Implement badge endpoints
   - Implement activity endpoints
   - Add authentication/authorization

### Short-term (Weeks 2-4)

1. **Frontend Integration**
   - Connect UI to API
   - Replace mock data
   - Add loading/error states

2. **Badge Awarding**
   - Integrate with purchase flow
   - Integrate with review flow
   - Integrate with referral flow

3. **Testing**
   - Unit tests
   - Integration tests
   - Manual testing

### Medium-term (Weeks 5-8)

1. **Streak Implementation**
   - Activity tracking
   - Streak calculation
   - Streak UI

2. **Notifications**
   - Push notifications
   - In-app notifications
   - Email notifications

3. **Celebrations**
   - Animation library
   - Celebration modals
   - Sharing features

---

## Appendix

### Badge Definitions Reference

See `types/badges.ts` for complete badge definitions.

### Related Documentation

- `action_plans/reward-levels-points-system.md` - Points system documentation
- `action_plans/database-design.md` - Database schema reference
- `types/impact.ts` - Impact types reference

### External Resources

- Gamification best practices
- Badge system design patterns
- Activity tracking implementations

---

**Last Updated:** 2026-01-27  
**Document Version:** 1.0  
**Owner:** Development Team  
**Reviewers:** Product Team, Engineering Team
