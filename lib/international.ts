import { Currency } from "../types/wallet";
import { InternationalAddress, CountryCode, getCountryInfo } from "../types/international";

export const formatCurrency = (amount: number, currency: Currency) => {
    // Simplified to USD only for now to avoid errors
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

/**
 * Convert a legacy US-format address to InternationalAddress format
 */
export function convertToInternationalAddress(legacyAddress: {
  address?: string;
  street?: string;
  address2?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  zipCode?: string;
  postalCode?: string;
  country?: CountryCode;
}): InternationalAddress {
  return {
    street: legacyAddress.address || legacyAddress.street || '',
    street2: legacyAddress.address2 || legacyAddress.street2,
    city: legacyAddress.city || '',
    state: legacyAddress.state,
    postalCode: legacyAddress.postalCode || legacyAddress.zip || legacyAddress.zipCode || '',
    country: legacyAddress.country || 'US',
  };
}

/**
 * Check if a country requires a state/province field
 */
export function requiresStateField(countryCode: CountryCode): boolean {
  const countryInfo = getCountryInfo(countryCode);
  return countryInfo?.requiresState ?? false;
}

/**
 * Get the label for the state/province field based on country
 */
export function getStateFieldLabel(countryCode: CountryCode): string {
  const countryInfo = getCountryInfo(countryCode);
  return countryInfo?.stateLabel ?? "State/Province";
}

/**
 * Get the label for the postal code field based on country
 */
export function getPostalCodeLabel(countryCode: CountryCode): string {
  const countryInfo = getCountryInfo(countryCode);
  return countryInfo?.postalCodeLabel ?? "Postal Code";
}