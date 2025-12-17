import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Menu, MenuCategory, MenuItem } from '../types/menu';

interface MenuDisplayProps {
  menu: Menu;
}

export const MenuDisplay: React.FC<MenuDisplayProps> = ({ menu }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(menu.categories.map((cat) => cat.id)));

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getDietaryBadge = (item: MenuItem) => {
    if (!item.dietaryInfo) return null;
    const badges = [];
    if (item.dietaryInfo.vegetarian) badges.push({ label: "V", color: "#4caf50" });
    if (item.dietaryInfo.vegan) badges.push({ label: "VG", color: "#4caf50" });
    if (item.dietaryInfo.glutenFree) badges.push({ label: "GF", color: "#ba9988" });
    if (item.dietaryInfo.dairyFree) badges.push({ label: "DF", color: "#2196f3" });
    if (item.dietaryInfo.nutFree) badges.push({ label: "NF", color: "#ff9800" });
    if (item.dietaryInfo.spicy) badges.push({ label: "🌶️", color: "#ff4444" });
    return badges;
  };

  return (
    <View style={{ gap: 24 }}>
      {menu.categories
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          return (
            <View
              key={category.id}
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <TouchableOpacity
                onPress={() => toggleCategory(category.id)}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: isExpanded ? 16 : 0,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 4,
                    }}
                  >
                    {category.name}
                  </Text>
                  {category.description && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      {category.description}
                    </Text>
                  )}
                </View>
                <MaterialIcons
                  name={isExpanded ? "expand-less" : "expand-more"}
                  size={24}
                  color="rgba(255, 255, 255, 0.7)"
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={{ gap: 16 }}>
                  {category.items
                    .filter((item) => item.isAvailable)
                    .map((item) => {
                      const dietaryBadges = getDietaryBadge(item);
                      return (
                        <View
                          key={item.id}
                          style={{
                            backgroundColor: "#232323",
                            borderRadius: 12,
                            padding: 16,
                          }}
                        >
                          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <View style={{ flex: 1 }}>
                              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    color: "#ffffff",
                                  }}
                                >
                                  {item.name}
                                </Text>
                                {dietaryBadges && dietaryBadges.length > 0 && (
                                  <View style={{ flexDirection: "row", gap: 4, flexWrap: "wrap" }}>
                                    {dietaryBadges.map((badge, idx) => (
                                      <View
                                        key={idx}
                                        style={{
                                          backgroundColor: `${badge.color}20`,
                                          paddingHorizontal: 6,
                                          paddingVertical: 2,
                                          borderRadius: 4,
                                        }}
                                      >
                                        <Text
                                          style={{
                                            fontSize: 10,
                                            fontWeight: "600",
                                            color: badge.color,
                                          }}
                                        >
                                          {badge.label}
                                        </Text>
                                      </View>
                                    ))}
                                  </View>
                                )}
                              </View>
                              {item.description && (
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: "rgba(255, 255, 255, 0.7)",
                                    lineHeight: 20,
                                    marginBottom: 8,
                                  }}
                                >
                                  {item.description}
                                </Text>
                              )}
                              {item.allergens && item.allergens.length > 0 && (
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                                  <MaterialIcons name="warning" size={14} color="#ff9800" />
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      color: "#ff9800",
                                    }}
                                  >
                                    Contains: {item.allergens.join(", ")}
                                  </Text>
                                </View>
                              )}
                              {item.calories && (
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: "rgba(255, 255, 255, 0.5)",
                                    marginTop: 4,
                                  }}
                                >
                                  {item.calories} calories
                                </Text>
                              )}
                            </View>
                            <Text
                              style={{
                                fontSize: 18,
                                fontWeight: "700",
                                color: "#ba9988",
                                marginLeft: 16,
                              }}
                            >
                              ${item.price.toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  {category.items.filter((item) => item.isAvailable).length === 0 && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.5)",
                        textAlign: "center",
                        paddingVertical: 20,
                      }}
                    >
                      No items available in this category
                    </Text>
                  )}
                </View>
              )}
            </View>
          );
        })}
    </View>
  );
};

