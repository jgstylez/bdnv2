import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { AdminModal } from "../AdminModal";
import { spacing } from '../../../constants/theme';

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  isEditing: boolean;
  onSave: () => void;
  form: any;
  setForm: (form: any) => void;
}

export function UserModal({
  visible,
  onClose,
  isEditing,
  onSave,
  form,
  setForm,
}: UserModalProps) {
  return (
    <AdminModal
      visible={visible}
      onClose={onClose}
      title={isEditing ? "Edit User" : "Create New User"}
      actions={[
        {
          label: "Cancel",
          onPress: onClose,
          variant: "secondary",
        },
        {
          label: isEditing ? "Save" : "Create",
          onPress: onSave,
          variant: "primary",
        },
      ]}
    >
      <View style={{ gap: spacing.lg }}>
        <View>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Name *</Text>
          <TextInput
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
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
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Email *</Text>
          <TextInput
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            keyboardType="email-address"
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
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Phone</Text>
          <TextInput
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
            keyboardType="phone-pad"
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

        {!isEditing && (
          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Password *</Text>
            <TextInput
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              secureTextEntry
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
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>User Type</Text>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {(["consumer", "business", "nonprofit"] as const).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setForm({ ...form, userType: type })}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: form.userType === type ? "#ba9988" : "#232323",
                  borderWidth: 1,
                  borderColor: form.userType === type ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: form.userType === type ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                    textTransform: "capitalize",
                  }}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {isEditing && (
          <>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 }}>Level</Text>
              <TextInput
                value={form.level}
                onChangeText={(text) => setForm({ ...form, level: text })}
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
                {(["active", "suspended"] as const).map((status) => (
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
          </>
        )}
      </View>
    </AdminModal>
  );
}
