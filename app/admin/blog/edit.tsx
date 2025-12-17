import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { PageTitle } from '../../components/header/PageTitle';
import { FormSection } from '../../components/forms/FormSection';
import { BlogPostForm } from '../../components/admin/blog/BlogPostForm';
import { BaseModal, ConfirmModal, FormModal } from '../../components/modals';

// Mock data for a blog post. In a real app, you would fetch this based on the ID.
const MOCK_POST = {
  id: '123',
  title: 'My First Blog Post',
  content: 'This is the content of my first blog post.',
  author: 'John Doe',
};

export default function EditBlogPost() {
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    title: '',
    content: '',
    author: '',
  });
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the blog post data from a database using the id
    console.log(`Fetching blog post with id: ${id}`);
    setForm(MOCK_POST);
  }, [id]);

  const handleUpdate = () => {
    // In a real app, you would update this data in a database
    console.log('Updating blog post:', form);
    Alert.alert('Success', 'Blog post updated successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    // In a real app, you would delete this data from a database
    console.log('Deleting blog post with id:', id);
    setDeleteModalVisible(false);
    Alert.alert('Success', 'Blog post deleted successfully!', [
      { text: 'OK', onPress: () => router.push('/admin/blog') },
    ]);
  };

  return (
    <ScrollView>
      <PageTitle title="Edit Blog Post" />
      <FormSection title="Blog Post Details">
        <BlogPostForm form={form} setForm={setForm} />
      </FormSection>
      <FormModal
        visible={true} // This should be controlled by state in a real app
        title="Edit Blog Post"
        onSave={handleUpdate}
        onCancel={() => router.back()}
        onDelete={handleDelete}
      >
        <BlogPostForm form={form} setForm={setForm} />
      </FormModal>

      <ConfirmModal
        visible={isDeleteModalVisible}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </ScrollView>
  );
}
