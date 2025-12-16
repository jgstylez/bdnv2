# Internationalization Implementation Plan

## Overview

This document outlines the internationalization (i18n) support implemented for the BDN 2.0 platform to accommodate users and businesses from around the world, while maintaining backward compatibility with existing U.S.-focused functionality.

## Key Changes

### 1. New Type Definitions (`types/international.ts`)

Created comprehensive international support types:

- **CountryCode**: ISO 3166-1 alpha-2 country codes (US, CA, GB, AU, ZA, NG, JM, BR, MX, etc.)
- **InternationalAddress**: Standardized address format supporting:
  - `postalCode` (replaces `zipCode` for international compatibility)
  - Optional `state` field (not all countries have states/provinces)
  - `country` as ISO country code
- **InternationalPhoneNumber**: Phone number with country code support
- **Currency**: Extended beyond USD/BLKD to support 30+ international currencies
- **TaxIdType**: Support for various tax ID formats (EIN, VAT, GST, CNPJ, RFC, etc.)
- **TaxIdentification**: Structured tax ID information
- **InternationalIncorporation**: Business incorporation info supporting international formats

### 2. International Utilities (`lib/international.ts`)

Helper functions for:
- Address conversion (legacy ↔ international formats)
- Phone number formatting (E.164 and display formats)
- Postal code validation (country-specific patterns)
- Phone number validation (country-specific patterns)
- Currency formatting and symbol display
- Tax ID validation by type and country
- Country-specific field labels (state/province, postal code)

### 3. Updated Type Definitions

#### Merchant (`types/merchant.ts`)
- Added `address?: InternationalAddress`
- Added `phoneCountryCode?: CountryCode`
- Added `incorporation?: InternationalIncorporation`
- Added `taxIdentification?: TaxIdentification`
- Legacy fields marked as `@deprecated` but maintained for backward compatibility

#### Organization (`types/nonprofit.ts`)
- Updated `address` to use `InternationalAddress`
- Added `phoneCountryCode?: CountryCode`
- Added `taxIdentification?: TaxIdentification`
- Updated currency types to use extended `Currency` type

#### Transactions (`types/transactions.ts`)
- Updated `currency` to use extended `Currency` type

#### Wallet (`types/wallet.ts`)
- Updated to import `Currency` from international types

#### Events (`types/events.ts`)
- Updated `venue` to use `InternationalAddress`
- Updated currency types to use extended `Currency` type

#### Search (`types/search.ts`)
- Updated location metadata to use `InternationalAddress`
- Updated currency to use extended `Currency` type

#### Invoices (`types/invoices.ts`)
- Updated `recipientAddress` to use `InternationalAddress`
- Updated currency types to use extended `Currency` type

### 4. Document Parser Updates (`lib/documentParser.ts`)

- Updated `ParsedBusinessInfo` to support international tax IDs
- Added support for international incorporation documents
- Added international address parsing
- Updated recommended documents list to include international document types

## Supported Countries (Initial)

The platform now supports the following countries with specific validation rules:

- **North America**: US, CA, MX
- **Caribbean**: JM, TT, BB, BS, AG, GD, LC, VC, DM, KN, BZ, GY, SR
- **Europe**: GB, FR, DE, IT, ES, NL, BE, PT
- **Africa**: ZA, NG, KE, GH
- **Oceania**: AU, NZ
- **South America**: BR, AR, CL, CO, PE
- **Asia**: JP, CN, IN, SG
- **Middle East**: AE, SA

## Implementation Guidelines

### For Developers

1. **Address Fields**: Use `InternationalAddress` type instead of separate fields
2. **Phone Numbers**: Store with country code, use utilities for formatting
3. **Currency**: Use the extended `Currency` type, not hardcoded "USD" | "BLKD"
4. **Tax IDs**: Use `TaxIdentification` type with appropriate `TaxIdType`
5. **Validation**: Use country-specific validation functions from `lib/international.ts`

### Backward Compatibility

All legacy fields are maintained with `@deprecated` tags:
- `zipCode` → `address.postalCode`
- `state` → `address.state` (optional)
- `ein` → `taxIdentification`
- Hardcoded currency strings → `Currency` type

### Migration Path

1. **Phase 1** (Current): Types and utilities in place, backward compatible
2. **Phase 2** (Future): Update forms to use international components
3. **Phase 3** (Future): Migrate existing data to international format
4. **Phase 4** (Future): Remove deprecated fields

## Next Steps

### Immediate (Form Updates)
- [ ] Create reusable `InternationalAddressForm` component
- [ ] Create reusable `InternationalPhoneInput` component
- [ ] Create reusable `CountrySelector` component
- [ ] Update merchant onboarding forms
- [ ] Update nonprofit onboarding forms
- [ ] Update user profile forms

### Short-term (Validation & UX)
- [ ] Add country-specific postal code validation in forms
- [ ] Add country-specific phone number formatting in forms
- [ ] Add conditional state/province field based on country selection
- [ ] Add currency selection for businesses
- [ ] Add tax ID type selection based on country

### Medium-term (Data & Features)
- [ ] Implement currency conversion for transactions
- [ ] Add multi-currency wallet support
- [ ] Implement international payment processing
- [ ] Add international shipping address support for products
- [ ] Add timezone support for events

### Long-term (Localization)
- [ ] Add i18n library (react-i18next or similar)
- [ ] Translate UI strings
- [ ] Add date/time formatting by locale
- [ ] Add number formatting by locale

## Testing Considerations

1. **Address Validation**: Test with various country formats
2. **Phone Numbers**: Test with different country codes and formats
3. **Currency**: Test currency formatting and conversion
4. **Tax IDs**: Test validation for different tax ID types
5. **Forms**: Test conditional field display based on country
6. **Backward Compatibility**: Ensure existing U.S. data still works

## Resources

- ISO 3166-1 Country Codes: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
- ISO 4217 Currency Codes: https://en.wikipedia.org/wiki/ISO_4217
- E.164 Phone Number Format: https://en.wikipedia.org/wiki/E.164
- International Address Formats: https://www.upu.int/en/activities/addressing/postal-addressing-systems-in-member-countries

