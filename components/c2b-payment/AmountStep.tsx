import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PaymentKeypad } from '../PaymentKeypad';
import { BusinessPlaceholder } from '../BusinessPlaceholder';
import { formatCurrency } from '../../lib/international';
import { Currency } from '../../types/wallet';

interface AmountStepProps {
  business: { id: string; name: string; category: string } | null;
  amount: string;
  setAmount: (amount: string) => void;
  currency: Currency;
  numericAmount: number;
  serviceFee: number;
  totalAmount: number;
  hasBDNPlus: boolean;
  onEditBusiness: () => void;
}

export const AmountStep = (props: AmountStepProps) => {
  const { 
    business, 
    amount, 
    setAmount, 
    currency, 
    numericAmount, 
    serviceFee, 
    totalAmount, 
    hasBDNPlus, 
    onEditBusiness 
  } = props;

  return (
    <View className="gap-6">
      <View>
        <Text className="text-2xl font-bold text-white mb-2">Pay Business</Text>
        <Text className="text-sm text-gray-400">
          {business ? `Enter the amount you'd like to send to ${business.name}.` : 'Enter the amount you\'d like to send.'}
        </Text>
      </View>

      {business && (
        <View className="bg-zinc-900/50 rounded-xl p-3 border border-primary-alpha-20 flex-row items-center gap-3">
          <BusinessPlaceholder width={40} height={40} aspectRatio={1} />
          <View className="flex-1">
            <Text className="text-sm font-bold text-white mb-0.5">{business.name}</Text>
            <Text className="text-xs text-gray-400">{business.category}</Text>
          </View>
          <TouchableOpacity onPress={onEditBusiness} className="p-1">
            <MaterialIcons name="edit" size={18} color="rgba(255, 255, 255, 0.5)" />
          </TouchableOpacity>
        </View>
      )}

      <PaymentKeypad value={amount} onValueChange={setAmount} currency={currency} />

      {numericAmount > 0 && (
        <View className="bg-zinc-800 rounded-2xl p-5 border border-primary-alpha-20">
          <View className="flex-row justify-between mb-3">
            <Text className="text-sm text-gray-300">Payment Amount</Text>
            <Text className="text-base font-semibold text-white">{formatCurrency(numericAmount, currency)}</Text>
          </View>

          {serviceFee > 0 ? (
            <View className="flex-row justify-between mb-3">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-sm text-gray-300">Service Fee (10%)</Text>
                {hasBDNPlus && (
                  <View className="bg-primary-alpha-20 px-1.5 py-0.5 rounded">
                    <Text className="text-xs text-primary font-semibold">BDN+</Text>
                  </View>
                )}
              </View>
              <Text className="text-sm font-semibold text-gray-300">{formatCurrency(serviceFee, currency)}</Text>
            </View>
          ) : hasBDNPlus && (
            <View className="mb-3">
              <View className="flex-row justify-between mb-1">
                <Text className="text-sm text-gray-300">Service Fee</Text>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-sm font-semibold text-primary line-through">
                    {formatCurrency(numericAmount * 0.10, currency)}
                  </Text>
                  <Text className="text-sm font-semibold text-primary">{formatCurrency(0, currency)}</Text>
                </View>
              </View>
              <Text className="text-xs text-primary italic text-right">✓ Service fee waived with BDN+</Text>
            </View>
          )}
          
          <View className="h-px bg-primary-alpha-20 mb-3" />

          <View className="flex-row justify-between">
            <Text className="text-base font-bold text-white">Total</Text>
            <Text className="text-xl font-bold text-primary">{formatCurrency(totalAmount, currency)}</Text>
          </View>
        </View>
      )}
    </View>
  );
};
