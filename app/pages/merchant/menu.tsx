import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Menu, MenuCategory, MenuItem } from "../../../types/menu";

// Mock menu data
const mockMenus: Menu[] = [
  {
    id: "1",
    merchantId: "merchant1",
    name: "Main Menu",
    type: "full",
    isActive: true,
    categories: [
      {
        id: "cat1",
        merchantId: "merchant1",
        name: "Appetizers",
        displayOrder: 1,
        isActive: true,
        items: [
          {
            id: "item1",
            merchantId: "merchant1",
            name: "Fried Green Tomatoes",
            description: "Crispy fried green tomatoes with remoulade sauce",
            price: 8.99,
            currency: "USD",
            category: "Appetizers",
            isAvailable: true,
            dietaryInfo: { vegetarian: true },
            tags: ["popular", "vegetarian"],
            createdAt: "2024-01-15T00:00:00Z",
          },
          {
            id: "item2",
            merchantId: "merchant1",
            name: "Wings",
            description: "10 piece wings with your choice of sauce",
            price: 12.99,
            currency: "USD",
            category: "Appetizers",
            isAvailable: true,
            dietaryInfo: { spicy: true },
            tags: ["popular"],
            createdAt: "2024-01-15T00:00:00Z",
          },
        ],
      },
      {
        id: "cat2",
        merchantId: "merchant1",
        name: "Entrees",
        displayOrder: 2,
        isActive: true,
        items: [
          {
            id: "item3",
            merchantId: "merchant1",
            name: "Soul Food Platter",
            description: "Fried chicken, mac & cheese, collard greens, cornbread",
            price: 24.99,
            currency: "USD",
            category: "Entrees",
            isAvailable: true,
            tags: ["signature"],
            createdAt: "2024-01-15T00:00:00Z",
          },
          {
            id: "item4",
            merchantId: "merchant1",
            name: "BBQ Ribs",
            description: "Slow-cooked ribs with signature sauce",
            price: 32.99,
            currency: "USD",
            category: "Entrees",
            isAvailable: true,
            tags: ["signature"],
            createdAt: "2024-01-15T00:00:00Z",
          },
        ],
      },
      {
        id: "cat3",
        merchantId: "merchant1",
        name: "Desserts",
        displayOrder: 3,
        isActive: true,
        items: [
          {
            id: "item5",
            merchantId: "merchant1",
            name: "Sweet Potato Pie",
            description: "Homemade sweet potato pie with whipped cream",
            price: 6.99,
            currency: "USD",
            category: "Desserts",
            isAvailable: true,
            dietaryInfo: { vegetarian: true },
            createdAt: "2024-01-15T00:00:00Z",
          },
        ],
      },
    ],
    createdAt: "2024-01-15T00:00:00Z",
  },
];

export default function MenuManagement() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [activeMenu, setActiveMenu] = useState<Menu | null>(mockMenus[0]);

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Menu Management
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Manage your restaurant menu and display it on your business page.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ marginBottom: 24, flexDirection: "row", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <TouchableOpacity
            onPress={() => router.push("/pages/merchant/menu/create")}
            style={{
              backgroundColor: "#ba9988",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <MaterialIcons name="add" size={20} color="#ffffff" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Create Menu
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menu List */}
        {mockMenus.length > 0 ? (
          <View style={{ gap: 16 }}>
            {mockMenus.map((menu) => (
              <View
                key={menu.id}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 4 }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "700",
                          color: "#ffffff",
                        }}
                      >
                        {menu.name}
                      </Text>
                      <View
                        style={{
                          backgroundColor: menu.isActive ? "rgba(76, 175, 80, 0.2)" : "rgba(255, 255, 255, 0.1)",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "600",
                            color: menu.isActive ? "#4caf50" : "rgba(255, 255, 255, 0.6)",
                            textTransform: "uppercase",
                          }}
                        >
                          {menu.isActive ? "Active" : "Inactive"}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.6)",
                        marginBottom: 8,
                      }}
                    >
                      {menu.categories.length} categories • {menu.categories.reduce((sum, cat) => sum + cat.items.length, 0)} items
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => router.push(`/pages/merchant/menu/edit?id=${menu.id}`)}
                      style={{
                        backgroundColor: "#232323",
                        padding: 8,
                        borderRadius: 8,
                      }}
                    >
                      <MaterialIcons name="edit" size={20} color="#ba9988" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#232323",
                        padding: 8,
                        borderRadius: 8,
                      }}
                    >
                      <MaterialIcons name="delete" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Menu Preview */}
                <View style={{ gap: 16 }}>
                  {menu.categories.map((category) => (
                    <View key={category.id}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: "#ffffff",
                          marginBottom: 12,
                        }}
                      >
                        {category.name}
                      </Text>
                      <View style={{ gap: 8 }}>
                        {category.items.slice(0, 3).map((item) => (
                          <View
                            key={item.id}
                            style={{
                              backgroundColor: "#232323",
                              borderRadius: 12,
                              padding: 12,
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <View style={{ flex: 1 }}>
                              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    color: "#ffffff",
                                  }}
                                >
                                  {item.name}
                                </Text>
                                {!item.isAvailable && (
                                  <View
                                    style={{
                                      backgroundColor: "rgba(255, 68, 68, 0.2)",
                                      paddingHorizontal: 6,
                                      paddingVertical: 2,
                                      borderRadius: 4,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 10,
                                        fontWeight: "600",
                                        color: "#ff4444",
                                      }}
                                    >
                                      Unavailable
                                    </Text>
                                  </View>
                                )}
                              </View>
                              {item.description && (
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: "rgba(255, 255, 255, 0.6)",
                                    marginBottom: 4,
                                  }}
                                >
                                  {item.description}
                                </Text>
                              )}
                              {item.dietaryInfo && (
                                <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                                  {item.dietaryInfo.vegetarian && (
                                    <View
                                      style={{
                                        backgroundColor: "rgba(76, 175, 80, 0.2)",
                                        paddingHorizontal: 6,
                                        paddingVertical: 2,
                                        borderRadius: 4,
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize: 10,
                                          fontWeight: "600",
                                          color: "#4caf50",
                                        }}
                                      >
                                        V
                                      </Text>
                                    </View>
                                  )}
                                  {item.dietaryInfo.vegan && (
                                    <View
                                      style={{
                                        backgroundColor: "rgba(76, 175, 80, 0.2)",
                                        paddingHorizontal: 6,
                                        paddingVertical: 2,
                                        borderRadius: 4,
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize: 10,
                                          fontWeight: "600",
                                          color: "#4caf50",
                                        }}
                                      >
                                        VG
                                      </Text>
                                    </View>
                                  )}
                                  {item.dietaryInfo.glutenFree && (
                                    <View
                                      style={{
                                        backgroundColor: "rgba(186, 153, 136, 0.2)",
                                        paddingHorizontal: 6,
                                        paddingVertical: 2,
                                        borderRadius: 4,
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize: 10,
                                          fontWeight: "600",
                                          color: "#ba9988",
                                        }}
                                      >
                                        GF
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              )}
                            </View>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "700",
                                color: "#ba9988",
                                marginLeft: 12,
                              }}
                            >
                              ${item.price.toFixed(2)}
                            </Text>
                          </View>
                        ))}
                        {category.items.length > 3 && (
                          <Text
                            style={{
                              fontSize: 12,
                              color: "rgba(255, 255, 255, 0.5)",
                              textAlign: "center",
                              marginTop: 4,
                            }}
                          >
                            +{category.items.length - 3} more items
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 40,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <MaterialIcons name="restaurant-menu" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No menus yet. Create your first menu to display on your business page!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

