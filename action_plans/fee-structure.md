# BDN Platform Fee Structure

## Overview

The BDN platform implements a fee structure to support platform operations and provide tools and resources to users, businesses, and nonprofits. Fees can be reduced or eliminated with BDN+ subscriptions.

## Consumer Service Fees

### Standard Fee Structure
- **Fee Rate**: 10% of order amount
- **Minimum**: $1.00 USD (or equivalent in other currencies)
- **Maximum**: $14.99 USD (or equivalent in other currencies)
- **Applied To**: All consumer orders (payments to businesses, event tickets, donations, etc.)

### BDN+ Subscription Benefit
- **Fee Reduction**: 0% service fee (100% reduction)
- **Requirement**: Active BDN+ subscription
- **Benefit**: Complete elimination of service fees on all orders

### Examples

**Without BDN+**:
- Order: $50.00 → Service Fee: $5.00 → Total: $55.00
- Order: $5.00 → Service Fee: $1.00 (minimum) → Total: $6.00
- Order: $200.00 → Service Fee: $14.99 (maximum) → Total: $214.99

**With BDN+**:
- Order: $50.00 → Service Fee: $0.00 → Total: $50.00
- Order: $5.00 → Service Fee: $0.00 → Total: $5.00
- Order: $200.00 → Service Fee: $0.00 → Total: $200.00

## Business/Nonprofit Platform Fees

### Standard Fee Structure
- **Fee Rate**: 10% of payment amount
- **Fee Type**: Post-advertising fee (applied upon payment completion)
- **Applied To**: All payments received by businesses and nonprofits
- **Timing**: Automatically calculated and deducted when payment is completed

### BDN+ Business Subscription Benefit
- **Fee Reduction**: 5% platform fee (50% reduction)
- **Requirement**: Active BDN+ Business subscription
- **Benefit**: Reduced platform fees from 10% to 5%

### Examples

**Without BDN+ Business**:
- Payment Received: $100.00 → Platform Fee: $10.00 → Net Amount: $90.00
- Payment Received: $50.00 → Platform Fee: $5.00 → Net Amount: $45.00

**With BDN+ Business**:
- Payment Received: $100.00 → Platform Fee: $5.00 → Net Amount: $95.00
- Payment Received: $50.00 → Platform Fee: $2.50 → Net Amount: $47.50

## Fee Calculation Flow

### Consumer Payment Flow
1. User enters payment amount
2. System checks for BDN+ subscription
3. Calculates service fee (10% with min/max, or 0% with BDN+)
4. Displays total amount including service fee
5. User confirms payment
6. Service fee is included in total charge
7. Payment amount (without service fee) is sent to business/nonprofit

### Business/Nonprofit Payment Receipt Flow
1. Payment is received from consumer
2. System checks for BDN+ Business subscription
3. Calculates platform fee (10% or 5% with BDN+ Business)
4. Platform fee is automatically deducted
5. Net amount is credited to business/nonprofit account
6. Transaction records show gross amount, platform fee, and net amount

## Implementation Details

### Fee Calculation Utilities
- **Location**: `lib/fees.ts`
- **Functions**:
  - `calculateConsumerServiceFee()` - Calculates consumer service fee
  - `calculateBusinessFee()` - Calculates business/nonprofit platform fee
  - `calculateConsumerTotalWithFee()` - Gets total with service fee
  - `calculateBusinessNetAmount()` - Gets net amount after platform fee

### Payment Processing
- **Location**: `lib/payment-processing.ts`
- **Functions**:
  - `processBusinessPayment()` - Processes payment with automatic fee deduction
  - `getPlatformFeeBreakdown()` - Gets fee breakdown for display

### Transaction Records
- All transactions include fee breakdown:
  - `fee` - Fee amount
  - `feeType` - Type of fee (service/platform/processing)
  - `feePercentage` - Fee percentage applied
  - `grossAmount` - Original amount (for business transactions)
  - `platformFee` - Platform fee amount (for business transactions)
  - `netAmount` - Amount after fees
  - `metadata.hasBDNPlus` - Whether user had BDN+ at transaction time
  - `metadata.hasBDNPlusBusiness` - Whether business had BDN+ Business at transaction time

## Subscription Tiers

### BDN+ (Consumer)
- **Price**: $9.99/month or $99.99/year
- **Fee Benefit**: 0% service fees on all orders
- **Other Benefits**: Advanced analytics, priority support, enhanced cashback, exclusive events, ad-free experience

### BDN+ Business
- **Price**: $29.99/month or $299.99/year
- **Fee Benefit**: 5% platform fees (instead of 10%)
- **Other Benefits**: All BDN+ features plus business analytics, marketing tools, API access, custom integrations

## Currency Support

Fees are calculated in the transaction currency. Min/max constraints are applied in USD equivalent for non-USD currencies:
- Minimum fee: $1.00 USD equivalent
- Maximum fee: $14.99 USD equivalent

## Display Requirements

### Consumer Payment UI
- Show payment amount
- Show service fee (with BDN+ badge if applicable)
- Show total amount
- Display BDN+ benefit message if fee is waived

### Business/Nonprofit Dashboard
- Show gross revenue
- Show platform fees deducted
- Show net revenue
- Display BDN+ Business benefit if applicable
- Show fee percentage in transaction details

## Future Enhancements

1. **Fee Analytics**: Track fee revenue and subscription impact
2. **Fee Reports**: Detailed fee breakdown reports for businesses
3. **Fee History**: Historical fee rates and changes
4. **Custom Fee Structures**: Enterprise-level custom fee arrangements
5. **Fee Refunds**: Handle fee refunds for cancelled/refunded transactions

