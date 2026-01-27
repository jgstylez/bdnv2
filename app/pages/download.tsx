/**
 * Digital Product Download/Preview Page
 * 
 * Handles viewing and downloading digital products within the app
 * Supports PDFs, images, videos, and other file types
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useResponsive } from "@/hooks/useResponsive";
import { colors, spacing, borderRadius, typography } from "@/constants/theme";
import { BackButton } from "@/components/navigation/BackButton";
import { API_CONFIG } from "@/lib/config";
import { isMockUrl, getMockDownloadUrl } from "@/lib/mock-downloads";
import { getMockProduct } from "@/data/mocks/products";

type FileType = "pdf" | "image" | "video" | "document" | "unknown";

export default function DownloadPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    token?: string;
    url?: string;
    productName?: string;
    productId?: string;
  }>();
  const { paddingHorizontal } = useResponsive();
  const webViewRef = useRef<WebView>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<FileType>("unknown");
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isMockData, setIsMockData] = useState(false);

  // Determine download URL
  // Priority: url param > mock token resolution > real token API endpoint > productId lookup
  let downloadUrl: string | undefined;
  
  // First, check if URL is provided directly (highest priority)
  if (params.url) {
    downloadUrl = params.url;
  } else if (params.token) {
    // Check if it's a mock token (starts with "mock-token-")
    if (params.token.startsWith("mock-token-")) {
      // Extract product ID from mock token and get mock URL
      const productIdMatch = params.token.match(/mock-token-(.+?)-/);
      if (productIdMatch && productIdMatch[1]) {
        const product = getMockProduct(productIdMatch[1]);
        if (product) {
          downloadUrl = getMockDownloadUrl(product);
        } else if (params.productId) {
          // Try productId as fallback
          const productById = getMockProduct(params.productId);
          if (productById) {
            downloadUrl = getMockDownloadUrl(productById);
          }
        }
      }
      // If still no URL, don't try API endpoint for mock tokens
      if (!downloadUrl) {
        // Use productId if available
        if (params.productId) {
          const product = getMockProduct(params.productId);
          if (product) {
            downloadUrl = getMockDownloadUrl(product);
          }
        }
      }
    } else {
      // Real token - use API endpoint
      downloadUrl = `${API_CONFIG.baseURL}/api/downloads/${params.token}`;
    }
  } else if (params.productId) {
    // Try to get product and use mock URL
    const product = getMockProduct(params.productId);
    if (product) {
      downloadUrl = getMockDownloadUrl(product);
    }
  }

  const productName = params.productName || "Digital Product";

  // Detect file type from URL and check if it's mock data
  React.useEffect(() => {
    // Reset states when URL changes
    setLoading(true);
    setError(null);
    
    if (!downloadUrl) {
      setError("No download URL provided");
      setLoading(false);
      return;
    }

    // Check if this is mock data
    setIsMockData(isMockUrl(downloadUrl) || (params.token?.startsWith("mock-token-") ?? false));

    const url = downloadUrl.toLowerCase();
    if (url.includes(".pdf") || url.includes("application/pdf") || url.includes("pdf.js")) {
      setFileType("pdf");
    } else if (
      url.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i) ||
      url.includes("image/") ||
      url.includes("unsplash.com")
    ) {
      setFileType("image");
    } else if (
      url.match(/\.(mp4|mov|avi|mkv|webm|m4v)$/i) ||
      url.includes("video/") ||
      url.includes("commondatastorage.googleapis.com")
    ) {
      setFileType("video");
    } else if (
      url.match(/\.(doc|docx|xls|xlsx|ppt|pptx|txt|rtf)$/i) ||
      url.includes("application/msword") ||
      url.includes("application/vnd")
    ) {
      setFileType("document");
    } else {
      setFileType("unknown");
    }
  }, [downloadUrl, params.token]);

  // Timeout ref to clear timeout if component unmounts
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleLoadStart = () => {
    setLoading(true);
    setError(null);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a timeout to prevent infinite loading
    // If content doesn't load within 30 seconds, show error
    timeoutRef.current = setTimeout(() => {
      setError("Content is taking too long to load. Please check your connection and try again.");
      setLoading(false);
    }, 30000);
  };

  const handleLoadEnd = () => {
    // Clear timeout on successful load
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setLoading(false);
  };

  const handleLoad = () => {
    // Content loaded successfully
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setLoading(false);
    setError(null);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("WebView error:", nativeEvent);
    
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Always clear loading state on error
    setLoading(false);
    
    // Check if it's an API error response
    if (nativeEvent.url && nativeEvent.url.includes('/api/downloads/')) {
      // If it's a mock token, try to use the fallback URL
      if (params.token?.startsWith("mock-token-")) {
        const productIdMatch = params.token.match(/mock-token-(.+?)-/);
        if (productIdMatch && productIdMatch[1]) {
          const product = getMockProduct(productIdMatch[1]);
          if (product) {
            // Don't show error, just use the mock URL directly
            // The URL should already be set correctly from the initial logic
            return;
          }
        }
      }
      setError("Unable to access download. The link may have expired or you may not have permission.");
    } else {
      setError("Failed to load content. Please try again.");
    }
  };

  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    if (nativeEvent.statusCode >= 400) {
      if (nativeEvent.statusCode === 403) {
        setError("You don't have permission to access this download.");
      } else if (nativeEvent.statusCode === 404) {
        setError("Download not found. The link may have expired.");
      } else if (nativeEvent.statusCode === 410) {
        setError("This download link has expired.");
      } else {
        setError(`Unable to load content (Error ${nativeEvent.statusCode}).`);
      }
      setLoading(false);
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  const handleDownload = () => {
    if (!downloadUrl) return;

    // For web, create a download link
    if (Platform.OS === "web") {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = productName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For native platforms, open in external browser
      // The browser will handle the download
      Linking.openURL(downloadUrl).catch((err: Error) => {
        console.error("Failed to open download URL:", err);
        setError("Failed to open download link. Please try again.");
      });
    }
  };


  // Render content based on file type
  const renderContent = () => {
    if (error) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.xl,
          }}
        >
          <MaterialIcons
            name="error-outline"
            size={64}
            color={colors.status.error}
          />
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold as "700",
              color: colors.text.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm,
              textAlign: "center",
            }}
          >
            Unable to Load Content
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              textAlign: "center",
              marginBottom: spacing.lg,
            }}
          >
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setError(null);
              setLoading(true);
              webViewRef.current?.reload();
            }}
            style={{
              backgroundColor: colors.accent,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.md,
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold as "600",
                color: colors.textColors.onAccent,
              }}
            >
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!downloadUrl) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.xl,
          }}
        >
          <MaterialIcons
            name="info-outline"
            size={64}
            color={colors.text.tertiary}
          />
          <Text
            style={{
              fontSize: typography.fontSize.lg,
              color: colors.text.secondary,
              marginTop: spacing.lg,
              textAlign: "center",
            }}
          >
            No download URL provided
          </Text>
        </View>
      );
    }

    // For PDFs, images, and videos, use WebView
    // For documents, try to preview or download
    if (fileType === "pdf") {
      return (
        <WebView
          key={downloadUrl} // Force re-render when URL changes
          ref={webViewRef}
          source={{ uri: downloadUrl }}
          style={{ flex: 1, backgroundColor: colors.background }}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onHttpError={handleHttpError}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState={false}
          // Enable PDF viewing
          javaScriptEnabled={true}
          domStorageEnabled={true}
          // Allow downloads
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          // Handle file downloads
          onShouldStartLoadWithRequest={(request) => {
            // Allow navigation to the download URL
            return true;
          }}
        />
      );
    }

    if (fileType === "image") {
      return (
        <WebView
          key={downloadUrl} // Force re-render when URL changes
          ref={webViewRef}
          source={{ uri: downloadUrl }}
          style={{ flex: 1, backgroundColor: colors.background }}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState={false}
          scalesPageToFit={true}
        />
      );
    }

    if (fileType === "video") {
      return (
        <WebView
          key={downloadUrl} // Force re-render when URL changes
          ref={webViewRef}
          source={{
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body {
                      margin: 0;
                      padding: 0;
                      background: #000;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                    }
                    video {
                      width: 100%;
                      height: 100%;
                      object-fit: contain;
                    }
                  </style>
                </head>
                <body>
                  <video controls autoplay>
                    <source src="${downloadUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                  </video>
                </body>
              </html>
            `,
          }}
          style={{ flex: 1, backgroundColor: colors.background }}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
        />
      );
    }

    // For documents and unknown types, show download option
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: spacing.xl,
        }}
      >
        <MaterialIcons
          name="description"
          size={64}
          color={colors.accent}
        />
        <Text
          style={{
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold as "700",
            color: colors.text.primary,
            marginTop: spacing.lg,
            marginBottom: spacing.sm,
            textAlign: "center",
          }}
        >
          {productName}
        </Text>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            textAlign: "center",
            marginBottom: spacing.xl,
          }}
        >
          This file type cannot be previewed. Please download to view.
        </Text>
        <TouchableOpacity
          onPress={handleDownload}
          style={{
            backgroundColor: colors.accent,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            borderRadius: borderRadius.md,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <MaterialIcons
            name="download"
            size={24}
            color={colors.textColors.onAccent}
          />
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold as "700",
              color: colors.textColors.onAccent,
            }}
          >
            Download File
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View
        style={{
          backgroundColor: colors.input,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          paddingTop: Platform.OS === "ios" ? spacing.lg : spacing.md,
          paddingBottom: spacing.md,
          paddingHorizontal: paddingHorizontal,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BackButton label="Back" />
          
          <View style={{ flex: 1, alignItems: "center", marginHorizontal: spacing.md }}>
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold as "700",
                color: colors.text.primary,
                textAlign: "center",
              }}
              numberOfLines={1}
            >
              {productName}
            </Text>
            {isMockData && (
              <Text
                style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.text.tertiary,
                  marginTop: 2,
                }}
              >
                Demo Mode
              </Text>
            )}
          </View>

          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            {canGoBack && (
              <TouchableOpacity
                onPress={() => webViewRef.current?.goBack()}
                style={{
                  padding: spacing.sm,
                }}
              >
                <MaterialIcons
                  name="arrow-back"
                  size={24}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
            )}
            {canGoForward && (
              <TouchableOpacity
                onPress={() => webViewRef.current?.goForward()}
                style={{
                  padding: spacing.sm,
                }}
              >
                <MaterialIcons
                  name="arrow-forward"
                  size={24}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background,
            zIndex: 1000,
          }}
        >
          <ActivityIndicator size="large" color={colors.accent} />
          <Text
            style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              marginTop: spacing.md,
            }}
          >
            Loading...
          </Text>
        </View>
      )}

      {/* Content */}
      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}
