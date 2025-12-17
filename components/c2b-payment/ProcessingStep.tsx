import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ProcessingStepProps {
  businessName: string;
}

export const ProcessingStep = ({ businessName }: ProcessingStepProps) => {
  return (
    <View className="items-center py-16 gap-6">
      <MaterialIcons name="hourglass-empty" size={64} color="#ba9988" />
      <Text className="text-xl font-bold text-white">Processing Payment...</Text>
      <Text className="text-sm text-gray-400 text-center">
        Please wait while we process your payment to {businessName}.
      </Text>
    </View>
  );
};
