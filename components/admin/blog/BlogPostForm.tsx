import React from 'react';
import { View, Text } from 'react-native';
import { FormInput, FormTextArea } from '../../../forms';

interface BlogPostFormProps {
  form: any;
  setForm: (form: any) => void;
}

export function BlogPostForm({ form, setForm }: BlogPostFormProps) {
  return (
    <View style={{ gap: 16 }}>
      <FormInput
        label="Title"
        value={form.title}
        onChangeText={(text) => setForm({ ...form, title: text })}
        placeholder="Enter post title"
      />
      <FormTextArea
        label="Content"
        value={form.content}
        onChangeText={(text) => setForm({ ...form, content: text })}
        placeholder="Write your blog post content here..."
        numberOfLines={10}
      />
      <FormInput
        label="Author"
        value={form.author}
        onChangeText={(text) => setForm({ ...form, author: text })}
        placeholder="Enter author name"
      />
    </View>
  );
}
