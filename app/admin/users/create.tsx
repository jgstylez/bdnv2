import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { PageTitle } from '../../components/header/PageTitle';
import { FormSection } from '../../components/forms/FormSection';
import { UserForm } from '../../components/admin/users/UserForm';
import { FormModal } from '../../components/modals';

export default function CreateUser() {
  const [form, setForm] = useState({
    name: '',
    email: '',
  });

  const handleSave = () => {
    // In a real app, you would save this data to a database
    console.log('Saving user:', form);
    Alert.alert('Success', 'User created successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView>
      <PageTitle title="Create User" />
      <FormSection title="User Details">
        <UserForm form={form} setForm={setForm} />
      </FormSection>
      <FormModal
        visible={true} // This should be controlled by state in a real app
        title="Create User"
        onSave={handleSave}
        onCancel={() => router.back()}
      >
        <UserForm form={form} setForm={setForm} />
      </FormModal>
    </ScrollView>
  );
}
