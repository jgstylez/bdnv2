export type Currency = 'USD' | 'BLKD';

export type WalletType = 'bank' | 'card' | 'giftcard' | 'blkd' | 'external';

export interface Wallet {
  id: string;
  userId: string;
  currency: Currency;
  balance: number;
  provider: string;
}

export interface BankAccountWallet extends Wallet {
  type: 'bank';
  accountNumber: string;
  routingNumber: string;
  isDefault: boolean;
}

export interface CreditCardWallet extends Wallet {
  type: 'card';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface GiftCardWallet extends Wallet {
  type: 'giftcard';
  last4: string;
  isDefault: boolean;
}
