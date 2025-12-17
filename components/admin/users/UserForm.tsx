import React from 'react';
import { View } from 'react-native';
import { FormInput } from '../../../forms';

interface UserFormProps {
  form: any;
  setForm: (form: any) => void;
}

export function UserForm({ form, setForm }: UserFormProps) {
  return (
    <View style={{ gap: 16 }}>
      <FormInput
        label="Name"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        placeholder="Enter user's name"
      />
      <FormInput
        label="Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        placeholder="Enter user's email"
        keyboardType="email-address"
      />
    </View>
  );
}
