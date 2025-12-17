import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { PageTitle } from '@/components/header/PageTitle';
import Button from '@/components/Button';

// Mock data for users. In a real app, you would fetch this from a database.
const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
];

export default function UserManagement() {
  const renderItem = ({ item }: { item: typeof MOCK_USERS[0] }) => (
    <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <TouchableOpacity onPress={() => router.push(`/admin/users/edit?id=${item.id}`)}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>{item.email}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <PageTitle title="User Management" />
      <Button onPress={() => router.push('/admin/users/create')}>
        Create New User
      </Button>
      <FlatList
        data={MOCK_USERS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
