import React from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { AdminModal } from "../AdminModal";
import { ContentManagementItem } from '../../../types/admin';
import { spacing } from '../../../constants/theme';

interface ContentModalProps {
  visible: boolean;
  onClose: () => void;
  isEditing: boolean;
  onSave: () => void;
  form: any;
  setForm: (form: any) => void;
}

export function ContentModal({
  visible,
  onClose,
  isEditing,
  onSave,
  form,
  setForm,
}: ContentModalProps) {
  return (
    <AdminModal
      visible={visible}
      onClose={onClose}
      title={isEditing ? "Edit Content" : "Create Content"}
      actions={[
        {
          label: "Cancel",
          onPress: onClose,
          variant: "secondary",
        },
        {
          label: "Save",
          onPress: onSave,
          variant: "primary",
        },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: spacing.lg }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Type</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {(["blog", "video", "dynamic"] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setForm({ ...form, type })}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                    backgroundColor: form.type === type ? "#ba9988" : "#232323",
                    borderWidth: 1,
                    borderColor: form.type === type ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: form.type === type ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                      textTransform: "capitalize",
                    }}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Title *</Text>
            <TextInput
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 14,
                color: "#ffffff",
                fontSize: 14,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            />
          </View>

          {form.type === "blog" && (
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Content</Text>
              <TextInput
                value={form.content}
                onChangeText={(text) => setForm({ ...form, content: text })}
                multiline
                numberOfLines={10}
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 12,
                  padding: 14,
                  color: "#ffffff",
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  textAlignVertical: "top",
                }}
              />
            </View>
          )}

          {form.type === "video" && (
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Video URL</Text>
              <TextInput
                value={form.videoUrl}
                onChangeText={(text) => setForm({ ...form, videoUrl: text })}
                keyboardType="url"
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 12,
                  padding: 14,
                  color: "#ffffff",
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              />
            </View>
          )}

          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Author *</Text>
            <TextInput
              value={form.author}
              onChangeText={(text) => setForm({ ...form, author: text })}
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 14,
                color: "#ffffff",
                fontSize: 14,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Status</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {(["published", "draft", "archived"] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setForm({ ...form, status })}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                    backgroundColor: form.status === status ? "#ba9988" : "#232323",
                    borderWidth: 1,
                    borderColor: form.status === status ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: form.status === status ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                      textTransform: "capitalize",
                    }}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </AdminModal>
  );
}
