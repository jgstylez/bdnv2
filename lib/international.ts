/**
 * International Utilities
 * 
 * Helper functions for international address, phone, and currency handling
 */

import {
  CountryCode,
  InternationalAddress,
  InternationalPhoneNumber,
  Currency,
  TaxIdType,
  TaxIdentification,
  InternationalIncorporation,
  getCountryInfo,
  formatPhoneNumberE164,
  formatPhoneNumberDisplay,
  validatePostalCode,
  validatePhoneNumber,
} from "../types/international";

/**
 * Convert legacy address format to international format
 */
export function convertToInternationalAddress(
  address: {
    street?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    postalCode?: string;
    country?: string;
  }
): InternationalAddress {
  return {
    street: address.street || address.address || "",
    city: address.city || "",
    state: address.state,
    postalCode: address.postalCode || address.zipCode || "",
    country: (address.country as CountryCode) || "US",
  };
}

/**
 * Convert international address to legacy format (for backward compatibility)
 */
export function convertFromInternationalAddress(
  address: InternationalAddress
): {
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
} {
  return {
    street: address.street,
    city: address.city,
    state: address.state,
    zipCode: address.postalCode,
    country: address.country,
  };
}

/**
 * Format address for display
 */
export function formatAddressDisplay(address: InternationalAddress): string {
  const parts: string[] = [address.street];

  if (address.street2) {
    parts.push(address.street2);
  }

  parts.push(address.city);

  if (address.state) {
    parts.push(address.state);
  }

  parts.push(address.postalCode);

  if (address.countryName) {
    parts.push(address.countryName);
  } else {
    const countryInfo = getCountryInfo(address.country);
    if (countryInfo) {
      parts.push(countryInfo.name);
    }
  }

  return parts.join(", ");
}

/**
 * Parse phone number string into InternationalPhoneNumber
 */
export function parsePhoneNumber(
  phoneNumber: string,
  defaultCountry: CountryCode = "US"
): InternationalPhoneNumber {
  // If already in E.164 format
  if (phoneNumber.startsWith("+")) {
    // Extract country code (simplified - in production, use a library like libphonenumber)
    const match = phoneNumber.match(/^\+(\d{1,3})(.+)$/);
    if (match) {
      // Map common prefixes to country codes (simplified)
      const prefix = match[1];
      const number = match[2].replace(/\D/g, "");

      let countryCode: CountryCode = defaultCountry;
      if (prefix === "1") {
        countryCode = "US"; // Could be US or CA, default to US
      } else if (prefix === "44") {
        countryCode = "GB";
      } else if (prefix === "61") {
        countryCode = "AU";
      } else if (prefix === "27") {
        countryCode = "ZA";
      } else if (prefix === "234") {
        countryCode = "NG";
      }

      return {
        countryCode,
        phoneNumber: number,
        fullNumber: phoneNumber,
      };
    }
  }

  // Assume national format
  return {
    countryCode: defaultCountry,
    phoneNumber: phoneNumber.replace(/\D/g, ""),
    fullNumber: formatPhoneNumberE164(defaultCountry, phoneNumber),
  };
}

/**
 * Get appropriate tax ID type for a country
 */
export function getDefaultTaxIdType(country: CountryCode): TaxIdType {
  switch (country) {
    case "US":
      return "EIN";
    case "CA":
      return "GST";
    case "GB":
      return "VAT-GB";
    case "AU":
      return "ABN";
    case "BR":
      return "CNPJ";
    case "MX":
      return "RFC";
    case "AR":
      return "CUIT";
    case "CL":
      return "RUT";
    case "CO":
      return "NIT";
    case "PE":
      return "RUC";
    case "ES":
      return "CIF";
    case "FR":
      return "SIRET";
    case "IN":
      return "PAN";
    case "SG":
      return "UEN";
    case "AE":
      return "TRN";
    case "SA":
      return "CR";
    default:
      return "OTHER";
  }
}

/**
 * Validate tax ID based on type and country
 */
export function validateTaxId(taxId: TaxIdentification): boolean {
  const { type, number, country } = taxId;

  // Basic validation - remove non-alphanumeric characters
  const cleanNumber = number.replace(/[^A-Z0-9]/gi, "");

  switch (type) {
    case "EIN":
      // US EIN: 9 digits, format XX-XXXXXXX
      return /^\d{9}$/.test(cleanNumber) || /^\d{2}-?\d{7}$/.test(number);
    case "VAT":
    case "VAT-GB":
    case "VAT-EU":
      // VAT numbers vary by country, basic check: alphanumeric, 8-15 characters
      return /^[A-Z0-9]{8,15}$/i.test(cleanNumber);
    case "CNPJ":
      // Brazil CNPJ: 14 digits
      return /^\d{14}$/.test(cleanNumber);
    case "RFC":
      // Mexico RFC: 12-13 characters (alphanumeric)
      return /^[A-Z0-9]{12,13}$/i.test(cleanNumber);
    case "ABN":
      // Australia ABN: 11 digits
      return /^\d{11}$/.test(cleanNumber);
    case "PAN":
      // India PAN: 10 characters (5 letters, 4 digits, 1 letter)
      return /^[A-Z]{5}\d{4}[A-Z]$/i.test(cleanNumber);
    default:
      // For other types, basic validation: at least 5 characters
      return cleanNumber.length >= 5;
  }
}

/**
 * Get currency symbol for display
 */
export function getCurrencySymbol(currency: Currency): string {
  const symbols: Record<string, string> = {
    USD: "$",
    CAD: "C$",
    GBP: "£",
    EUR: "€",
    AUD: "A$",
    NZD: "NZ$",
    ZAR: "R",
    NGN: "₦",
    KES: "KSh",
    GHS: "₵",
    JMD: "J$",
    TTD: "TT$",
    BBD: "Bds$",
    BSD: "B$",
    XCD: "EC$",
    BZD: "BZ$",
    GYD: "GY$",
    SRD: "SR$",
    BRL: "R$",
    MXN: "Mex$",
    ARS: "$",
    CLP: "$",
    COP: "$",
    PEN: "S/",
    JPY: "¥",
    CNY: "¥",
    INR: "₹",
    SGD: "S$",
    AED: "د.إ",
    SAR: "﷼",
    BLKD: "BLKD",
  };

  return symbols[currency] || currency;
}

/**
 * Format currency amount for display
 */
export function formatCurrency(amount: number, currency: Currency, locale?: string): string {
  const symbol = getCurrencySymbol(currency);
  const localeCode = locale || getLocaleForCurrency(currency);

  // For BLKD token, use simple format
  if (currency === "BLKD") {
    return `${amount.toFixed(2)} ${symbol}`;
  }

  // Use Intl.NumberFormat for proper formatting
  try {
    return new Intl.NumberFormat(localeCode, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    // Fallback to simple format
    return `${symbol}${amount.toFixed(2)}`;
  }
}

/**
 * Get locale code for currency
 */
function getLocaleForCurrency(currency: Currency): string {
  const localeMap: Record<string, string> = {
    USD: "en-US",
    CAD: "en-CA",
    GBP: "en-GB",
    EUR: "en-GB", // Could be various EU locales
    AUD: "en-AU",
    NZD: "en-NZ",
    ZAR: "en-ZA",
    NGN: "en-NG",
    KES: "en-KE",
    GHS: "en-GH",
    JMD: "en-JM",
    BRL: "pt-BR",
    MXN: "es-MX",
    ARS: "es-AR",
    CLP: "es-CL",
    COP: "es-CO",
    PEN: "es-PE",
    JPY: "ja-JP",
    CNY: "zh-CN",
    INR: "en-IN",
    SGD: "en-SG",
    AED: "ar-AE",
    SAR: "ar-SA",
  };

  return localeMap[currency] || "en-US";
}

/**
 * Check if a country requires state/province field
 */
export function requiresStateField(country: CountryCode): boolean {
  const countryInfo = getCountryInfo(country);
  return countryInfo?.requiresState ?? false;
}

/**
 * Get label for state/province field based on country
 */
export function getStateFieldLabel(country: CountryCode): string {
  const countryInfo = getCountryInfo(country);
  return countryInfo?.stateLabel || "State/Province";
}

/**
 * Get label for postal code field based on country
 */
export function getPostalCodeLabel(country: CountryCode): string {
  const countryInfo = getCountryInfo(country);
  return countryInfo?.postalCodeLabel || "Postal Code";
}

