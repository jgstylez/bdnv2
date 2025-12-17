import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { MenuCategory, MenuItem } from '@/types/menu';

export default function CreateMenu() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobile = width < 768;
  const [menuName, setMenuName] = useState("");
  const [menuType, setMenuType] = useState<"full" | "breakfast" | "lunch" | "dinner" | "brunch" | "happy-hour" | "dessert" | "drinks" | "custom">("full");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const menuTypes = [
    { value: "full", label: "Full Menu" },
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "brunch", label: "Brunch" },
    { value: "happy-hour", label: "Happy Hour" },
    { value: "dessert", label: "Dessert" },
    { value: "drinks", label: "Drinks" },
    { value: "custom", label: "Custom" },
  ];

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory: MenuCategory = {
      id: `cat-${Date.now()}`,
      merchantId: "merchant1",
      name: newCategoryName.trim(),
      displayOrder: categories.length + 1,
      isActive: true,
      items: [],
    };
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId));
  };

  const handleSave = () => {
    if (!menuName.trim() || categories.length === 0) {
      alert("Please provide a menu name and at least one category");
      return;
    }
    // TODO: Save to API
    alert("Menu created successfully!");
    router.back();
  };

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
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Create Menu
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 24,
            }}
          >
            Set up your restaurant menu to display on your business page.
          </Text>
        </View>

        {/* Menu Basic Info */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            marginBottom: 24,
            gap: 20,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: 8,
              }}
            >
              Menu Name <Text style={{ color: "#ff4444" }}>*</Text>
            </Text>
            <TextInput
              value={menuName}
              onChangeText={setMenuName}
              placeholder="Main Menu, Dinner Menu, etc."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 16,
                color: "#ffffff",
                fontSize: 14,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            />
          </View>

          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: 8,
              }}
            >
              Menu Type
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {menuTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => setMenuType(type.value as any)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 20,
                    backgroundColor: menuType === type.value ? "#ba9988" : "rgba(186, 153, 136, 0.15)",
                    borderWidth: 1,
                    borderColor: menuType === type.value ? "#ba9988" : "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: menuType === type.value ? "#ffffff" : "#ba9988",
                    }}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: 8,
              }}
            >
              Description (Optional)
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description of this menu..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 16,
                color: "#ffffff",
                fontSize: 14,
                minHeight: 80,
                textAlignVertical: "top",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            />
          </View>
        </View>

        {/* Categories */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Menu Categories
          </Text>

          {/* Add Category */}
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
            <TextInput
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="Category name (e.g., Appetizers, Entrees)"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={{
                flex: 1,
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 16,
                color: "#ffffff",
                fontSize: 14,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
              onSubmitEditing={addCategory}
            />
            <TouchableOpacity
              onPress={addCategory}
              style={{
                backgroundColor: "#ba9988",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="add" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Categories List */}
          {categories.length > 0 ? (
            <View style={{ gap: 12 }}>
              {categories.map((category, index) => (
                <View
                  key={category.id}
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {category.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      {category.items.length} items • Order: {category.displayOrder}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => router.push(`/pages/merchant/menu/category?id=${category.id}&menuId=temp`)}
                      style={{
                        backgroundColor: "#474747",
                        padding: 8,
                        borderRadius: 8,
                      }}
                    >
                      <MaterialIcons name="edit" size={20} color="#ba9988" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteCategory(category.id)}
                      style={{
                        backgroundColor: "#474747",
                        padding: 8,
                        borderRadius: 8,
                      }}
                    >
                      <MaterialIcons name="delete" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={{
                backgroundColor: "#232323",
                borderRadius: 12,
                padding: 40,
                alignItems: "center",
              }}
            >
              <MaterialIcons name="category" size={48} color="rgba(186, 153, 136, 0.5)" />
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "center",
                  marginTop: 16,
                }}
              >
                No categories yet. Add categories to organize your menu items.
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              flex: 1,
              paddingVertical: 16,
              borderRadius: 12,
              backgroundColor: "#232323",
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={{
              flex: 1,
              paddingVertical: 16,
              borderRadius: 12,
              backgroundColor: "#ba9988",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Create Menu
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

