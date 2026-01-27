# Wallet System with Black Dollars (BLKD) Architecture

**Date:** 2025-01-27  
**Purpose:** Comprehensive documentation of the BLKD wallet system architecture, including redeemable and non-redeemable wallet structure  
**Status:** Architecture Specification

---

## Table of Contents

1. [Overview](#overview)
2. [Wallet Structure](#wallet-structure)
3. [Redeemable vs Non-Redeemable Determination](#redeemable-vs-non-redeemable-determination)
4. [Balance Calculation](#balance-calculation)
5. [Transaction Flows](#transaction-flows)
6. [Key Distinctions](#key-distinctions)
7. [Implementation Considerations](#implementation-considerations)

---

## Overview

BLKD (Black Dollars) is the digital currency used within the BDN platform. Wallets use the currency code "BLKD" and are separate from USD wallets (BankAccount/CreditCard).

### Core Principles

- **BLKD is a proprietary digital currency** - Internal to the BDN platform
- **Separate from USD wallets** - BLKD wallets are distinct entities from bank accounts and credit cards
- **Dual-wallet structure** - Primary and Merchant wallets have two sub-wallets:
  - Redeemable Wallet (`WalletType.BdnRedeemable`)
  - Non-Redeemable Wallet (`WalletType.BdnNonredeemable`)
- **Separate wallet entities** - Sub-wallets are linked via `RedeemableWallet` and `NonRedeemableWallet` properties

---

## Wallet Structure

### Primary and Merchant Wallets

Primary and Merchant wallets have two sub-wallets:

1. **RedeemableWallet** (`WalletType.BdnRedeemable`)
   - Can be converted back to USD
   - Funds from bank account conversions
   - Subject to redemption fees and minimums

2. **NonRedeemableWallet** (`WalletType.BdnNonredeemable`)
   - Cannot be converted back to USD
   - Funds from credit card conversions and cashback
   - Used first when making purchases

### Wallet Relationships

```
Primary/Merchant Wallet
├── RedeemableWallet (separate entity)
│   └── Linked via RedeemableWallet property
└── NonRedeemableWallet (separate entity)
    └── Linked via NonRedeemableWallet property
```

**Important:** These are separate wallet entities, not just balance fields. They are linked via properties on the parent wallet.

---

## Redeemable vs Non-Redeemable Determination

### 1. When Converting USD to BLKD (Exchange In)

**Location:** `ExchangeController.ProcessExchangeIn()` (lines 142-216)

#### Credit Card → Non-Redeemable

- **Destination:** `target.NonRedeemableWallet`
- **Code Pattern:**
  ```csharp
  targetTransfer = await DAL.Session.LoadAsync<Wallet>(target.NonRedeemableWallet);
  ```
- **Rationale:** Credit card funds cannot be redeemed back to USD

#### Bank Account → Redeemable

- **Destination:** `target.RedeemableWallet`
- **Code Pattern:**
  ```csharp
  targetTransfer = await DAL.Session.LoadAsync<Wallet>(target.RedeemableWallet);
  ```
- **Rationale:** Bank account funds can be redeemed back to USD

**Key Rule:** The source of the USD conversion determines which sub-wallet receives the BLKD:
- Credit Card → Non-Redeemable
- Bank Account → Redeemable

---

### 2. When Making Purchases

**Location:** `TxnBaseHandler.TransferFromWalletsToWallet()` (lines 21-54)

#### Spending Order

Funds are spent from wallets in this priority order:

1. **Gift cards** (if applicable)
2. **Non-redeemable wallet** (first priority)
3. **Redeemable wallet** (second priority)
4. **USD backup wallet** (if needed)

#### Merchant Receipt

- **All merchant payments** go to the merchant's `RedeemableWallet`
- **Code Pattern:**
  ```csharp
  if(destination.RedeemableWallet != null)
      destWallet = destination.RedeemableWallet;
  ```
- **Rationale:** Merchants receive funds in their redeemable wallet, allowing them to cash out

**Key Rule:** When spending, non-redeemable funds are used first, then redeemable funds. Merchants always receive funds in their redeemable wallet.

---

### 3. Cashback

**Location:** `TxnChargeHandler.GenerateLines()` (lines 526-552)

#### Cashback Destination

- **Destination:** User's `NonRedeemableWallet`
- **Includes:**
  - Merchant promotions
  - Product-specific cashback
  - Platform rewards

**Key Rule:** All cashback goes to the non-redeemable wallet, incentivizing continued platform usage.

---

### 4. When Redeeming BLKD to USD (Exchange Out)

**Location:** `TxnExchangeHandler.Process()` (lines 54-67)

#### Redemption Rules

- **Source:** Only `RedeemableWallet` funds can be redeemed
- **Validation:**
  ```csharp
  amount > redeemBal  // where redeemBal comes from source.RedeemableWallet
  ```
- **Minimum Redemption:** $50 (5000 cents)
- **Fee:** 5% fee applied
  ```csharp
  feeAmount = Math.Floor(amount * 5) / 100m
  ```

#### Redemption Process

1. Check redeemable balance
2. Validate minimum amount ($50)
3. Calculate 5% fee
4. Process redemption to USD
5. Update redeemable wallet balance

**Key Rule:** Only redeemable funds can be converted back to USD, with a 5% fee and $50 minimum.

---

## Balance Calculation

**Location:** `Wallet.GetBalance()` (lines 237-258)

### Primary/Merchant Wallets

For Primary and Merchant wallets, the balance is the **sum of both sub-wallets**:

```csharp
return (amount1?.Amount ?? 0) + (amount2?.Amount ?? 0);
```

Where:
- `amount1` = Balance from `RedeemableWallet`
- `amount2` = Balance from `NonRedeemableWallet`

### Individual Sub-Wallets

Individual sub-wallets show their own balances separately:
- Redeemable balance: Available for redemption
- Non-redeemable balance: Available for purchases only

**Key Rule:** Display balances combine both sub-wallets, but individual balances are tracked separately for redemption purposes.

---

## Transaction Flows

### Exchange In Flow (USD → BLKD)

```
User initiates exchange
    ↓
Check payment method:
    ├── Credit Card → NonRedeemableWallet
    └── Bank Account → RedeemableWallet
    ↓
Process USD payment
    ↓
Credit BLKD to appropriate sub-wallet
    ↓
Update wallet balances
```

### Purchase Flow (BLKD → Payment)

```
User initiates purchase
    ↓
Calculate total amount needed
    ↓
Spend from wallets in order:
    1. Gift cards (if applicable)
    2. NonRedeemableWallet
    3. RedeemableWallet
    4. USD backup (if needed)
    ↓
Transfer to merchant's RedeemableWallet
    ↓
Process cashback to user's NonRedeemableWallet
    ↓
Update all wallet balances
```

### Exchange Out Flow (BLKD → USD)

```
User initiates redemption
    ↓
Validate:
    - Amount > $50 minimum
    - Sufficient redeemable balance
    ↓
Calculate 5% fee
    ↓
Deduct from RedeemableWallet
    ↓
Process USD transfer to bank account
    ↓
Update wallet balances
```

### Cashback Flow

```
Transaction completes
    ↓
Calculate cashback amount
    ↓
Credit to user's NonRedeemableWallet
    ↓
Update wallet balance
```

---

## Key Distinctions

| Aspect | Redeemable | Non-Redeemable |
|--------|------------|----------------|
| **Source** | Bank account conversions | Credit card conversions, cashback |
| **Can Redeem?** | Yes (5% fee, $50 minimum) | No |
| **Used for Purchases** | Yes (after non-redeemable) | Yes (first priority) |
| **Merchant Receives** | Always goes to merchant's redeemable | N/A |
| **Cashback Destination** | N/A | Always goes here |
| **Redemption Fee** | 5% | N/A (cannot redeem) |
| **Minimum Redemption** | $50 | N/A (cannot redeem) |

---

## Summary

### Redeemable Wallet

- **Source:** Funds from bank account conversions
- **Can Redeem:** Yes, with 5% fee and $50 minimum
- **Usage:** Used for purchases after non-redeemable funds are exhausted
- **Merchant Receipt:** Merchants always receive payments in their redeemable wallet

### Non-Redeemable Wallet

- **Source:** Funds from credit card conversions and cashback
- **Can Redeem:** No, cannot be converted back to USD
- **Usage:** Used first when making purchases (priority spending)
- **Cashback:** All cashback goes to non-redeemable wallet

### System Behavior

- **Balance Display:** Primary/Merchant wallets show combined balance of both sub-wallets
- **Spending Priority:** Non-redeemable → Redeemable → USD backup
- **Redemption:** Only redeemable funds can be converted back to USD
- **Tracking:** Sub-wallets are separate entities linked via properties

---

## Implementation Considerations

### Database Schema

The wallet system requires:

1. **Primary/Merchant Wallet Table**
   - `id` (primary key)
   - `userId` (foreign key)
   - `redeemableWalletId` (foreign key to RedeemableWallet)
   - `nonRedeemableWalletId` (foreign key to NonRedeemableWallet)
   - `currency` ("BLKD")
   - `type` ("primary" | "merchant")

2. **RedeemableWallet Table**
   - `id` (primary key)
   - `userId` (foreign key)
   - `balance` (decimal)
   - `currency` ("BLKD")
   - `type` ("BdnRedeemable")

3. **NonRedeemableWallet Table**
   - `id` (primary key)
   - `userId` (foreign key)
   - `balance` (decimal)
   - `currency` ("BLKD")
   - `type` ("BdnNonredeemable")

### API Endpoints

Required endpoints:

- `GET /api/wallets/{walletId}/balance` - Get combined balance
- `GET /api/wallets/{walletId}/redeemable-balance` - Get redeemable balance
- `GET /api/wallets/{walletId}/nonredeemable-balance` - Get non-redeemable balance
- `POST /api/exchange/in` - Convert USD to BLKD (route to appropriate sub-wallet)
- `POST /api/exchange/out` - Redeem BLKD to USD (from redeemable only)
- `POST /api/transactions/purchase` - Process purchase (spend from both wallets in order)

### Frontend Considerations

1. **Balance Display**
   - Show combined balance for Primary/Merchant wallets
   - Optionally show breakdown (redeemable vs non-redeemable)
   - Indicate which funds are redeemable

2. **Purchase Flow**
   - Automatically use non-redeemable funds first
   - Show breakdown of which wallet funds are being used
   - Handle partial payments across wallets

3. **Redemption Flow**
   - Only show redeemable balance for redemption
   - Enforce $50 minimum
   - Show 5% fee calculation
   - Validate sufficient redeemable balance

4. **Exchange In Flow**
   - Route to appropriate sub-wallet based on payment method
   - Credit Card → Non-Redeemable
   - Bank Account → Redeemable

### Business Logic Rules

1. **Exchange In Routing**
   - Credit Card payments → `NonRedeemableWallet`
   - Bank Account payments → `RedeemableWallet`

2. **Purchase Spending Order**
   - Gift cards (if applicable)
   - Non-redeemable wallet
   - Redeemable wallet
   - USD backup wallet

3. **Merchant Receipt**
   - All merchant payments → Merchant's `RedeemableWallet`

4. **Cashback**
   - All cashback → User's `NonRedeemableWallet`

5. **Redemption**
   - Only from `RedeemableWallet`
   - Minimum $50
   - 5% fee

### Error Handling

- Insufficient balance: Check both sub-wallets before failing
- Redemption validation: Ensure redeemable balance >= amount + fee
- Minimum redemption: Enforce $50 minimum with clear error message
- Payment method routing: Validate payment method type before routing to sub-wallet

### Testing Scenarios

1. **Exchange In**
   - Credit card conversion → Non-redeemable wallet
   - Bank account conversion → Redeemable wallet

2. **Purchase**
   - Purchase using non-redeemable funds
   - Purchase using redeemable funds
   - Purchase using both wallets (partial from each)
   - Merchant receives funds in redeemable wallet

3. **Cashback**
   - Cashback credits to non-redeemable wallet
   - Balance updates correctly

4. **Redemption**
   - Redeem from redeemable wallet (success)
   - Attempt to redeem from non-redeemable wallet (fail)
   - Redeem below $50 minimum (fail)
   - Redeem with insufficient balance (fail)
   - Fee calculation correct (5%)

5. **Balance Calculation**
   - Combined balance = redeemable + non-redeemable
   - Individual balances display correctly

---

## Related Documentation

- [Database Design](./database-design.md) - Overall database schema
- [Security Compliance Strategy](./security-compliance-strategy.md) - PCI compliance considerations
- [BDN 2.0 Comprehensive Technical Plan](./bdn-2.0-comprehensive-technical-plan.md) - Overall system architecture
- [Fee Structure](./fee-structure.md) - Fee calculation details

---

**Last Updated:** 2025-01-27  
**Version:** 1.0  
**Status:** Architecture Specification
