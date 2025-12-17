import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { formatCurrency } from '../../lib/international';
import { Currency } from '../../types/wallet';

interface SuccessStepProps {
  businessName: string;
  totalAmount: number;
  currency: Currency;
  transactionId: string | null;
  onShowFeedback: () => void;
}

export const SuccessStep = (props: SuccessStepProps) => {
  const { businessName, totalAmount, currency, transactionId, onShowFeedback } = props;

  return (
    <View className="items-center py-16 gap-6">
      <MaterialIcons name="check-circle-outline" size={64} color="#ba9988" />
      <Text className="text-2xl font-bold text-white">Payment Successful</Text>
      <View className="items-center">
        <Text className="text-sm text-gray-400">You successfully sent</Text>
        <Text className="text-4xl font-bold text-primary mt-1">{formatCurrency(totalAmount, currency)}</Text>
        <Text className="text-sm text-gray-400 mt-1">to {businessName}</Text>
      </View>

      {transactionId && (
        <View className="bg-zinc-800 rounded-lg px-3 py-1.5 flex-row items-center gap-1.5">
          <Text className="text-xs text-gray-400">Transaction ID:</Text>
          <Text className="text-xs font-semibold text-white">{transactionId}</Text>
        </View>
      )}

      <TouchableOpacity onPress={onShowFeedback} className="mt-4">
        <Text className="text-base font-semibold text-primary underline">Rate your experience</Text>
      </TouchableOpacity>
    </View>
  );
};
