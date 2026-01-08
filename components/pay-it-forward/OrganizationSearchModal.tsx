import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Organization } from '@/types/nonprofit';

interface OrganizationSearchModalProps {
  visible: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredOrganizations: Organization[];
  onSelectOrganization: (organizationId: string) => void;
}

export const OrganizationSearchModal = (props: OrganizationSearchModalProps) => {
  const { 
    visible, 
    onClose, 
    searchQuery, 
    setSearchQuery, 
    filteredOrganizations, 
    onSelectOrganization 
  } = props;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "#232323", padding: 24, paddingTop: 48 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            Select an Organization
          </Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 12,
            padding: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <MaterialIcons name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name or description"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            style={{
              flex: 1,
              color: "#ffffff",
              fontSize: 16,
            }}
          />
        </View>

        <FlatList
          data={filteredOrganizations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSelectOrganization(item.id)}
              style={{
                backgroundColor: "#474747",
                borderRadius: 12,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "#ba9988",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "700", color: "#ffffff" }}>
                  {item.name.charAt(0)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 4,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                  numberOfLines={1}
                >
                  {item.description}
                </Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", paddingVertical: 64 }}>
              <MaterialIcons name="handshake" size={48} color="rgba(255, 255, 255, 0.3)" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.6)",
                  marginTop: 16,
                }}
              >
                No organizations found
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.5)",
                  marginTop: 8,
                }}
              >
                Try a different search term.
              </Text>
            </View>
          )}
        />
      </View>
    </Modal>
  );
};
