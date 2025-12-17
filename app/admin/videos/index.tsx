import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { PageTitle } from '../../../../components/header/PageTitle';
import { ActionButton } from '../../../../components/buttons/ActionButton';

// Mock data for videos. In a real app, you would fetch this from a database.
const MOCK_VIDEOS = [
  { id: '1', title: 'My First Video', url: 'https://example.com/video1.mp4' },
  { id: '2', title: 'My Second Video', url: 'https://example.com/video2.mp4' },
];

export default function VideoManagement() {
  const renderItem = ({ item }: { item: typeof MOCK_VIDEOS[0] }) => (
    <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <TouchableOpacity onPress={() => router.push(`/admin/videos/edit?id=${item.id}`)}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>{item.url}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <PageTitle title="Video Management" />
      <ActionButton
        title="Create New Video"
        onPress={() => router.push('/admin/videos/create')}
      />
      <FlatList
        data={MOCK_VIDEOS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
