import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CarouselItem } from '../../../types/admin';
import { colors } from '../../../constants/theme';

interface CarouselListProps {
  items: CarouselItem[];
  onEdit: (item: CarouselItem) => void;
  onDelete: (item: CarouselItem) => void;
  onToggleActive: (item: CarouselItem) => void;
}

export function CarouselList({
  items,
  onEdit,
  onDelete,
  onToggleActive,
}: CarouselListProps) {
  return (
    <View style={{ gap: 12 }}>
      {items.map((item) => (
        <View
          key={item.id}
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: item.isActive ? "rgba(76, 175, 80, 0.3)" : "rgba(186, 153, 136, 0.2)",
            opacity: item.isActive ? 1 : 0.6,
          }}
        >
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View
              style={{
                width: 120,
                height: 80,
                borderRadius: 12,
                backgroundColor: "#232323",
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: "rgba(255, 255, 255, 0.5)",
                  textAlign: "center",
                  padding: 8,
                }}
              >
                Image Preview
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  {item.title || "Untitled"}
                </Text>
                <View
                  style={{
                    backgroundColor: item.isActive ? "rgba(76, 175, 80, 0.2)" : "rgba(255, 255, 255, 0.1)",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "600",
                      color: item.isActive ? "#4caf50" : "rgba(255, 255, 255, 0.5)",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </Text>
                </View>
              </View>
              {item.description && (
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 8,
                  }}
                >
                  {item.description}
                </Text>
              )}
              <Text
                style={{
                  fontSize: 11,
                  color: "rgba(255, 255, 255, 0.5)",
                  marginBottom: 12,
                }}
              >
                Order: {item.displayOrder} • Link: {item.link || "None"}
              </Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                <TouchableOpacity
                  onPress={() => onEdit(item)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: "#232323",
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: "#ba9988",
                    }}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onToggleActive(item)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: item.isActive ? "rgba(255, 68, 68, 0.2)" : "rgba(76, 175, 80, 0.2)",
                    borderWidth: 1,
                    borderColor: item.isActive ? "#ff4444" : "#4caf50",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: item.isActive ? "#ff4444" : "#4caf50",
                    }}
                  >
                    {item.isActive ? "Deactivate" : "Activate"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDelete(item)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: "rgba(255, 68, 68, 0.2)",
                    borderWidth: 1,
                    borderColor: "#ff4444",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: "#ff4444",
                    }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
