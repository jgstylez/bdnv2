import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, usePathname } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { BulkUploadResult } from '@/types/merchant';
import { useResponsive } from '@/hooks/useResponsive';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

/**
 * Shared Bulk Upload Component
 * Used by both merchant and nonprofit bulk upload flows
 */
export default function BulkUpload() {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, paddingHorizontal } = useResponsive();
  
  // Determine user type from pathname
  const userType = pathname?.includes("nonprofit") ? "nonprofit" : "merchant";
  const productsPath = userType === "nonprofit" ? "/pages/nonprofit/products" : "/pages/merchant/products";
  
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0].name);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick file");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert("Error", "Please select a file first");
      return;
    }

    setUploading(true);
    // TODO: Upload file to API with userType context
    setTimeout(() => {
      setUploading(false);
      setUploadResult({
        total: 100,
        successful: 95,
        failed: 5,
        errors: [
          { row: 10, product: "Product A", error: "Invalid price format" },
          { row: 23, product: "Product B", error: "Missing required field: name" },
          { row: 45, product: "Product C", error: "Invalid SKU" },
          { row: 67, product: "Product D", error: "Category not found" },
          { row: 89, product: "Product E", error: "Duplicate SKU" },
        ],
      });
    }, 2000);
  };

  const downloadTemplate = () => {
    // TODO: Generate and download CSV template
    Alert.alert("Template", "CSV template would be downloaded here");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.bg }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: Platform.OS === "web" ? spacing.xl : 36,
          paddingBottom: spacing["4xl"],
        }}
      >
        <View>
          <Text
            style={{
              fontSize: typography.fontSize["3xl"],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.sm,
            }}
          >
            Bulk Product Upload
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              marginBottom: spacing["2xl"],
            }}
          >
            Upload multiple products at once using a CSV or Excel file.
          </Text>
        </View>

        {/* Instructions */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border.light,
            marginBottom: spacing["2xl"],
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.lg,
            }}
          >
            Instructions
          </Text>
          <View style={{ gap: spacing.md }}>
            {[
              "Download the CSV template below",
              "Fill in your product information",
              "Upload the completed file",
              "Review and confirm the upload results",
            ].map((instruction, index) => (
              <View key={index} style={{ flexDirection: "row", gap: spacing.md }}>
                <MaterialIcons name="check-circle" size={20} color={colors.status.success} />
                <Text style={{ fontSize: typography.fontSize.base, color: colors.text.secondary, flex: 1 }}>
                  {instruction}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Template Download */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border.light,
            marginBottom: spacing["2xl"],
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Download Template
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              marginBottom: spacing.lg,
            }}
          >
            Use our CSV template to ensure your file format is correct.
          </Text>
          <TouchableOpacity
            onPress={downloadTemplate}
            style={{
              backgroundColor: colors.accent,
              borderRadius: borderRadius.md,
              padding: spacing.lg,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.sm,
            }}
          >
            <MaterialIcons name="download" size={20} color={colors.text.primary} />
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text.primary,
              }}
            >
              Download CSV Template
            </Text>
          </TouchableOpacity>
        </View>

        {/* File Upload */}
        <View
          style={{
            backgroundColor: colors.secondary.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border.light,
            marginBottom: spacing["2xl"],
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Upload File
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              marginBottom: spacing.lg,
            }}
          >
            Supported formats: CSV, XLS, XLSX (Max 10MB)
          </Text>

          {selectedFile ? (
            <View
              style={{
                backgroundColor: colors.background.primary,
                borderRadius: borderRadius.md,
                padding: spacing.lg,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: spacing.lg,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 }}>
                <MaterialIcons name="description" size={24} color={colors.accent} />
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.text.primary,
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {selectedFile}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedFile(null)}>
                <MaterialIcons name="close" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handlePickFile}
              style={{
                backgroundColor: colors.background.primary,
                borderRadius: borderRadius.md,
                padding: spacing["4xl"],
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: colors.accentBorderLight,
                alignItems: "center",
                marginBottom: spacing.lg,
              }}
            >
              <MaterialIcons name="cloud-upload" size={48} color={colors.accentBorderLight} />
              <Text
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.accent,
                  marginTop: spacing.md,
                }}
              >
                Select File
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.tertiary,
                  marginTop: spacing.xs,
                }}
              >
                CSV, XLS, or XLSX
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleUpload}
            disabled={!selectedFile || uploading}
            style={{
              backgroundColor: selectedFile && !uploading ? colors.accent : colors.accentLight,
              borderRadius: borderRadius.md,
              padding: spacing.lg,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.sm,
            }}
          >
            {uploading ? (
              <>
                <MaterialIcons name="hourglass-empty" size={20} color={colors.text.primary} />
                <Text
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                  }}
                >
                  Uploading...
                </Text>
              </>
            ) : (
              <>
                <MaterialIcons name="upload" size={20} color={colors.text.primary} />
                <Text
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                  }}
                >
                  Upload Products
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Upload Results */}
        {uploadResult && (
          <View
            style={{
              backgroundColor: colors.secondary.bg,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
                marginBottom: spacing.lg,
              }}
            >
              Upload Results
            </Text>

            <View style={{ flexDirection: "row", gap: spacing.lg, marginBottom: spacing.xl }}>
              <View style={{ flex: 1, backgroundColor: colors.background.primary, borderRadius: borderRadius.md, padding: spacing.lg }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary, marginBottom: spacing.xs }}>
                  Total
                </Text>
                <Text style={{ fontSize: typography.fontSize["3xl"], fontWeight: typography.fontWeight.bold, color: colors.text.primary }}>
                  {uploadResult.total}
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.background.primary, borderRadius: borderRadius.md, padding: spacing.lg }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary, marginBottom: spacing.xs }}>
                  Successful
                </Text>
                <Text style={{ fontSize: typography.fontSize["3xl"], fontWeight: typography.fontWeight.bold, color: colors.status.success }}>
                  {uploadResult.successful}
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.background.primary, borderRadius: borderRadius.md, padding: spacing.lg }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary, marginBottom: spacing.xs }}>
                  Failed
                </Text>
                <Text style={{ fontSize: typography.fontSize["3xl"], fontWeight: typography.fontWeight.bold, color: colors.status.error }}>
                  {uploadResult.failed}
                </Text>
              </View>
            </View>

            {uploadResult.errors.length > 0 && (
              <View>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text.primary,
                    marginBottom: spacing.md,
                  }}
                >
                  Errors ({uploadResult.errors.length})
                </Text>
                <View style={{ gap: spacing.sm }}>
                  {uploadResult.errors.map((error, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: colors.background.primary,
                        borderRadius: borderRadius.sm,
                        padding: spacing.md,
                        flexDirection: "row",
                        gap: spacing.md,
                      }}
                    >
                      <MaterialIcons name="error" size={20} color={colors.status.error} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: typography.fontSize.sm, color: colors.text.tertiary, marginBottom: 2 }}>
                          Row {error.row}: {error.product}
                        </Text>
                        <Text style={{ fontSize: typography.fontSize.base, color: colors.status.error }}>{error.error}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

