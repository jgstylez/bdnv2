import React, { useState } from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NavigationProps {
  includeSafeAreaPadding?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ includeSafeAreaPadding = false }) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isMobile = width < 768;
  const isDesktop = width >= 1024 && Platform.OS === "web";
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/public_pages/about" },
    { label: "Features", href: "/public_pages/features" },
    { label: "Community", href: "/public_pages/community" },
    { label: "Contact", href: "/public_pages/contact" },
  ];

  const topPadding = includeSafeAreaPadding && isMobile 
    ? insets.top + 16 
    : isDesktop 
    ? 20 
    : 16;

  return (
    <View
      style={{
        backgroundColor: "#000000",
        borderBottomWidth: 1,
        borderBottomColor: "#474747",
        paddingHorizontal: isMobile ? 20 : 40,
        paddingTop: topPadding,
        paddingBottom: isMobile ? 16 : 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,
          alignSelf: "center",
          width: "100%",
        }}
      >
        {/* Logo */}
        <TouchableOpacity onPress={() => router.push("/")}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: "#ba9988",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#ffffff" }}>B</Text>
            </View>
            <Text
              style={{
                fontSize: isMobile ? 20 : 24,
                fontWeight: "800",
                color: "#ffffff",
                letterSpacing: -0.5,
              }}
            >
              BDN
            </Text>
            </View>
            {!isMobile && (
              <View
                style={{
                  backgroundColor: "rgba(186, 153, 136, 0.15)",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: "#ba9988",
                    fontWeight: "600",
                    letterSpacing: 0.5,
                  }}
                >
                  EDUCATE • EQUIP • EMPOWER
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Desktop Navigation */}
        {!isMobile && (
          <View
            style={{
              flexDirection: "row",
              gap: 32,
              alignItems: "center",
            }}
          >
            {navItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => router.push(item.href as any)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#ffffff",
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              style={{
                backgroundColor: "#ba9988",
                paddingHorizontal: 24,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <TouchableOpacity
            onPress={() => setMenuOpen(!menuOpen)}
            style={{
              padding: 8,
            }}
          >
            <View
              style={{
                width: 24,
                height: 2,
                backgroundColor: "#ffffff",
                marginBottom: 6,
              }}
            />
            <View
              style={{
                width: 24,
                height: 2,
                backgroundColor: "#ffffff",
                marginBottom: 6,
              }}
            />
            <View
              style={{
                width: 24,
                height: 2,
                backgroundColor: "#ffffff",
              }}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Mobile Menu */}
      {isMobile && menuOpen && (
        <View
          style={{
            marginTop: 20,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: "#474747",
          }}
        >
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => {
                router.push(item.href as any);
                setMenuOpen(false);
              }}
              style={{
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: "#ffffff",
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => {
              router.push("/(auth)/signup");
              setMenuOpen(false);
            }}
            style={{
              backgroundColor: "#ba9988",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
              marginTop: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Get Started
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/(auth)/login");
              setMenuOpen(false);
            }}
            style={{
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: "#474747",
              borderRadius: 8,
              marginTop: 12,
              alignItems: "center",
              backgroundColor: "rgba(71, 71, 71, 0.3)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

