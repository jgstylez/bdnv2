import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { PageTitle } from '@/components/header/PageTitle';
import Button from '@/components/Button';

// Mock data for blog posts. In a real app, you would fetch this from a database.
const MOCK_POSTS = [
  { id: '123', title: 'My First Blog Post', author: 'John Doe' },
  { id: '456', title: 'My Second Blog Post', author: 'Jane Smith' },
];

export default function BlogManagement() {
  const renderItem = ({ item }: { item: typeof MOCK_POSTS[0] }) => (
    <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <TouchableOpacity onPress={() => router.push(`/admin/blog/edit?id=${item.id}`)}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>by {item.author}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <PageTitle title="Blog Management" />
      <Button
        title="Create New Post"
        onPress={() => router.push('/admin/blog/create')}
      />
      <FlatList
        data={MOCK_POSTS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
