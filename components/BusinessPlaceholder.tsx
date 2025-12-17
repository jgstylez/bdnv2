import React from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface BusinessPlaceholderProps {
  width: number;
  height: number;
  aspectRatio: number;
}

export const BusinessPlaceholder = ({ width, height, aspectRatio }: BusinessPlaceholderProps) => {
  return (
    <View
      style={{
        width,
        height,
        aspectRatio,
        backgroundColor: '#3f3f46',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MaterialIcons name="storefront" size={24} color="rgba(255, 255, 255, 0.5)" />
    </View>
  );
};
