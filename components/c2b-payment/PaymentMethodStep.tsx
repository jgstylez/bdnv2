import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Wallet as WalletType, Currency, CreditCardWallet, BankAccountWallet } from '../../types/wallet';
import { formatCurrency } from '../../lib/international';

interface PaymentMethodStepProps {
  businessName: string;
  numericAmount: number;
  totalAmount: number;
  currency: Currency;
  useBLKD: boolean;
  setUseBLKD: (use: boolean) => void;
  blkdWallet: WalletType | undefined;
  blkdBalance: number;
  blkdCoverage: number;
  remainingAfterBLKD: number;
  availableWallets: WalletType[];
  selectedWallet: WalletType | null;
  setSelectedWallet: (wallet: WalletType) => void;
}

export const PaymentMethodStep = (props: PaymentMethodStepProps) => {
  const {
    businessName,
    numericAmount,
    currency,
    useBLKD,
    setUseBLKD,
    blkdWallet,
    blkdBalance,
    blkdCoverage,
    remainingAfterBLKD,
    availableWallets,
    selectedWallet,
    setSelectedWallet,
  } = props;

  return (
    <View className="gap-6">
      <View>
        <Text className="text-2xl font-bold text-white mb-2">Select Payment Method</Text>
        <Text className="text-sm text-gray-400">
          {remainingAfterBLKD > 0
            ? `Pay ${formatCurrency(remainingAfterBLKD, currency)} to ${businessName}${useBLKD && blkdCoverage > 0 ? ` (${formatCurrency(blkdCoverage, "BLKD")} applied)` : ""}`
            : `Pay ${formatCurrency(numericAmount, currency)} to ${businessName}`}
        </Text>
      </View>

      <View className="gap-3">
        {/* BLKD Toggle Option */}
        {blkdWallet && blkdBalance > 0 && (
          <View
            className={`bg-zinc-800 rounded-2xl p-4 border ${useBLKD ? 'border-primary' : 'border-primary-alpha-20'}`}
          >
            <TouchableOpacity
              onPress={() => setUseBLKD(!useBLKD)}
              className="flex-row items-center gap-3"
            >
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${useBLKD ? 'bg-primary border-primary' : 'border-primary-alpha-20'}`}
              >
                {useBLKD && <MaterialIcons name="check" size={16} color="#ffffff" />}
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <MaterialIcons name="stars" size={20} color="#ba9988" />
                  <Text className="text-base font-bold text-white">Apply BLKD</Text>
                </View>
                <Text className="text-xs text-gray-400">
                  Available: {formatCurrency(blkdBalance, "BLKD")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Wallet Options */}
        {remainingAfterBLKD > 0 && (
          <>
            {availableWallets.map((wallet) => {
              const balance = wallet.availableBalance || wallet.balance;
              const isSelected = selectedWallet?.id === wallet.id;
              return (
                <TouchableOpacity
                  key={wallet.id}
                  onPress={() => setSelectedWallet(wallet)}
                  className={`rounded-2xl p-5 border-2 flex-row items-center gap-4 ${isSelected ? 'bg-primary border-primary' : 'bg-zinc-800 border-primary-alpha-20'}`}
                >
                  <View
                    className={`w-12 h-12 rounded-full items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-primary-alpha-20'}`}
                  >
                    <MaterialIcons
                      name={
                        wallet.type === 'creditcard'
                          ? 'credit-card'
                          : wallet.type === 'bankaccount'
                          ? 'account-balance'
                          : 'account-balance-wallet'
                      }
                      size={24}
                      color={isSelected ? '#ffffff' : '#ba9988'}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-base font-bold mb-1 ${isSelected ? 'text-white' : 'text-white'}`}>{wallet.name}</Text>
                    {(wallet.type === 'creditcard' || wallet.type === 'bankaccount') && (
                      <Text className={`text-xs ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>
                        •••• {(wallet as CreditCardWallet | BankAccountWallet).last4}
                      </Text>
                    )}
                  </View>
                  <View className="items-end">
                    <Text className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-primary'}`}>{formatCurrency(balance, currency)}</Text>
                    <Text className={`text-xs ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>Available</Text>
                  </View>
                  {isSelected && <MaterialIcons name="check-circle" size={24} color="#ffffff" />}
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </View>
    </View>
  );
};
