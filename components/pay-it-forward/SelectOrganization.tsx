import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Organization } from '@/types/nonprofit';

interface SelectOrganizationProps {
  organization: Organization | null;
  onSelect: () => void;
  onClear: () => void;
}

export const SelectOrganization = ({ organization, onSelect, onClear }: SelectOrganizationProps) => {
  return (
    <View style={{ gap: 24 }}>
      <View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#ffffff",
            marginBottom: 8,
          }}
        >
          Select Organization
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          Choose the organization you'd like to support.
        </Text>
      </View>

      {!organization ? (
        <TouchableOpacity
          onPress={onSelect}
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <MaterialIcons name="search" size={24} color="rgba(255, 255, 255, 0.5)" />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Select an organization
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.5)",
                marginTop: 2,
              }}
            >
              Tap to search and select
            </Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255, 255, 255, 0.5)" />
        </TouchableOpacity>
      ) : (
        <View
          style={{
            backgroundColor: "rgba(71, 71, 71, 0.3)",
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#ba9988",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#ffffff" }}>
              {organization.name.charAt(0)}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: 2,
              }}
            >
              {organization.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              {organization.description}
            </Text>
          </View>
          <TouchableOpacity onPress={onClear} style={{ padding: 4 }}>
            <MaterialIcons name="close" size={18} color="rgba(255, 255, 255, 0.5)" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
