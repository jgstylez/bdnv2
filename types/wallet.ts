export type WalletType =
  | "primary"
  | "myimpact"
  | "giftcard"
  | "business"
  | "organization"
  | "bankaccount"
  | "creditcard";

import { Currency } from "./international";

export interface Wallet {
  id: string;
  type: WalletType;
  name: string;
  currency: Currency;
  balance: number;
  availableBalance?: number;
  isActive: boolean;
  isDefault?: boolean;
  isBackup?: boolean;
  lastUpdated?: string;
  // Multi-currency support
  country?: string; // ISO country code for country-specific wallets
  exchangeRate?: number; // Current exchange rate to base currency (USD)
}

export interface GiftCard extends Wallet {
  type: "giftcard";
  merchantId?: string;
  merchantName?: string;
  expirationDate?: string;
  cardNumber?: string;
}

export interface BankAccountWallet extends Wallet {
  type: "bankaccount";
  bankName: string;
  accountType: "checking" | "savings";
  last4: string;
  routingNumber?: string;
}

export interface CreditCardWallet extends Wallet {
  type: "creditcard";
  cardBrand: string;
  last4: string;
  expirationDate: string;
  cardholderName: string;
}

export interface GiftCardWallet extends Wallet {
  type: "giftcard";
  merchantId?: string;
  merchantName?: string;
  expirationDate?: string;
  cardNumber?: string;
}

