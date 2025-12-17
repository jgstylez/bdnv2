import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function EditCampaign() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Edit Campaign: {id}</Text>
    </View>
  );
}
