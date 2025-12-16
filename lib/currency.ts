/**
 * Currency Conversion Utilities
 * 
 * Provides currency conversion functionality for transactions
 * In production, integrate with a real-time exchange rate API
 */

import { Currency } from "../types/international";

/**
 * Exchange rate data structure
 * In production, fetch from an API like:
 * - ExchangeRate-API
 * - Fixer.io
 * - CurrencyLayer
 * - Open Exchange Rates
 */
interface ExchangeRates {
  base: Currency;
  rates: Record<Currency, number>;
  timestamp: number;
}

/**
 * Mock exchange rates (for development)
 * In production, fetch real-time rates from an API
 */
const MOCK_EXCHANGE_RATES: ExchangeRates = {
  base: "USD",
  rates: {
    USD: 1.0,
    BLKD: 1.0, // 1:1 with USD for now
    CAD: 1.35,
    GBP: 0.79,
    EUR: 0.92,
    AUD: 1.52,
    NZD: 1.66,
    ZAR: 18.5,
    NGN: 1500,
    KES: 130,
    GHS: 12.5,
    JMD: 155,
    TTD: 6.75,
    BBD: 2.0,
    BSD: 1.0,
    XCD: 2.7,
    BZD: 2.0,
    GYD: 209,
    SRD: 38,
    BRL: 5.0,
    MXN: 17.0,
    ARS: 850,
    CLP: 950,
    COP: 3900,
    PEN: 3.7,
    JPY: 150,
    CNY: 7.2,
    INR: 83,
    SGD: 1.34,
    AED: 3.67,
    SAR: 3.75,
  },
  timestamp: Date.now(),
};

/**
 * Cache for exchange rates
 */
let cachedRates: ExchangeRates | null = null;
let cacheExpiry = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Fetch exchange rates from API
 * TODO: Implement actual API call
 */
async function fetchExchangeRates(base: Currency = "USD"): Promise<ExchangeRates> {
  // In production, make API call:
  // const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
  // const data = await response.json();
  // return { base, rates: data.rates, timestamp: Date.now() };

  // For now, return mock data
  return MOCK_EXCHANGE_RATES;
}

/**
 * Get current exchange rates
 * Uses cache if available and not expired
 */
export async function getExchangeRates(base: Currency = "USD"): Promise<ExchangeRates> {
  const now = Date.now();
  
  if (cachedRates && cachedRates.base === base && now < cacheExpiry) {
    return cachedRates;
  }

  const rates = await fetchExchangeRates(base);
  cachedRates = rates;
  cacheExpiry = now + CACHE_DURATION;
  
  return rates;
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): Promise<number> {
  if (from === to) {
    return amount;
  }

  const rates = await getExchangeRates(from);
  
  // Convert to base currency first if needed
  const baseAmount = from === rates.base ? amount : amount / rates.rates[from];
  
  // Convert to target currency
  const convertedAmount = to === rates.base ? baseAmount : baseAmount * rates.rates[to];
  
  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert currency synchronously using cached rates
 * Returns null if rates are not available
 */
export function convertCurrencySync(
  amount: number,
  from: Currency,
  to: Currency,
  rates?: ExchangeRates
): number | null {
  if (from === to) {
    return amount;
  }

  const exchangeRates = rates || cachedRates;
  if (!exchangeRates) {
    return null;
  }

  // Convert to base currency first if needed
  const baseAmount = from === exchangeRates.base 
    ? amount 
    : amount / exchangeRates.rates[from];
  
  // Convert to target currency
  const convertedAmount = to === exchangeRates.base 
    ? baseAmount 
    : baseAmount * exchangeRates.rates[to];
  
  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
}

/**
 * Format amount with currency symbol
 */
export function formatCurrencyAmount(amount: number, currency: Currency): string {
  const { formatCurrency } = require("./international");
  return formatCurrency(amount, currency);
}

/**
 * Get exchange rate between two currencies
 */
export async function getExchangeRate(from: Currency, to: Currency): Promise<number> {
  if (from === to) {
    return 1.0;
  }

  const rates = await getExchangeRates(from);
  const fromRate = from === rates.base ? 1 : rates.rates[from];
  const toRate = to === rates.base ? 1 : rates.rates[to];
  
  return toRate / fromRate;
}

