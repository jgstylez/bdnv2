import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { BusinessPlaceholder } from '../BusinessPlaceholder';
import { formatCurrency } from '../../lib/international';
import { Currency, Wallet as WalletType } from '../../types/wallet';

interface ReviewStepProps {
  business: { id: string; name: string; category: string } | null;
  note: string;
  setNote: (note: string) => void;
  totalAmount: number;
  currency: Currency;
  useBLKD: boolean;
  blkdCoverage: number;
  remainingAfterBLKD: number;
  serviceFee: number;
  hasBDNPlus: boolean;
  numericAmount: number;
  selectedWallet: WalletType | null;
}

export const ReviewStep = (props: ReviewStepProps) => {
  const {
    business,
    note,
    setNote,
    totalAmount,
    currency,
    useBLKD,
    blkdCoverage,
    remainingAfterBLKD,
    serviceFee,
    hasBDNPlus,
    numericAmount,
    selectedWallet,
  } = props;

  const walletBalance = selectedWallet ? (selectedWallet.availableBalance || selectedWallet.balance) : 0;

  return (
    <View className="gap-6">
      <View>
        <Text className="text-2xl font-bold text-white mb-2">Review Payment</Text>
        <Text className="text-sm text-gray-400">Please review your payment details before confirming.</Text>
      </View>

      {/* Business Info */}
      {business && (
        <View className="bg-zinc-900/50 rounded-xl p-3 border border-primary-alpha-20 flex-row items-center gap-3">
          <BusinessPlaceholder width={40} height={40} aspectRatio={1} />
          <View className="flex-1">
            <Text className="text-sm font-bold text-white mb-0.5">{business.name}</Text>
            <Text className="text-xs text-gray-400">{business.category}</Text>
          </View>
        </View>
      )}

      {/* Payment Note */}
      <View>
        <Text className="text-sm font-semibold text-white mb-2">Add a Note (Optional)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="What is this payment for?"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          multiline
          numberOfLines={3}
          className="bg-zinc-800 rounded-xl p-4 text-white text-sm min-h-[80px] text-top border border-primary-alpha-20"
        />
      </View>

      {/* Payment Summary */}
      <View className="bg-zinc-800 rounded-2xl p-5 border border-primary-alpha-20 gap-4">
        <View>
          <Text className="text-sm text-gray-400 mb-2">Payment Amount</Text>
          <Text className="text-2xl font-bold text-primary">{formatCurrency(totalAmount, currency)}</Text>
        </View>

        {useBLKD && blkdCoverage > 0 && (
          <>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-300">BLKD Applied</Text>
              <Text className="text-sm font-semibold text-primary">-{formatCurrency(blkdCoverage, "BLKD")}</Text>
            </View>
            <View className="h-px bg-primary-alpha-20" />
            <View className="flex-row justify-between">
              <Text className="text-base font-bold text-white">Amount to Pay</Text>
              <Text className="text-lg font-bold text-primary">{formatCurrency(remainingAfterBLKD, currency)}</Text>
            </View>
          </>
        )}

        <View className="h-px bg-primary-alpha-20" />

        <View className="gap-3">
          {serviceFee > 0 && (
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-300">Service Fee (10%)</Text>
              <Text className="text-sm font-semibold text-white">{formatCurrency(serviceFee, currency)}</Text>
            </View>
          )}
          {hasBDNPlus && (
             <View className="flex-row justify-between">
                <Text className="text-sm text-gray-300">Service Fee</Text>
                <Text className="text-sm font-semibold text-primary">Waived with BDN+</Text>
              </View>
          )}
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-300">Payment Method</Text>
            <Text className="text-sm font-semibold text-white">{selectedWallet?.name}</Text>
          </View>
        </View>

        <View className="h-px bg-primary-alpha-20" />

        <View className="flex-row justify-between">
          <Text className="text-lg font-bold text-white">Total</Text>
          <Text className="text-2xl font-bold text-primary">
            {formatCurrency(remainingAfterBLKD > 0 ? remainingAfterBLKD : totalAmount, currency)}
          </Text>
        </View>

        {selectedWallet && (
           <View className="bg-zinc-900/70 rounded-xl p-4 mt-2">
            <View className="flex-row justify-between mb-2">
                <Text className="text-xs text-gray-400">Current Balance</Text>
                <Text className="text-sm font-semibold text-white">{formatCurrency(walletBalance, currency)}</Text>
            </View>
            <View className="flex-row justify-between">
                <Text className="text-xs text-gray-400">After Payment</Text>
                <Text className="text-sm font-semibold text-green-400">
                {formatCurrency(walletBalance - (remainingAfterBLKD > 0 ? remainingAfterBLKD : totalAmount), currency)}
                </Text>
            </View>
        </View>
        )}
      </View>
    </View>
  );
};
