import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BusinessPlaceholder } from '../BusinessPlaceholder';

interface SelectBusinessProps {
  business: { id: string; name: string; category: string } | null;
  onSelect: () => void;
  onClear: () => void;
}

export const SelectBusiness = ({ business, onSelect, onClear }: SelectBusinessProps) => {
  return (
    <View className="gap-6">
      <View>
        <Text className="text-2xl font-bold text-white mb-2">Select Business</Text>
        <Text className="text-sm text-gray-400">Choose the business you'd like to pay.</Text>
      </View>

      {!business ? (
        <TouchableOpacity
          onPress={onSelect}
          className="bg-zinc-800 rounded-2xl p-4 border border-primary-alpha-20 flex-row items-center gap-4"
        >
          <MaterialIcons name="search" size={24} color="rgba(255, 255, 255, 0.5)" />
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-300">Select a business</Text>
            <Text className="text-xs text-gray-500 mt-0.5">Tap to search and select</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255, 255, 255, 0.5)" />
        </TouchableOpacity>
      ) : (
        <View className="bg-zinc-900/50 rounded-xl p-3 border border-primary-alpha-20 flex-row items-center gap-3">
          <BusinessPlaceholder width={40} height={40} aspectRatio={1} />
          <View className="flex-1">
            <Text className="text-sm font-bold text-white mb-0.5">{business.name}</Text>
            <Text className="text-xs text-gray-400">{business.category}</Text>
          </View>
          <TouchableOpacity onPress={onClear} className="p-1">
            <MaterialIcons name="close" size={18} color="rgba(255, 255, 255, 0.5)" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
