# BDN Reward Levels & Points System Documentation

**Date:** 2026-01-27  
**Purpose:** Comprehensive documentation of the reward levels/tiers and points system  
**Backend Reference:** C# backend (ImpactPoint.cs, TxnChargeHandler.cs, TxnGiftCardHandler.cs, TxnTokenHandler.cs)

---

## Table of Contents

1. [Overview](#overview)
2. [Reward Levels/Tiers](#reward-levelstiers)
3. [Points System](#points-system)
4. [How It Works](#how-it-works)
5. [Backend Implementation Details](#backend-implementation-details)
6. [Frontend Integration](#frontend-integration)

---

## Overview

The BDN platform uses a tiered membership system where users progress through levels by earning points through various activities. Points are awarded for consumer actions, transactions, referrals, and engagement activities. The system tracks both **points** (for level progression) and **impact/rewards** (monetary value earned through cashback and sponsorship rewards), which are separate but related metrics.

---

## Reward Levels/Tiers

The system has **6 membership levels** (defined in `UserLevel` enum):

### 1. Basic
- **Type:** Default level for new users
- **Requirement:** No points required (entry level)
- **Color:** `#8d8d8d` (gray)

### 2. Bronze
- **Type:** Purchasable lifetime membership
- **Requirement:** Can be purchased for **$4.99** (lifetime membership)
- **Points Threshold:** N/A (purchase-based, not points-based)
- **Special:** One-time bonus of 10 points awarded upon upgrade
- **Color:** `#cd7f32` (bronze)

### 3. Silver
- **Type:** Points-based level
- **Requirement:** **10,000 points**
- **Color:** `#c0c0c0` (silver)

### 4. Gold
- **Type:** Points-based level
- **Requirement:** **50,000 points**
- **Color:** `#ffd700` (gold)

### 5. Diamond
- **Type:** Points-based level
- **Requirement:** **500,000 points**
- **Color:** `#b9f2ff` (light blue/diamond)

### 6. Black Diamond
- **Type:** Highest tier
- **Requirement:** **5,000,000 points**
- **Color:** `#000000` (black)

### Future/Display Levels

**Note:** The following levels exist as constants in the code but are not currently in the `UserLevel` enum. They may be used for display purposes or future implementation:

- **Platinum:** 100,000 points
- **Blue Diamond:** 1,000,000 points

---

## Points System

Points are awarded for various activities (defined in `ImpactPoint.cs`). Each point award creates an `ImpactPoint` document with:
- User ID
- Points amount
- Type (e.g., "purchase", "feedback", "signup")
- Related ID (transaction/feedback ID)
- Timestamp

### Activity-Based Points

| Activity | Points | Description |
|----------|--------|-------------|
| **Consumer Signup** | 1 | When someone you invite signs up |
| **Survey** | 2 | Completing a survey |
| **Invitee's First Purchase** | 2 | When an invitee makes their first purchase |
| **Business Enrollment** | 3 | When an invited business joins the network |
| **Feedback** | 5 | Per feedback submitted |
| **BDNU Enrollment** | 5 | Enrolling in BDN University |
| **Bronze Elevate** | 10 | One-time bonus for upgrading to Bronze level |
| **Case Study** | 15 | Per answered question in case study |

### Transaction-Based Points

Transaction-based points are calculated as **1 point per BLKD spent**:

| Transaction Type | Points Formula | Backend Reference |
|------------------|----------------|-------------------|
| **Purchases** | 1 point per BLKD spent | `TxnChargeHandler.cs` (line 359) |
| **Gift Cards** | 1 point per BLKD purchased | `TxnGiftCardHandler.cs` (line 256) |
| **Token Purchases** | 1 point per BLKD spent | `TxnTokenHandler.cs` (line 182) |

---

## How It Works

### 1. Points Storage

Each point award creates an `ImpactPoint` document with:
- `userId`: The user who earned the points
- `points`: The amount of points awarded
- `type`: The activity type (e.g., "purchase", "feedback", "signup")
- `relatedId`: Related transaction/feedback ID (if applicable)
- `timestamp`: When the points were awarded

### 2. Aggregation

The `Index_ImpactByUser` map-reduce index aggregates:
- **Total points** per user
- **Total impact/rewards** earned (monetary value)
- **Cashback received**
- **Donations made**
- **Signups generated**
- **Feedback completed/pending**

This aggregated data is used for:
- Displaying user progress
- Calculating level progression
- Leaderboard rankings
- Reward calculations

### 3. Level Progression

#### Bronze Level
- **Purchase-based:** Users can purchase Bronze membership for $4.99 (lifetime)
- **One-time bonus:** 10 points awarded upon upgrade
- **Not points-based:** Bronze is not earned through points accumulation

#### Higher Levels (Silver, Gold, Diamond, Black Diamond)
- **Points-based:** Levels are automatically assigned based on total points accumulated
- **Automatic progression:** When a user's total points reach the threshold, they automatically progress to the next level
- **UI Display:** The `ImpactHome.cs` UI calculates and displays progress toward the next level

### 4. Rewards Display

The `RewardsLanding` page displays:
- **Current membership level:** User's current tier
- **Total points accumulated:** Lifetime points earned
- **Lifetime rewards (impact):** Monetary value earned through cashback and sponsorship rewards
- **Progress toward next level:** Visual progress bar showing points needed for next tier

### 5. Points vs. Impact/Rewards

The system tracks two separate but related metrics:

- **Points:** Used for level progression and tier advancement
- **Impact/Rewards:** Monetary value earned through:
  - Cashback from purchases
  - Sponsorship rewards from referrals
  - Other monetary rewards

These metrics are tracked separately but displayed together to show both progression and financial impact.

---

## Backend Implementation Details

### ImpactPoint Document Structure

```csharp
public class ImpactPoint
{
    public string Id { get; set; }
    public string UserId { get; set; }
    public int Points { get; set; }
    public string Type { get; set; } // "purchase", "feedback", "signup", etc.
    public string RelatedId { get; set; } // Transaction/feedback ID
    public DateTime Timestamp { get; set; }
}
```

### Transaction Handlers

#### TxnChargeHandler.cs (Line 359)
- Awards 1 point per BLKD spent on purchases
- Creates `ImpactPoint` document with type "purchase"
- Links to transaction ID via `RelatedId`

#### TxnGiftCardHandler.cs (Line 256)
- Awards 1 point per BLKD purchased for gift cards
- Creates `ImpactPoint` document with type "gift_card"
- Links to transaction ID via `RelatedId`

#### TxnTokenHandler.cs (Line 182)
- Awards 1 point per BLKD spent on token purchases
- Creates `ImpactPoint` document with type "token_purchase"
- Links to transaction ID via `RelatedId`

### Index_ImpactByUser Map-Reduce Index

This index aggregates impact data per user:

**Map Function:**
- Groups all `ImpactPoint` documents by `userId`
- Groups all cashback transactions by `userId`
- Groups all donations by `userId`

**Reduce Function:**
- Calculates total points per user
- Calculates total impact/rewards (monetary value)
- Calculates total cashback received
- Calculates total donations made
- Counts signups generated
- Counts feedback completed/pending

**Output Structure:**
```csharp
public class UserImpactAggregate
{
    public string UserId { get; set; }
    public int TotalPoints { get; set; }
    public decimal TotalImpact { get; set; }
    public decimal TotalCashback { get; set; }
    public decimal TotalDonations { get; set; }
    public int SignupsGenerated { get; set; }
    public int FeedbackCompleted { get; set; }
    public int FeedbackPending { get; set; }
}
```

---

## Frontend Integration

### Current Frontend Implementation

The frontend currently uses different point thresholds (stored in `data/mock.ts` and `app/pages/myimpact/index.tsx`):

```typescript
export const USER_LEVELS = {
  Basic: { color: "#8d8d8d", minPoints: 0 },
  Bronze: { color: "#cd7f32", minPoints: 1000 },      // ⚠️ Different from backend
  Silver: { color: "#c0c0c0", minPoints: 5000 },      // ⚠️ Different from backend
  Gold: { color: "#ffd700", minPoints: 15000 },       // ⚠️ Different from backend
  Diamond: { color: "#b9f2ff", minPoints: 50000 },    // ⚠️ Different from backend
  "Black Diamond": { color: "#000000", minPoints: 100000 }, // ⚠️ Different from backend
};
```

### Discrepancies to Address

**Backend vs. Frontend Point Thresholds:**

| Level | Backend Threshold | Frontend Threshold | Status |
|-------|-------------------|-------------------|--------|
| Bronze | $4.99 purchase (not points-based) | 1,000 points | ⚠️ **Mismatch** |
| Silver | 10,000 points | 5,000 points | ⚠️ **Mismatch** |
| Gold | 50,000 points | 15,000 points | ⚠️ **Mismatch** |
| Diamond | 500,000 points | 50,000 points | ⚠️ **Mismatch** |
| Black Diamond | 5,000,000 points | 100,000 points | ⚠️ **Mismatch** |

### Frontend Type Definitions

The frontend `ImpactPoint` interface (`types/impact.ts`):

```typescript
export interface ImpactPoint {
  id: string;
  userId: string;
  points: number;
  source:
    | "purchase"
    | "referral"
    | "feedback"
    | "donation"
    | "earnings"
    | "achievement";
  description: string;
  relatedTransactionId?: string;
  relatedUserId?: string; // For referrals/earnings
  createdAt: string;
}
```

**Note:** The frontend `source` field uses different values than the backend `type` field. Consider aligning these for consistency.

### Recommended Frontend Updates

1. **Update Point Thresholds:**
   - Update `USER_LEVELS` constants to match backend thresholds
   - Update badge definitions in `types/badges.ts`
   - Update level calculation logic in `app/pages/myimpact/index.tsx`

2. **Implement Bronze Purchase Flow:**
   - Add UI for purchasing Bronze membership ($4.99 lifetime)
   - Handle Bronze upgrade and 10-point bonus
   - Update level assignment logic to handle purchase-based Bronze

3. **Add Missing Point Sources:**
   - Add "survey" source type
   - Add "bdnu_enrollment" source type
   - Add "case_study" source type
   - Add "bronze_elevate" source type
   - Add "business_enrollment" source type
   - Add "invitee_first_purchase" source type

4. **Add Future Levels:**
   - Consider adding Platinum (100,000 points) to enum
   - Consider adding Blue Diamond (1,000,000 points) to enum
   - Update UI to display these levels if implemented

---

## Summary

### Key Points

1. **6 Membership Levels:** Basic, Bronze (purchase-based), Silver, Gold, Diamond, Black Diamond
2. **Points System:** Activity-based and transaction-based point awards
3. **Bronze Special:** Purchasable for $4.99 (lifetime), not points-based
4. **Transaction Points:** 1 point per BLKD spent on purchases, gift cards, and token purchases
5. **Aggregation:** Map-reduce index aggregates user impact data
6. **Dual Metrics:** Points (progression) and Impact/Rewards (monetary value) tracked separately

### Action Items

- [ ] Align frontend point thresholds with backend specifications
- [ ] Implement Bronze purchase flow ($4.99 lifetime membership)
- [ ] Add missing point source types to frontend
- [ ] Update level calculation logic to handle purchase-based Bronze
- [ ] Consider adding Platinum and Blue Diamond levels to enum
- [ ] Align frontend `source` field values with backend `type` field values

---

**Last Updated:** 2026-01-27  
**Document Version:** 1.0
