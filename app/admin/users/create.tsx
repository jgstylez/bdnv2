import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { PageTitle } from '@/components/header/PageTitle';
import { FormSection } from '@/components/forms/FormSection';
import { UserForm } from '@/components/admin/users/UserForm';
import Button from '@/components/Button';
import { logger } from '@/lib/logger';

export default function CreateUser() {
  const [form, setForm] = useState({
    name: '',
    email: '',
  });

  const handleSave = () => {
    // In a real app, you would save this data to a database
    logger.info('Saving user', { form });
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
      <View style={{ flexDirection: 'row', gap: 8, padding: 16 }}>
        <Button onPress={handleSave}>Create User</Button>
        <Button variant="outline" onPress={() => router.back()}>Cancel</Button>
      </View>
    </ScrollView>
  );
}
