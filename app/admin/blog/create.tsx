import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { PageTitle } from '@/components/header/PageTitle';
import { FormSection } from '@/components/forms/FormSection';
import { BlogPostForm } from '@/components/admin/blog/BlogPostForm';
import Button from '@/components/Button';
import { logger } from '@/lib/logger';

export default function CreateBlogPost() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    author: '',
  });

  const handleSave = () => {
    // In a real app, you would save this data to a database
    logger.info('Saving blog post', { form });
    Alert.alert('Success', 'Blog post created successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView>
      <PageTitle title="Create Blog Post" />
      <FormSection title="Blog Post Details">
        <BlogPostForm form={form} setForm={setForm} />
      </FormSection>
      <View style={{ flexDirection: 'row', gap: 8, padding: 16 }}>
        <Button onPress={handleSave}>Create Post</Button>
        <Button variant="outline" onPress={() => router.back()}>Cancel</Button>
      </View>
    </ScrollView>
  );
}
