import React from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { AdminModal } from "../AdminModal";
import { CarouselItem } from "../../types/admin";
import { spacing } from "../../constants/theme";

interface CarouselModalProps {
  visible: boolean;
  onClose: () => void;
  isEditing: boolean;
  onSave: () => void;
  form: any;
  setForm: (form: any) => void;
}

export function CarouselModal({
  visible,
  onClose,
  isEditing,
  onSave,
  form,
  setForm,
}: CarouselModalProps) {
  return (
    <AdminModal
      visible={visible}
      onClose={onClose}
      title={isEditing ? "Edit Carousel Item" : "Create Carousel Item"}
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
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Image URL *</Text>
            <TextInput
              value={form.imageUrl}
              onChangeText={(text) => setForm({ ...form, imageUrl: text })}
              keyboardType="url"
              placeholder="https://example.com/image.jpg"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Title</Text>
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

          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Description</Text>
            <TextInput
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              multiline
              numberOfLines={4}
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

          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Link</Text>
            <TextInput
              value={form.link}
              onChangeText={(text) => setForm({ ...form, link: text })}
              placeholder="/pages/search"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Link Text</Text>
            <TextInput
              value={form.linkText}
              onChangeText={(text) => setForm({ ...form, linkText: text })}
              placeholder="Explore Now"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
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
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Display Order</Text>
            <TextInput
              value={form.displayOrder.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 1;
                setForm({ ...form, displayOrder: num });
              }}
              keyboardType="numeric"
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
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Active</Text>
            <TouchableOpacity
              onPress={() => setForm({ ...form, isActive: !form.isActive })}
              style={{
                width: 50,
                height: 30,
                borderRadius: 15,
                backgroundColor: form.isActive ? "#4caf50" : "#474747",
                justifyContent: "center",
                paddingHorizontal: 4,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#ffffff",
                  transform: [{ translateX: form.isActive ? 20 : 0 }],
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AdminModal>
  );
}
