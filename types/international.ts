/**
 * International Support Types and Utilities
 * 
 * This module provides types and utilities for supporting international
 * users and businesses, including addresses, phone numbers, currencies,
 * and tax identification numbers.
 */

/**
 * ISO 3166-1 alpha-2 country codes
 * Common countries for initial support
 */
export type CountryCode =
  | "US" // United States
  | "CA" // Canada
  | "GB" // United Kingdom
  | "AU" // Australia
  | "NZ" // New Zealand
  | "ZA" // South Africa
  | "NG" // Nigeria
  | "KE" // Kenya
  | "GH" // Ghana
  | "JM" // Jamaica
  | "TT" // Trinidad and Tobago
  | "BB" // Barbados
  | "BS" // Bahamas
  | "AG" // Antigua and Barbuda
  | "GD" // Grenada
  | "LC" // Saint Lucia
  | "VC" // Saint Vincent and the Grenadines
  | "DM" // Dominica
  | "KN" // Saint Kitts and Nevis
  | "BZ" // Belize
  | "GY" // Guyana
  | "SR" // Suriname
  | "FR" // France
  | "DE" // Germany
  | "IT" // Italy
  | "ES" // Spain
  | "NL" // Netherlands
  | "BE" // Belgium
  | "PT" // Portugal
  | "BR" // Brazil
  | "MX" // Mexico
  | "AR" // Argentina
  | "CL" // Chile
  | "CO" // Colombia
  | "PE" // Peru
  | "JP" // Japan
  | "CN" // China
  | "IN" // India
  | "SG" // Singapore
  | "AE" // United Arab Emirates
  | "SA" // Saudi Arabia
  | string; // Allow any ISO country code for future expansion

/**
 * International address structure
 * Supports various address formats globally
 */
export interface InternationalAddress {
  street: string;
  street2?: string; // Apartment, suite, unit, etc.
  city: string;
  state?: string; // State, province, region, etc. (optional - not all countries have this)
  postalCode: string; // Postal code, ZIP code, postcode, etc.
  country: CountryCode;
  countryName?: string; // Human-readable country name
}

/**
 * Phone number with country code support
 */
export interface InternationalPhoneNumber {
  countryCode: string; // ISO country code (e.g., "US", "GB")
  phoneNumber: string; // National format phone number
  fullNumber?: string; // E.164 format (e.g., +1 555 123 4567)
}

/**
 * Supported currencies
 * Extends beyond USD and BLKD to support international transactions
 */
export type Currency =
  | "USD" // US Dollar
  | "BLKD" // BDN Token
  | "CAD" // Canadian Dollar
  | "GBP" // British Pound
  | "EUR" // Euro
  | "AUD" // Australian Dollar
  | "NZD" // New Zealand Dollar
  | "ZAR" // South African Rand
  | "NGN" // Nigerian Naira
  | "KES" // Kenyan Shilling
  | "GHS" // Ghanaian Cedi
  | "JMD" // Jamaican Dollar
  | "TTD" // Trinidad and Tobago Dollar
  | "BBD" // Barbadian Dollar
  | "BSD" // Bahamian Dollar
  | "XCD" // East Caribbean Dollar
  | "BZD" // Belize Dollar
  | "GYD" // Guyanese Dollar
  | "SRD" // Surinamese Dollar
  | "BRL" // Brazilian Real
  | "MXN" // Mexican Peso
  | "ARS" // Argentine Peso
  | "CLP" // Chilean Peso
  | "COP" // Colombian Peso
  | "PEN" // Peruvian Sol
  | "JPY" // Japanese Yen
  | "CNY" // Chinese Yuan
  | "INR" // Indian Rupee
  | "SGD" // Singapore Dollar
  | "AED" // UAE Dirham
  | "SAR" // Saudi Riyal
  | string; // Allow any ISO 4217 currency code

/**
 * Tax identification number types
 * Supports various tax ID formats globally
 */
export type TaxIdType =
  | "EIN" // US Employer Identification Number
  | "SSN" // US Social Security Number
  | "VAT" // Value Added Tax (EU, UK, etc.)
  | "GST" // Goods and Services Tax (Canada, Australia, etc.)
  | "HST" // Harmonized Sales Tax (Canada)
  | "PST" // Provincial Sales Tax (Canada)
  | "ABN" // Australian Business Number
  | "ACN" // Australian Company Number
  | "CNPJ" // Brazil Company Registration
  | "RFC" // Mexico Tax ID
  | "CUIT" // Argentina Tax ID
  | "RUT" // Chile Tax ID
  | "NIT" // Colombia Tax ID
  | "RUC" // Peru Tax ID
  | "CIF" // Spain Tax ID
  | "SIRET" // France Company Registration
  | "VAT-GB" // UK VAT Number
  | "VAT-EU" // EU VAT Number
  | "PAN" // India Permanent Account Number
  | "UEN" // Singapore Unique Entity Number
  | "TRN" // UAE Tax Registration Number
  | "CR" // Saudi Arabia Commercial Registration
  | "OTHER"; // Other/unspecified

/**
 * Tax identification information
 */
export interface TaxIdentification {
  type: TaxIdType;
  number: string;
  country: CountryCode;
  verified?: boolean;
  verifiedAt?: string;
}

/**
 * Business incorporation information (international)
 */
export interface InternationalIncorporation {
  isIncorporated: boolean;
  incorporationType?: "llc" | "corporation" | "partnership" | "sole-proprietorship" | "nonprofit" | "limited" | "plc" | "gmbh" | "sarl" | "bv" | "nv" | "sa" | "other";
  incorporationCountry?: CountryCode;
  incorporationState?: string; // State, province, or region
  incorporationDate?: string;
  registrationNumber?: string; // Company registration number
}

/**
 * Country information
 */
export interface CountryInfo {
  code: CountryCode;
  name: string;
  currency: Currency;
  phonePrefix: string; // International dialing code (e.g., "+1", "+44")
  requiresState?: boolean; // Whether state/province is required
  stateLabel?: string; // Label for state field (e.g., "State", "Province", "Region")
  postalCodeLabel?: string; // Label for postal code (e.g., "ZIP Code", "Postcode", "Postal Code")
  postalCodePattern?: RegExp; // Validation pattern for postal code
  phonePattern?: RegExp; // Validation pattern for phone number
}

/**
 * Common country information
 * This can be expanded or moved to a separate data file
 */
export const COUNTRY_INFO: Record<string, CountryInfo> = {
  US: {
    code: "US",
    name: "United States",
    currency: "USD",
    phonePrefix: "+1",
    requiresState: true,
    stateLabel: "State",
    postalCodeLabel: "ZIP Code",
    postalCodePattern: /^\d{5}(-\d{4})?$/,
    phonePattern: /^\+?1?\s?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
  },
  CA: {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    phonePrefix: "+1",
    requiresState: true,
    stateLabel: "Province",
    postalCodeLabel: "Postal Code",
    postalCodePattern: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    phonePattern: /^\+?1?\s?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
  },
  GB: {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    phonePrefix: "+44",
    requiresState: false,
    postalCodeLabel: "Postcode",
    postalCodePattern: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
    phonePattern: /^\+?44\s?(\d{4}\s?\d{6}|\d{3}\s?\d{3}\s?\d{4})$/,
  },
  AU: {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    phonePrefix: "+61",
    requiresState: true,
    stateLabel: "State",
    postalCodeLabel: "Postcode",
    postalCodePattern: /^\d{4}$/,
    phonePattern: /^\+?61\s?(\d{1})\s?(\d{4})\s?(\d{4})$/,
  },
  ZA: {
    code: "ZA",
    name: "South Africa",
    currency: "ZAR",
    phonePrefix: "+27",
    requiresState: false,
    postalCodeLabel: "Postal Code",
    postalCodePattern: /^\d{4}$/,
    phonePattern: /^\+?27\s?(\d{2})\s?(\d{3})\s?(\d{4})$/,
  },
  NG: {
    code: "NG",
    name: "Nigeria",
    currency: "NGN",
    phonePrefix: "+234",
    requiresState: true,
    stateLabel: "State",
    postalCodeLabel: "Postal Code",
    postalCodePattern: /^\d{6}$/,
    phonePattern: /^\+?234\s?(\d{3})\s?(\d{3})\s?(\d{4})$/,
  },
  JM: {
    code: "JM",
    name: "Jamaica",
    currency: "JMD",
    phonePrefix: "+1",
    requiresState: false,
    postalCodeLabel: "Postal Code",
    postalCodePattern: /^[A-Z]{2}\d{2,3}$/,
    phonePattern: /^\+?1\s?(876)\s?(\d{3})\s?(\d{4})$/,
  },
  BR: {
    code: "BR",
    name: "Brazil",
    currency: "BRL",
    phonePrefix: "+55",
    requiresState: true,
    stateLabel: "State",
    postalCodeLabel: "CEP",
    postalCodePattern: /^\d{5}-?\d{3}$/,
    phonePattern: /^\+?55\s?(\d{2})\s?(\d{4,5})\s?(\d{4})$/,
  },
  MX: {
    code: "MX",
    name: "Mexico",
    currency: "MXN",
    phonePrefix: "+52",
    requiresState: true,
    stateLabel: "State",
    postalCodeLabel: "Postal Code",
    postalCodePattern: /^\d{5}$/,
    phonePattern: /^\+?52\s?(\d{2,3})\s?(\d{4})\s?(\d{4})$/,
  },
};

/**
 * Get country info by code
 */
export function getCountryInfo(countryCode: CountryCode): CountryInfo | undefined {
  return COUNTRY_INFO[countryCode];
}

/**
 * Format phone number to E.164 format
 */
export function formatPhoneNumberE164(countryCode: CountryCode, phoneNumber: string): string {
  const countryInfo = getCountryInfo(countryCode);
  if (!countryInfo) {
    return phoneNumber;
  }

  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, "");

  // If already starts with country prefix, return as is
  if (phoneNumber.startsWith("+")) {
    return phoneNumber;
  }

  // Add country prefix
  return `${countryInfo.phonePrefix}${digits}`;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumberDisplay(countryCode: CountryCode, phoneNumber: string): string {
  const countryInfo = getCountryInfo(countryCode);
  if (!countryInfo) {
    return phoneNumber;
  }

  // Remove country prefix if present
  let digits = phoneNumber.replace(/\D/g, "");
  if (digits.startsWith(countryInfo.phonePrefix.replace("+", ""))) {
    digits = digits.substring(countryInfo.phonePrefix.replace("+", "").length);
  }

  // Format based on country
  switch (countryCode) {
    case "US":
    case "CA":
      // Format: (XXX) XXX-XXXX
      if (digits.length === 10) {
        return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
      }
      break;
    case "GB":
      // Format: XXXX XXX XXX or 0XXX XXX XXXX
      if (digits.length === 10) {
        return `0${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
      }
      break;
    default:
      // Default: return with country prefix
      return `${countryInfo.phonePrefix} ${digits}`;
  }

  return phoneNumber;
}

/**
 * Validate postal code based on country
 */
export function validatePostalCode(countryCode: CountryCode, postalCode: string): boolean {
  const countryInfo = getCountryInfo(countryCode);
  if (!countryInfo || !countryInfo.postalCodePattern) {
    return postalCode.length > 0; // Basic validation if no pattern
  }
  return countryInfo.postalCodePattern.test(postalCode);
}

/**
 * Validate phone number based on country
 */
export function validatePhoneNumber(countryCode: CountryCode, phoneNumber: string): boolean {
  const countryInfo = getCountryInfo(countryCode);
  if (!countryInfo || !countryInfo.phonePattern) {
    return phoneNumber.length >= 10; // Basic validation if no pattern
  }
  return countryInfo.phonePattern.test(phoneNumber);
}

