import React from "react";
import { View, Text, ScrollView, useWindowDimensions, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { typography, spacing } from '@/constants/theme';

function UIDesignPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

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
            UI Design System
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            The "engine" and "interface" of our digital products. This technical manual ensures functional consistency and usability across all applications.
          </Text>
        </View>

        {/* Design Philosophy */}
        <View style={{ marginBottom: 32 }}>
          <View
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <MaterialIcons name="design-services" size={24} color="#ba9988" style={{ marginRight: 12 }} />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                Design Philosophy
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 24,
              }}
            >
              We design for clarity and purpose. Every element serves a function, and every interaction is intentional. Our interface prioritizes user needs while maintaining visual elegance and brand consistency.
            </Text>
          </View>
        </View>

        {/* Grid and Layout */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Grid and Layout
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
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  8px Grid System
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                    marginBottom: 12,
                  }}
                >
                  All spacing, sizing, and layout measurements are based on an 8px base unit for consistency and easy calculation.
                </Text>
                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ba9988",
                        fontFamily: "monospace",
                        marginRight: 12,
                        minWidth: 60,
                      }}
                    >
                      8px
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Base unit (xs spacing)
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ba9988",
                        fontFamily: "monospace",
                        marginRight: 12,
                        minWidth: 60,
                      }}
                    >
                      16px
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Standard spacing (md)
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ba9988",
                        fontFamily: "monospace",
                        marginRight: 12,
                        minWidth: 60,
                      }}
                    >
                      24px
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Section spacing (lg)
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Column System
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Desktop: 12-column grid with consistent gutters. Mobile: Single column with responsive padding. See the Spacing page for detailed grid specifications.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Typography Scales */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Typography Scales
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
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 24,
                marginBottom: 16,
              }}
            >
              Specific pixel sizes, line heights, and weights for consistent text hierarchy across the platform.
            </Text>
            <View style={{ gap: 12 }}>
              {[
                {
                  name: "H1",
                  size: typography.h1.fontSize,
                  lineHeight: typography.h1.lineHeight,
                  weight: "900",
                  usage: "Main page titles, hero headings",
                },
                {
                  name: "H2",
                  size: typography.h2.fontSize,
                  lineHeight: typography.h2.lineHeight,
                  weight: "800",
                  usage: "Section headings, major titles",
                },
                {
                  name: "H3",
                  size: typography.h3.fontSize,
                  lineHeight: typography.h3.lineHeight,
                  weight: "700",
                  usage: "Subsection headings, card titles",
                },
                {
                  name: "H4",
                  size: typography.h4.fontSize,
                  lineHeight: typography.h4.lineHeight,
                  weight: "600",
                  usage: "Small headings, labels",
                },
                {
                  name: "Body",
                  size: typography.body.fontSize,
                  lineHeight: typography.body.lineHeight,
                  weight: "400",
                  usage: "Main content, paragraphs",
                },
                {
                  name: "Caption",
                  size: typography.caption.fontSize,
                  lineHeight: typography.caption.lineHeight,
                  weight: "400",
                  usage: "Small text, captions, metadata",
                },
              ].map((style, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.1)",
                  }}
                >
                  <View style={{ marginBottom: 12 }}>
                    <Text
                      style={{
                        fontSize: style.size,
                        fontWeight: style.weight as any,
                        color: "#ffffff",
                        lineHeight: style.lineHeight,
                        marginBottom: 8,
                      }}
                    >
                      {style.name} - The quick brown fox jumps over the lazy dog
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.5)",
                          marginBottom: 2,
                        }}
                      >
                        Size
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#ba9988",
                          fontFamily: "monospace",
                        }}
                      >
                        {style.size}px
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.5)",
                          marginBottom: 2,
                        }}
                      >
                        Line Height
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#ba9988",
                          fontFamily: "monospace",
                        }}
                      >
                        {style.lineHeight}px
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.5)",
                          marginBottom: 2,
                        }}
                      >
                        Weight
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#ba9988",
                          fontFamily: "monospace",
                        }}
                      >
                        {style.weight}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.6)",
                      lineHeight: 18,
                    }}
                  >
                    {style.usage}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* UI Components */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            UI Components
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 20,
              marginBottom: 16,
            }}
          >
            The "Atomic" parts of our interface. Each component is designed for reusability and consistency.
          </Text>
          <View style={{ gap: 12 }}>
            {[
              {
                name: "Buttons",
                description: "Primary, secondary, ghost, and disabled states with consistent sizing and spacing.",
                variants: ["Primary", "Secondary", "Ghost", "Disabled"],
                icon: "touch-app",
              },
              {
                name: "Inputs",
                description: "Text fields, textareas, checkboxes, radio buttons, and select dropdowns with validation states.",
                variants: ["Text", "Textarea", "Checkbox", "Radio", "Select"],
                icon: "edit",
              },
              {
                name: "Feedback Messages",
                description: "Success, error, warning, and info messages with appropriate colors and icons.",
                variants: ["Success", "Error", "Warning", "Info"],
                icon: "feedback",
              },
              {
                name: "Cards",
                description: "Container components for grouping related content with consistent padding and borders.",
                variants: ["Default", "Elevated", "Outlined"],
                icon: "view-card",
              },
              {
                name: "Navigation",
                description: "Sidebars, headers, breadcrumbs, and tabs for consistent navigation patterns.",
                variants: ["Sidebar", "Header", "Breadcrumbs", "Tabs"],
                icon: "menu",
              },
              {
                name: "Modals & Overlays",
                description: "Dialogs, modals, drawers, and popovers for layered interactions.",
                variants: ["Modal", "Dialog", "Drawer", "Popover"],
                icon: "fullscreen",
              },
            ].map((component, index) => (
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

        {/* Iconography */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Iconography
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
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 24,
                marginBottom: 16,
              }}
            >
              We use Material Icons for consistency across all platforms. Icons should have rounded edges and maintain a consistent visual weight.
            </Text>
            <View style={{ gap: 12 }}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ba9988",
                    marginBottom: 4,
                  }}
                >
                  Icon Set
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Material Icons from @expo/vector-icons. Use the same icon family throughout the application.
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ba9988",
                    marginBottom: 4,
                  }}
                >
                  Sizing
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Standard sizes: 16px (inline), 20px (default), 24px (buttons), 32px (features), 48px (hero). See the Icons page for detailed guidelines.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Interactions */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Interactions
          </Text>
          <View style={{ gap: 12 }}>
            {[
              {
                title: "Hover Effects",
                description: "Subtle background color changes and slight elevation on interactive elements. Use 0.2s transition duration.",
                icon: "mouse",
              },
              {
                title: "Transitions",
                description: "Smooth animations for state changes. Use 0.25s duration for most transitions. Ease-in-out timing function.",
                icon: "animation",
              },
              {
                title: "Loading States",
                description: "Use spinners, skeletons, or progress indicators. Always provide feedback during async operations.",
                icon: "hourglass-empty",
              },
              {
                title: "Touch Targets",
                description: "Minimum 44x44px touch targets for mobile. Ensure adequate spacing between interactive elements.",
                icon: "touch-app",
              },
            ].map((interaction, index) => (
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
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <MaterialIcons name={interaction.icon as any} size={20} color="#ba9988" style={{ marginRight: 12 }} />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {interaction.title}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                    paddingLeft: 32,
                  }}
                >
                  {interaction.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Accessibility */}
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Accessibility (a11y)
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
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 24,
                marginBottom: 16,
              }}
            >
              Design for everyone. Ensure our applications are usable and accessible to all users.
            </Text>
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
                  Color Contrast Ratios
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                    marginBottom: 8,
                  }}
                >
                  Maintain WCAG AA standards:
                </Text>
                <View style={{ gap: 6, paddingLeft: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ba9988",
                        fontFamily: "monospace",
                        marginRight: 12,
                        minWidth: 80,
                      }}
                    >
                      4.5:1
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Normal text (16px and above)
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ba9988",
                        fontFamily: "monospace",
                        marginRight: 12,
                        minWidth: 80,
                      }}
                    >
                      3:1
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Large text (18px+ bold or 24px+ regular)
                    </Text>
                  </View>
                </View>
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
                  Touch Target Sizes
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Minimum 44x44px for all interactive elements on mobile. Ensure adequate spacing (8px minimum) between touch targets.
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
                  Keyboard Navigation
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  All interactive elements must be keyboard accessible. Provide visible focus states with 2px outline using accent color.
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
                  Screen Readers
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 20,
                  }}
                >
                  Use semantic HTML elements, proper ARIA labels, and descriptive alt text for all images and icons.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default UIDesignPage;
