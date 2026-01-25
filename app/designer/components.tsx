import React from "react";
import { View, Text, ScrollView, useWindowDimensions, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";

function ComponentsPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const components = [
    {
      name: "Buttons",
      description: "Primary, secondary, and tertiary button styles with various states",
      icon: "touch-app",
      variants: ["Primary", "Secondary", "Tertiary", "Danger"],
    },
    {
      name: "Cards",
      description: "Container components for grouping related content",
      icon: "view-card",
      variants: ["Default", "Elevated", "Outlined"],
    },
    {
      name: "Inputs",
      description: "Text inputs, textareas, and form controls",
      icon: "edit",
      variants: ["Text", "Textarea", "Select", "Checkbox", "Radio"],
    },
    {
      name: "Navigation",
      description: "Sidebars, headers, menus, and navigation components",
      icon: "menu",
      variants: ["Sidebar", "Header", "Breadcrumbs", "Tabs"],
    },
    {
      name: "Modals",
      description: "Dialogs, modals, and overlay components",
      icon: "fullscreen",
      variants: ["Modal", "Dialog", "Drawer", "Popover"],
    },
    {
      name: "Badges",
      description: "Status indicators, labels, and tags",
      icon: "label",
      variants: ["Status", "Label", "Tag", "Chip"],
    },
  ];

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
        <View style={{ marginBottom: 32, paddingTop: 20 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Component Library
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            Reusable components built with consistency and accessibility in mind.
          </Text>
        </View>

        {/* Components List */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Components
          </Text>
          <View style={{ gap: 12 }}>
            {components.map((component, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                  <MaterialIcons name={component.icon as any} size={24} color="#ba9988" style={{ marginRight: 12 }} />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {component.name}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                    marginBottom: 12,
                  }}
                >
                  {component.description}
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {component.variants.map((variant, vIndex) => (
                    <View
                      key={vIndex}
                      style={{
                        backgroundColor: "rgba(186, 153, 136, 0.15)",
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#ba9988",
                          fontWeight: "600",
                        }}
                      >
                        {variant}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Usage Guidelines */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Usage Guidelines
          </Text>
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ gap: 16 }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Consistency
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Use components as designed. Don't modify styles or create custom variations unless absolutely necessary. Consistency improves user experience and maintainability.
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Accessibility
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  All components are built with accessibility in mind. Use proper semantic HTML, ARIA labels, and keyboard navigation support.
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Responsive Design
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Components adapt to different screen sizes. Test on mobile, tablet, and desktop to ensure proper behavior across breakpoints.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Component States */}
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Component States
          </Text>
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ gap: 12 }}>
              {[
                { state: "Default", description: "Normal, unselected state" },
                { state: "Hover", description: "Mouse hover state (desktop)" },
                { state: "Active", description: "Pressed or selected state" },
                { state: "Focus", description: "Keyboard focus state" },
                { state: "Disabled", description: "Non-interactive state" },
                { state: "Loading", description: "Async operation in progress" },
              ].map((item, index) => (
                <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {item.state}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default ComponentsPage;
