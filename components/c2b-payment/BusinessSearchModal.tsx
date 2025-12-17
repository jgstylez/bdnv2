import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Business } from '../../types/business';
import { BusinessPlaceholder } from '../BusinessPlaceholder';

interface BusinessSearchModalProps {
  visible: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredBusinesses: Business[];
  onSelectBusiness: (businessId: string) => void;
}

export const BusinessSearchModal = (props: BusinessSearchModalProps) => {
  const { 
    visible, 
    onClose, 
    searchQuery, 
    setSearchQuery, 
    filteredBusinesses, 
    onSelectBusiness 
  } = props;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-zinc-900 p-6 pt-12">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-white">Select a Business</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View className="bg-zinc-800 rounded-xl p-3 flex-row items-center gap-2 mb-6">
          <MaterialIcons name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name or category"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            className="flex-1 text-white"
          />
        </View>

        <FlatList
          data={filteredBusinesses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSelectBusiness(item.id)}
              className="bg-zinc-800 rounded-xl p-4 flex-row items-center gap-4 mb-3"
            >
              <BusinessPlaceholder width={40} height={40} aspectRatio={1} />
              <View className="flex-1">
                <Text className="text-base font-semibold text-white">{item.name}</Text>
                <Text className="text-sm text-gray-400">{item.category}</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View className="items-center py-16">
              <MaterialIcons name="storefront" size={48} color="rgba(255, 255, 255, 0.3)" />
              <Text className="text-lg font-semibold text-gray-400 mt-4">
                No businesses found
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Try a different search term.
              </Text>
            </View>
          )}
        />
      </View>
    </Modal>
  );
};
