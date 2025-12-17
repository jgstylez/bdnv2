import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { PageTitle } from '../../components/header/PageTitle';
import { FormSection } from '../../components/forms/FormSection';
import { UserForm } from '../../components/admin/users/UserForm';
import { ConfirmModal, FormModal } from '../../components/modals';

// Mock data for a user. In a real app, you would fetch this based on the ID.
const MOCK_USER = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
};

export default function EditUser() {
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
  });
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the user data from a database using the id
    console.log(`Fetching user with id: ${id}`);
    setForm(MOCK_USER);
  }, [id]);

  const handleUpdate = () => {
    // In a real app, you would update this data in a database
    console.log('Updating user:', form);
    Alert.alert('Success', 'User updated successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    // In a real app, you would delete this data from a database
    console.log('Deleting user with id:', id);
    setDeleteModalVisible(false);
    Alert.alert('Success', 'User deleted successfully!', [
      { text: 'OK', onPress: () => router.push('/admin/users') },
    ]);
  };

  return (
    <ScrollView>
      <PageTitle title="Edit User" />
      <FormSection title="User Details">
        <UserForm form={form} setForm={setForm} />
      </FormSection>
      <FormModal
        visible={true} // This should be controlled by state in a real app
        title="Edit User"
        onSave={handleUpdate}
        onCancel={() => router.back()}
        onDelete={handleDelete}
      >
        <UserForm form={form} setForm={setForm} />
      </FormModal>

      <ConfirmModal
        visible={isDeleteModalVisible}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </ScrollView>
  );
}
