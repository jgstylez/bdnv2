import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { PageTitle } from '../../components/header/PageTitle';
import { FormSection } from '../../components/forms/FormSection';
import { BlogPostForm } from '../../components/admin/blog/BlogPostForm';
import { BaseModal, ConfirmModal, FormModal } from '../../components/modals';

export default function CreateBlogPost() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    author: '',
  });

  const handleSave = () => {
    // In a real app, you would save this data to a database
    console.log('Saving blog post:', form);
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
      <FormModal
        visible={true} // This should be controlled by state in a real app
        title="Create Blog Post"
        onSave={handleSave}
        onCancel={() => router.back()}
      >
        <BlogPostForm form={form} setForm={setForm} />
      </FormModal>
    </ScrollView>
  );
}
