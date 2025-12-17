import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { PageTitle } from '@/components/header/PageTitle';
import Button from '@/components/Button';

// Mock data for subscriptions. In a real app, you would fetch this from a database.
const MOCK_SUBSCRIPTIONS = [
  { id: '1', name: 'Basic Plan', price: 9.99, status: 'Active' },
  { id: '2', name: 'Premium Plan', price: 19.99, status: 'Cancelled' },
];

export default function SubscriptionManagement() {
  const renderItem = ({ item }: { item: typeof MOCK_SUBSCRIPTIONS[0] }) => (
    <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <TouchableOpacity onPress={() => router.push(`/pages/merchant/subscriptions/edit?id=${item.id}`)}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>Price: ${item.price.toFixed(2)}</Text>
        <Text style={{ fontSize: 14, color: item.status === 'Active' ? 'green' : 'red' }}>Status: {item.status}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <PageTitle title="Subscription Management" />
      <Button onPress={() => router.push('/pages/merchant/subscriptions/create')}>
        Create New Subscription
      </Button>
      <FlatList
        data={MOCK_SUBSCRIPTIONS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
