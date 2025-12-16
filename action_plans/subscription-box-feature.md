# Subscription Box Recurring Feature

## Overview

The Subscription Box feature allows businesses with BDN+ Business subscriptions to offer recurring shipments with automated billing for physical products. This is a premium feature that enables merchants to build recurring revenue streams and provides customers with convenient automatic deliveries.

## Requirements

### Business Requirements
- **BDN+ Business Subscription**: Only merchants with an active BDN+ Business subscription can offer subscription boxes
- **Physical Products Only**: Subscription boxes are only available for physical products that require shipping
- **Automated Billing**: Customers are automatically charged on each billing cycle
- **Flexible Scheduling**: Support for multiple delivery frequencies and durations

### Customer Requirements
- **Payment Method Required**: Customers must have a valid payment method on file
- **BDN+ Benefits**: BDN+ subscribers get 0% service fees on subscription box orders
- **Manage Subscriptions**: Customers can pause, cancel, or modify their subscriptions

## Features

### Subscription Frequencies
- **Weekly**: Every 7 days
- **Bi-weekly**: Every 14 days
- **Monthly**: Every 30 days
- **Bi-monthly**: Every 60 days
- **Quarterly**: Every 90 days

### Subscription Durations
- **Fixed Duration**: 4, 8, 12, or 24 shipments
- **Ongoing**: Indefinite subscription until cancelled

### Pricing & Discounts
- Merchants can offer discounts (e.g., 5% off) for subscription purchases
- Service fees apply per shipment (0% for BDN+ subscribers)
- Shipping costs are calculated per shipment

## Implementation

### Type Definitions

**`types/subscription-box.ts`**
- `SubscriptionBoxPlan`: Plan configuration for a product
- `SubscriptionBox`: Active customer subscription
- `SubscriptionBoxShipment`: Individual shipment record
- `SubscriptionBoxOrder`: Order created for each shipment

### Components

**`components/subscription/SubscriptionBoxSelector.tsx`**
- UI component for selecting subscription frequency and duration
- Displays pricing breakdown per shipment
- Shows savings with BDN+ subscription

### Utilities

**`lib/subscription-box.ts`**
- `checkMerchantHasBDNPlusBusiness()`: Verify merchant eligibility
- `createSubscriptionBoxPlan()`: Create a subscription plan for a product
- `calculateSubscriptionBoxPricing()`: Calculate pricing per shipment
- `createSubscriptionBox()`: Create a new customer subscription
- `processNextShipment()`: Process billing and create next shipment

### Integration Points

**Product Detail Page (`app/pages/products/[id].tsx`)**
- Shows subscription box selector for eligible products
- Displays "Subscribe & Save" option
- Only visible for physical products from BDN+ Business merchants

## User Flow

### For Customers

1. **Browse Product**: Customer views a physical product from a BDN+ Business merchant
2. **Select Subscription**: Customer sees subscription box option and selects frequency/duration
3. **Review Pricing**: Customer sees per-shipment pricing breakdown
4. **Subscribe**: Customer clicks "Subscribe & Save" and completes checkout
5. **Automatic Deliveries**: System automatically processes shipments and billing on schedule
6. **Manage Subscription**: Customer can pause, cancel, or modify subscription from account page

### For Merchants

1. **BDN+ Business**: Merchant must have active BDN+ Business subscription
2. **Enable Subscription**: Merchant can enable subscription boxes for physical products
3. **Set Discount**: Merchant can optionally set discount percentage for subscriptions
4. **Manage Subscriptions**: Merchant can view all active subscriptions and shipments

## Billing & Payment Processing

### Automatic Billing
- System charges customer's payment method on each billing cycle
- Billing date matches shipment date
- Service fees are calculated per shipment (0% for BDN+ subscribers)
- Platform fees (5% for BDN+ Business, 10% for others) are deducted from merchant payments

### Order Creation
- Each shipment creates a new order
- Orders are linked to the subscription box
- Transaction records are created for each payment
- Shipment tracking is managed per shipment

## Future Enhancements

1. **Subscription Management Page**: Dedicated page for customers to manage all subscriptions
2. **Merchant Dashboard**: View subscription analytics and manage subscription plans
3. **Skip Shipment**: Allow customers to skip individual shipments
4. **Modify Subscription**: Allow customers to change frequency or quantity
5. **Gift Subscriptions**: Allow customers to gift subscriptions to others
6. **Subscription Variants**: Support for subscription boxes with multiple products
7. **Email Notifications**: Notify customers before each shipment and billing
8. **Subscription Analytics**: Track subscription metrics for merchants

## Technical Notes

### Mock Data
Currently using mock data for:
- Merchant BDN+ Business subscription status
- User BDN+ subscription status
- Payment method validation

### TODO Items
- [ ] Integrate with actual subscription service
- [ ] Implement subscription checkout page
- [ ] Create subscription management page
- [ ] Add email notifications
- [ ] Implement automated billing cron job
- [ ] Add subscription analytics
- [ ] Create merchant subscription management UI

