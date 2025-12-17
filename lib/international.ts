import { Currency } from "../types/wallet";
import { InternationalAddress, CountryCode } from "../types/international";

export const formatCurrency = (amount: number, currency: Currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
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