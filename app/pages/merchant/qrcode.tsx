import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Share, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { Merchant } from '@/types/merchant';
import { useResponsive } from '@/hooks/useResponsive';
import { logError } from '@/lib/logger';
import { BackButton } from '@/components/navigation/BackButton';

// Mock merchant data
const mockMerchant: Merchant = {
  id: "merchant1",
  userId: "user1",
  name: "Soul Food Kitchen",
  type: "local-shop",
  level: "premier",
  description: "Authentic Southern cuisine",
  qrCodeUrl: "https://bdn.app/merchant/merchant1",
  createdAt: "2024-01-01T00:00:00Z",
  category: "Restaurant",
  isVerified: true,
  isActive: true,
};

export default function QRCodePage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isMobile, isDesktop } = useResponsive();
  const qrValue = mockMerchant.qrCodeUrl || `https://bdn.app/merchant/${mockMerchant.id}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${mockMerchant.name} on BDN! ${qrValue}`,
        url: qrValue,
      });
    } catch (error) {
      logError("Error sharing QR code", error, { merchantId: merchant.id });
    }
  };

  const handleDownload = () => {
    // TODO: Implement QR code download
    alert("QR code download feature coming soon!");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
          alignItems: "center",
        }}
      >
        <View style={{ width: "100%", maxWidth: 900, marginBottom: 24 }}>
          <BackButton 
            textColor="#ffffff"
            iconColor="#ffffff"
            onPress={() => {
              router.push("/pages/merchant/dashboard");
            }}
          />
        </View>
        {isDesktop ? (
          // Desktop: Two-column layout
          <View
            style={{
              flexDirection: "row",
              gap: 32,
              width: "100%",
              maxWidth: 900,
              alignItems: "flex-start",
              alignSelf: "center",
            }}
          >
            {/* Left Column: QR Code */}
            <View style={{ flex: 1, maxWidth: 400 }}>
              <View
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 24,
                  padding: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  aspectRatio: 1,
                  width: "100%",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 8,
                }}
              >
                <QRCode
                  value={qrValue}
                  size={isDesktop ? 320 : 280}
                  color="#000000"
                  backgroundColor="#ffffff"
                />
              </View>
            </View>

            {/* Right Column: Business Info, Actions, Instructions */}
            <View style={{ flex: 1, maxWidth: 400, gap: 24 }}>
              {/* Business Info */}
              <View
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 20,
                  padding: 24,
                  width: "100%",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <View style={{ alignItems: "center", marginBottom: 16 }}>
                  <MaterialIcons name="store" size={32} color="#ba9988" />
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#ffffff",
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  {mockMerchant.name}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.7)",
                    textAlign: "center",
                    marginBottom: 16,
                  }}
                >
                  {mockMerchant.description}
                </Text>
                <View
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.6)",
                      textAlign: "center",
                      marginBottom: 4,
                    }}
                  >
                    QR Code URL
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#ba9988",
                      textAlign: "center",
                      fontFamily: "monospace",
                    }}
                  >
                    {qrValue}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View style={{ width: "100%", gap: 12 }}>
                <TouchableOpacity
                  onPress={handleShare}
                  style={{
                    backgroundColor: "#ba9988",
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <MaterialIcons name="share" size={20} color="#ffffff" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Share QR Code
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDownload}
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <MaterialIcons name="download" size={20} color="#ba9988" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    Download QR Code
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Instructions */}
              <View
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  padding: 20,
                  width: "100%",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#ffffff",
                    marginBottom: 12,
                  }}
                >
                  How to Use
                </Text>
                <View style={{ gap: 8 }}>
                  {[
                    "Display this QR code at your business location",
                    "Customers scan with their phone camera",
                    "They'll be directed to your BDN business profile",
                    "Easy access to your products, hours, and contact info",
                  ].map((instruction, index) => (
                    <View key={index} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
                      <MaterialIcons name="check-circle" size={16} color="#ba9988" style={{ marginTop: 2 }} />
                      <Text
                        style={{
                          fontSize: 14,
                          color: "rgba(255, 255, 255, 0.7)",
                          flex: 1,
                        }}
                      >
                        {instruction}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        ) : (
          // Mobile: Vertical stack (original layout)
          <>
            {/* QR Code Display */}
            <View
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 24,
                padding: 24,
                marginBottom: 32,
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                maxWidth: 400,
                aspectRatio: 1,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <QRCode
                value={qrValue}
                size={isMobile ? 280 : 320}
                color="#000000"
                backgroundColor="#ffffff"
              />
            </View>

            {/* Business Info */}
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 20,
                padding: 24,
                width: "100%",
                maxWidth: 400,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <View style={{ alignItems: "center", marginBottom: 16 }}>
                <MaterialIcons name="store" size={32} color="#ba9988" />
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#ffffff",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                {mockMerchant.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                {mockMerchant.description}
              </Text>
              <View
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "rgba(255, 255, 255, 0.6)",
                    textAlign: "center",
                    marginBottom: 4,
                  }}
                >
                  QR Code URL
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#ba9988",
                    textAlign: "center",
                    fontFamily: "monospace",
                  }}
                >
                  {qrValue}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={{ width: "100%", maxWidth: 400, gap: 12 }}>
              <TouchableOpacity
                onPress={handleShare}
                style={{
                  backgroundColor: "#ba9988",
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <MaterialIcons name="share" size={20} color="#ffffff" />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Share QR Code
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDownload}
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                }}
              >
                <MaterialIcons name="download" size={20} color="#ba9988" />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  Download QR Code
                </Text>
              </TouchableOpacity>
            </View>

            {/* Instructions */}
            <View
              style={{
                backgroundColor: "#474747",
                borderRadius: 16,
                padding: 20,
                width: "100%",
                maxWidth: 400,
                marginTop: 24,
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 12,
                }}
              >
                How to Use
              </Text>
              <View style={{ gap: 8 }}>
                {[
                  "Display this QR code at your business location",
                  "Customers scan with their phone camera",
                  "They'll be directed to your BDN business profile",
                  "Easy access to your products, hours, and contact info",
                ].map((instruction, index) => (
                  <View key={index} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
                    <MaterialIcons name="check-circle" size={16} color="#ba9988" style={{ marginTop: 2 }} />
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.7)",
                        flex: 1,
                      }}
                    >
                      {instruction}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

