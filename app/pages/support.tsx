import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Modal,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { MessageAttachment } from "@/types/messages";
import { OptimizedScrollView } from "@/components/optimized/OptimizedScrollView";
import { HelpArticle } from "@/types/education";
import { useRouter } from "expo-router";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
  attachments?: MessageAttachment[];
}

// Mock authenticated user data - in production, this would come from auth context
const mockAuthenticatedUser = {
  name: "John Doe",
  email: "john.doe@example.com",
};

// Mock help articles for help center panel
const mockHelpArticles: HelpArticle[] = [
  {
    id: "1",
    title: "How do I reset my password?",
    content:
      "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your email.",
    category: "account",
    tags: ["password", "security", "account"],
    helpful: 45,
    notHelpful: 2,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "2",
    title: "How do I earn cashback?",
    content:
      "Cashback is automatically earned when you make purchases at Black-owned businesses. The percentage varies by merchant and is credited to your account after the transaction is processed.",
    category: "rewards",
    tags: ["cashback", "rewards", "purchases"],
    helpful: 89,
    notHelpful: 5,
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
  },
  {
    id: "3",
    title: "How do I add a payment method?",
    content:
      "Go to the Pay section, tap 'Add Wallet', and select your payment method type. Follow the prompts to securely add your card or bank account.",
    category: "payments",
    tags: ["payments", "wallet", "cards"],
    helpful: 67,
    notHelpful: 3,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "4",
    title: "How do I enroll my business?",
    content:
      "Navigate to your profile, select 'Enroll Business', and complete the multi-step onboarding process. You'll need business information, tax ID, and verification documents.",
    category: "merchant",
    tags: ["merchant", "business", "onboarding"],
    helpful: 34,
    notHelpful: 1,
    createdAt: "2024-02-05T00:00:00Z",
    updatedAt: "2024-02-12T00:00:00Z",
  },
  {
    id: "5",
    title: "Why is my payment failing?",
    content:
      "Payment failures can occur due to insufficient funds, expired cards, or network issues. Check your payment method, ensure sufficient balance, and try again.",
    category: "troubleshooting",
    tags: ["payments", "troubleshooting", "errors"],
    helpful: 52,
    notHelpful: 4,
    createdAt: "2024-02-08T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "6",
    title: "What is BDN?",
    content:
      "BDN (Black Dollar Network) is a platform that connects consumers with Black-owned businesses, enabling cashback rewards and community impact.",
    category: "faq",
    tags: ["faq", "about", "platform"],
    helpful: 120,
    notHelpful: 2,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
];

const helpCategories = [
  { key: "all", label: "All Topics" },
  { key: "account", label: "Account" },
  { key: "payments", label: "Payments" },
  { key: "merchant", label: "Merchant" },
  { key: "rewards", label: "Rewards" },
  { key: "troubleshooting", label: "Troubleshooting" },
  { key: "faq", label: "FAQ" },
];

export default function Support() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isDesktop = width >= 768;
  const [activeTab, setActiveTab] = useState<"form" | "chat">("form");
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    message: "",
    email: mockAuthenticatedUser.email,
    name: mockAuthenticatedUser.name,
  });
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you today?",
      sender: "support",
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [formAttachments, setFormAttachments] = useState<MessageAttachment[]>(
    [],
  );
  const [showFormAttachmentMenu, setShowFormAttachmentMenu] = useState(false);

  // Help center panel state
  const [helpCenterExpanded, setHelpCenterExpanded] = useState(isDesktop);
  const [helpSearchQuery, setHelpSearchQuery] = useState("");
  const [selectedHelpCategory, setSelectedHelpCategory] =
    useState<string>("all");

  const categories = [
    "Account Issues",
    "Payment & Billing",
    "Business Enrollment",
    "Technical Support",
    "Feature Request",
    "General Inquiry",
  ];

  // Filter help articles based on search and category
  const filteredHelpArticles = mockHelpArticles.filter((article) => {
    const matchesCategory =
      selectedHelpCategory === "all" ||
      article.category === selectedHelpCategory;
    const matchesSearch =
      helpSearchQuery === "" ||
      article.title.toLowerCase().includes(helpSearchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(helpSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitForm = () => {
    if (
      !formData.subject ||
      !formData.category ||
      !formData.message ||
      !formData.email ||
      !formData.name
    ) {
      alert("Please fill in all required fields");
      return;
    }
    // TODO: Submit form to API with formAttachments
    alert("Your message has been sent! We'll get back to you within 24 hours.");
    setFormData({
      subject: "",
      category: "",
      message: "",
      email: mockAuthenticatedUser.email,
      name: mockAuthenticatedUser.name,
    });
    setFormAttachments([]);
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const handlePickFormDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const validAttachments: MessageAttachment[] = [];
        const invalidFiles: string[] = [];

        result.assets.forEach((asset, index) => {
          if (asset.size && asset.size > MAX_FILE_SIZE) {
            invalidFiles.push(asset.name || `File ${index + 1}`);
          } else {
            validAttachments.push({
              id: `form-doc-${Date.now()}-${index}`,
              type: "document",
              url: asset.uri,
              fileName: asset.name,
              fileSize: asset.size,
              mimeType: asset.mimeType || "application/octet-stream",
            });
          }
        });

        if (invalidFiles.length > 0) {
          Alert.alert(
            "File Size Limit Exceeded",
            `The following files exceed the 5MB limit:\n${invalidFiles.join("\n")}\n\nPlease select smaller files.`,
          );
        }

        if (validAttachments.length > 0) {
          setFormAttachments([...formAttachments, ...validAttachments]);
        }
        setShowFormAttachmentMenu(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handlePickFormImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your photos to attach images.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        const validAttachments: MessageAttachment[] = [];
        const invalidFiles: string[] = [];

        result.assets.forEach((asset, index) => {
          if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
            invalidFiles.push(asset.fileName || `Image ${index + 1}`);
          } else {
            validAttachments.push({
              id: `form-img-${Date.now()}-${index}`,
              type: "image",
              url: asset.uri,
              fileName: asset.fileName || `image-${index}.jpg`,
              fileSize: asset.fileSize,
              mimeType: asset.mimeType || "image/jpeg",
            });
          }
        });

        if (invalidFiles.length > 0) {
          Alert.alert(
            "File Size Limit Exceeded",
            `The following images exceed the 5MB limit:\n${invalidFiles.join("\n")}\n\nPlease select smaller files.`,
          );
        }

        if (validAttachments.length > 0) {
          setFormAttachments([...formAttachments, ...validAttachments]);
        }
        setShowFormAttachmentMenu(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleRemoveFormAttachment = (attachmentId: string) => {
    setFormAttachments(formAttachments.filter((a) => a.id !== attachmentId));
  };

  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your photos to send images.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        const newAttachments: MessageAttachment[] = result.assets.map(
          (asset, index) => ({
            id: `img-${Date.now()}-${index}`,
            type: "image",
            url: asset.uri,
            fileName: asset.fileName || `image-${index}.jpg`,
            fileSize: asset.fileSize,
            mimeType: asset.mimeType || "image/jpeg",
          }),
        );
        setAttachments([...attachments, ...newAttachments]);
        setShowAttachmentMenu(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handlePickVideo = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your videos to send videos.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newAttachment: MessageAttachment = {
          id: `vid-${Date.now()}`,
          type: "video",
          url: asset.uri,
          thumbnailUrl: asset.uri,
          fileName: asset.fileName || "video.mp4",
          fileSize: asset.fileSize,
          mimeType: asset.mimeType || "video/mp4",
          duration: asset.duration || undefined,
        };
        setAttachments([...attachments, newAttachment]);
        setShowAttachmentMenu(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick video");
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const newAttachments: MessageAttachment[] = result.assets.map(
          (asset, index) => ({
            id: `doc-${Date.now()}-${index}`,
            type: "document",
            url: asset.uri,
            fileName: asset.name,
            fileSize: asset.size,
            mimeType: asset.mimeType || "application/octet-stream",
          }),
        );
        setAttachments([...attachments, ...newAttachments]);
        setShowAttachmentMenu(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments(attachments.filter((a) => a.id !== attachmentId));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSendChat = () => {
    if (!chatInput.trim() && attachments.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: chatInput,
      sender: "user",
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");
    setAttachments([]);

    // Simulate support response
    setTimeout(() => {
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message. Our support team will respond shortly.",
        sender: "support",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, supportResponse]);
    }, 1000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#232323" }}>
      <StatusBar style="light" />
      <OptimizedScrollView
        showBackToTop={true}
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
        }}
      >
        {/* Main Content Container - Two columns on desktop */}
        <View
          style={{
            flexDirection: isDesktop ? "row" : "column",
            gap: isDesktop ? 24 : 0,
            alignItems: isDesktop ? "stretch" : "stretch",
          }}
        >
          {/* Left Column - Contact Form/Chat */}
          <View
            style={{
              flex: isDesktop ? 1 : undefined,
              width: isDesktop ? undefined : "100%",
              minWidth: isDesktop ? 0 : undefined,
            }}
          >
            {/* Tab Selector */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#474747",
                borderRadius: 12,
                padding: 4,
                marginBottom: 24,
              }}
            >
              <TouchableOpacity
                onPress={() => setActiveTab("form")}
                style={{
                  flex: 1,
                  backgroundColor:
                    activeTab === "form" ? "#ba9988" : "transparent",
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <MaterialIcons
                  name="email"
                  size={18}
                  color={
                    activeTab === "form"
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.7)"
                  }
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color:
                      activeTab === "form"
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  Contact Form
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("chat")}
                style={{
                  flex: 1,
                  backgroundColor:
                    activeTab === "chat" ? "#ba9988" : "transparent",
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <MaterialIcons
                  name="chat"
                  size={18}
                  color={
                    activeTab === "chat"
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.7)"
                  }
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color:
                      activeTab === "chat"
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  Live Chat
                </Text>
              </TouchableOpacity>
            </View>

            {/* Contact Form */}
            {activeTab === "form" && (
              <View style={{ gap: 24 }}>
                <View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 8,
                    }}
                  >
                    Contact Support
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    gap: 20,
                  }}
                >
                  {/* Name */}
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Name <Text style={{ color: "#ff4444" }}>*</Text>
                    </Text>
                    <TextInput
                      value={formData.name}
                      onChangeText={(text) =>
                        setFormData({ ...formData, name: text })
                      }
                      placeholder="Your name"
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

                  {/* Email */}
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Email Address <Text style={{ color: "#ff4444" }}>*</Text>
                    </Text>
                    <TextInput
                      value={formData.email}
                      onChangeText={(text) =>
                        setFormData({ ...formData, email: text })
                      }
                      placeholder="your.email@example.com"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="email-address"
                      autoCapitalize="none"
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

                  {/* Category */}
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Category <Text style={{ color: "#ff4444" }}>*</Text>
                    </Text>
                    <TouchableOpacity
                      onPress={() => setCategoryDropdownOpen(true)}
                      style={{
                        backgroundColor: "#232323",
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: formData.category
                            ? "#ffffff"
                            : "rgba(255, 255, 255, 0.4)",
                        }}
                      >
                        {formData.category || "Select a category"}
                      </Text>
                      <MaterialIcons
                        name={
                          categoryDropdownOpen
                            ? "keyboard-arrow-up"
                            : "keyboard-arrow-down"
                        }
                        size={20}
                        color="rgba(255, 255, 255, 0.6)"
                      />
                    </TouchableOpacity>
                    <Modal
                      visible={categoryDropdownOpen}
                      transparent
                      animationType="fade"
                      onRequestClose={() => setCategoryDropdownOpen(false)}
                    >
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          backgroundColor: "rgba(0, 0, 0, 0.95)",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 20,
                        }}
                        activeOpacity={1}
                        onPress={() => setCategoryDropdownOpen(false)}
                      >
                        <View
                          style={{
                            backgroundColor: "#474747",
                            borderRadius: 16,
                            width: "100%",
                            maxWidth: 400,
                            maxHeight: 400,
                            borderWidth: 2,
                            borderColor: "#5a5a68",
                          }}
                          onStartShouldSetResponder={() => true}
                        >
                          <View
                            style={{
                              padding: 16,
                              borderBottomWidth: 2,
                              borderBottomColor: "#5a5a68",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              backgroundColor: "#474747",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "700",
                                color: "#ffffff",
                              }}
                            >
                              Select Category
                            </Text>
                            <TouchableOpacity
                              onPress={() => setCategoryDropdownOpen(false)}
                            >
                              <MaterialIcons
                                name="close"
                                size={20}
                                color="rgba(255, 255, 255, 0.6)"
                              />
                            </TouchableOpacity>
                          </View>
                          <ScrollView style={{ maxHeight: 300 }}>
                            {categories.map((category) => (
                              <TouchableOpacity
                                key={category}
                                onPress={() => {
                                  setFormData({ ...formData, category });
                                  setCategoryDropdownOpen(false);
                                }}
                                style={{
                                  paddingVertical: 16,
                                  paddingHorizontal: 20,
                                  borderBottomWidth: 1,
                                  borderBottomColor: "#5a5a68",
                                  backgroundColor:
                                    formData.category === category
                                      ? "rgba(186, 153, 136, 0.3)"
                                      : "#474747",
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      fontWeight:
                                        formData.category === category
                                          ? "600"
                                          : "400",
                                      color:
                                        formData.category === category
                                          ? "#ba9988"
                                          : "#ffffff",
                                    }}
                                  >
                                    {category}
                                  </Text>
                                  {formData.category === category && (
                                    <MaterialIcons
                                      name="check"
                                      size={20}
                                      color="#ba9988"
                                    />
                                  )}
                                </View>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      </TouchableOpacity>
                    </Modal>
                  </View>

                  {/* Subject */}
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Subject <Text style={{ color: "#ff4444" }}>*</Text>
                    </Text>
                    <TextInput
                      value={formData.subject}
                      onChangeText={(text) =>
                        setFormData({ ...formData, subject: text })
                      }
                      placeholder="Brief description of your issue"
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

                  {/* Message */}
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Message <Text style={{ color: "#ff4444" }}>*</Text>
                    </Text>
                    <TextInput
                      value={formData.message}
                      onChangeText={(text) =>
                        setFormData({ ...formData, message: text })
                      }
                      placeholder="Please provide details about your issue or question..."
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      multiline
                      numberOfLines={6}
                      style={{
                        backgroundColor: "#232323",
                        borderRadius: 12,
                        padding: 16,
                        color: "#ffffff",
                        fontSize: 14,
                        minHeight: 150,
                        textAlignVertical: "top",
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    />
                  </View>

                  {/* File Attachment Section */}
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#ffffff",
                        }}
                      >
                        Attachments
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        Max 5MB per file
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowFormAttachmentMenu(true)}
                      style={{
                        backgroundColor: "#232323",
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                        borderStyle: "dashed",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <MaterialIcons
                        name="attach-file"
                        size={20}
                        color="#ba9988"
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#ba9988",
                          fontWeight: "500",
                        }}
                      >
                        Attach File
                      </Text>
                    </TouchableOpacity>

                    {/* Attached Files Preview */}
                    {formAttachments.length > 0 && (
                      <View style={{ marginTop: 12, gap: 8 }}>
                        {formAttachments.map((attachment) => (
                          <View
                            key={attachment.id}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 12,
                              backgroundColor: "#232323",
                              borderRadius: 8,
                              padding: 12,
                              borderWidth: 1,
                              borderColor: "rgba(186, 153, 136, 0.2)",
                            }}
                          >
                            <MaterialIcons
                              name={
                                attachment.type === "image"
                                  ? "image"
                                  : "description"
                              }
                              size={20}
                              color="#ba9988"
                            />
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontSize: 13,
                                  color: "#ffffff",
                                  fontWeight: "500",
                                }}
                                numberOfLines={1}
                              >
                                {attachment.fileName || "File"}
                              </Text>
                              {attachment.fileSize && (
                                <Text
                                  style={{
                                    fontSize: 11,
                                    color: "rgba(255, 255, 255, 0.6)",
                                  }}
                                >
                                  {formatFileSize(attachment.fileSize)}
                                </Text>
                              )}
                            </View>
                            <TouchableOpacity
                              onPress={() =>
                                handleRemoveFormAttachment(attachment.id)
                              }
                              style={{
                                padding: 4,
                              }}
                            >
                              <MaterialIcons
                                name="close"
                                size={18}
                                color="rgba(255, 255, 255, 0.6)"
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    onPress={handleSubmitForm}
                    style={{
                      backgroundColor: "#ba9988",
                      borderRadius: 12,
                      paddingVertical: 16,
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#ffffff",
                      }}
                    >
                      Send Message
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Form Attachment Menu Modal */}
                <Modal
                  visible={showFormAttachmentMenu}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setShowFormAttachmentMenu(false)}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      justifyContent: "flex-end",
                    }}
                    activeOpacity={1}
                    onPress={() => setShowFormAttachmentMenu(false)}
                  >
                    <View
                      style={{
                        backgroundColor: "#474747",
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 24,
                        paddingBottom: Platform.OS === "ios" ? 40 : 24,
                      }}
                      onStartShouldSetResponder={() => true}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 4,
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          borderRadius: 2,
                          alignSelf: "center",
                          marginBottom: 24,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: "#ffffff",
                          marginBottom: 20,
                        }}
                      >
                        Attach File (Max 5MB)
                      </Text>
                      <View style={{ gap: 12 }}>
                        <TouchableOpacity
                          onPress={handlePickFormImage}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 16,
                            padding: 16,
                            backgroundColor: "#232323",
                            borderRadius: 12,
                          }}
                        >
                          <View
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 24,
                              backgroundColor: "rgba(186, 153, 136, 0.2)",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <MaterialIcons
                              name="image"
                              size={24}
                              color="#ba9988"
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "#ffffff",
                              }}
                            >
                              Photo or Image
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              Choose from gallery
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={handlePickFormDocument}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 16,
                            padding: 16,
                            backgroundColor: "#232323",
                            borderRadius: 12,
                          }}
                        >
                          <View
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 24,
                              backgroundColor: "rgba(186, 153, 136, 0.2)",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <MaterialIcons
                              name="description"
                              size={24}
                              color="#ba9988"
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "#ffffff",
                              }}
                            >
                              Document
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              PDF, Word, Excel, etc. (Max 5MB)
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>

                {/* Helpful Links */}
                <View
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
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
                    Helpful Resources
                  </Text>
                  <View style={{ gap: 12 }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        paddingVertical: 8,
                      }}
                    >
                      <MaterialIcons name="help" size={20} color="#ba9988" />
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#ffffff",
                          flex: 1,
                        }}
                      >
                        Help Center
                      </Text>
                      <MaterialIcons
                        name="chevron-right"
                        size={20}
                        color="rgba(255, 255, 255, 0.5)"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        paddingVertical: 8,
                      }}
                    >
                      <MaterialIcons
                        name="menu-book"
                        size={20}
                        color="#ba9988"
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#ffffff",
                          flex: 1,
                        }}
                      >
                        User Guides
                      </Text>
                      <MaterialIcons
                        name="chevron-right"
                        size={20}
                        color="rgba(255, 255, 255, 0.5)"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        paddingVertical: 8,
                      }}
                    >
                      <MaterialIcons name="article" size={20} color="#ba9988" />
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#ffffff",
                          flex: 1,
                        }}
                      >
                        FAQ
                      </Text>
                      <MaterialIcons
                        name="chevron-right"
                        size={20}
                        color="rgba(255, 255, 255, 0.5)"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* Live Chat */}
            {activeTab === "chat" && (
              <View style={{ flex: 1, gap: 24 }}>
                <View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: 8,
                    }}
                  >
                    Live Chat Support
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Chat with our support team in real-time. We're here to help!
                  </Text>
                </View>

                {/* Chat Status */}
                <View
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#4caf50",
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Support team is online. Average response time: 2-3 minutes
                  </Text>
                </View>

                {/* Chat Messages */}
                <View
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    minHeight: 400,
                    maxHeight: 500,
                    marginBottom: 16,
                  }}
                >
                  <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ gap: 16 }}
                    showsVerticalScrollIndicator={false}
                  >
                    {chatMessages.map((message) => (
                      <View
                        key={message.id}
                        style={{
                          flexDirection: "row",
                          alignSelf:
                            message.sender === "user"
                              ? "flex-end"
                              : "flex-start",
                          maxWidth: "80%",
                          gap: 8,
                          alignItems: "flex-start",
                        }}
                      >
                        {message.sender === "support" && (
                          <View
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 16,
                              backgroundColor: "#ba9988",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <MaterialIcons
                              name="support-agent"
                              size={18}
                              color="#ffffff"
                            />
                          </View>
                        )}
                        <View style={{ flex: 1 }}>
                          <View
                            style={{
                              backgroundColor:
                                message.sender === "user"
                                  ? "#ba9988"
                                  : "#232323",
                              borderRadius: 16,
                              padding: 12,
                              borderTopLeftRadius:
                                message.sender === "support" ? 4 : 16,
                              borderTopRightRadius:
                                message.sender === "user" ? 4 : 16,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                color: "#ffffff",
                                lineHeight: 20,
                              }}
                            >
                              {message.text}
                            </Text>
                            {/* Attachments */}
                            {message.attachments &&
                              message.attachments.length > 0 && (
                                <View style={{ marginTop: 8, gap: 8 }}>
                                  {message.attachments.map((attachment) => (
                                    <View key={attachment.id}>
                                      {attachment.type === "image" && (
                                        <Image
                                          source={{ uri: attachment.url }}
                                          style={{
                                            width: 200,
                                            height: 200,
                                            borderRadius: 12,
                                            backgroundColor: "#474747",
                                          }}
                                          contentFit="cover"
                                          cachePolicy="memory-disk"
                                        />
                                      )}
                                      {attachment.type === "video" && (
                                        <View
                                          style={{
                                            width: 200,
                                            height: 150,
                                            borderRadius: 12,
                                            backgroundColor: "#474747",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <MaterialIcons
                                            name="videocam"
                                            size={32}
                                            color="#ba9988"
                                          />
                                          {attachment.duration && (
                                            <Text
                                              style={{
                                                fontSize: 12,
                                                color:
                                                  "rgba(255, 255, 255, 0.7)",
                                                marginTop: 4,
                                              }}
                                            >
                                              {Math.floor(
                                                attachment.duration / 60,
                                              )}
                                              :
                                              {Math.floor(
                                                attachment.duration % 60,
                                              )
                                                .toString()
                                                .padStart(2, "0")}
                                            </Text>
                                          )}
                                        </View>
                                      )}
                                      {(attachment.type === "document" ||
                                        attachment.type === "audio") && (
                                        <View
                                          style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 12,
                                            padding: 12,
                                            backgroundColor: "#474747",
                                            borderRadius: 12,
                                            maxWidth: 200,
                                          }}
                                        >
                                          <MaterialIcons
                                            name={
                                              attachment.type === "audio"
                                                ? "mic"
                                                : "description"
                                            }
                                            size={24}
                                            color="#ba9988"
                                          />
                                          <View style={{ flex: 1 }}>
                                            <Text
                                              style={{
                                                fontSize: 12,
                                                fontWeight: "600",
                                                color: "#ffffff",
                                              }}
                                              numberOfLines={1}
                                            >
                                              {attachment.fileName || "File"}
                                            </Text>
                                            {attachment.fileSize && (
                                              <Text
                                                style={{
                                                  fontSize: 10,
                                                  color:
                                                    "rgba(255, 255, 255, 0.6)",
                                                }}
                                              >
                                                {formatFileSize(
                                                  attachment.fileSize,
                                                )}
                                              </Text>
                                            )}
                                          </View>
                                        </View>
                                      )}
                                    </View>
                                  ))}
                                </View>
                              )}
                          </View>
                          <Text
                            style={{
                              fontSize: 11,
                              color: "rgba(255, 255, 255, 0.5)",
                              marginTop: 4,
                              textAlign:
                                message.sender === "user" ? "right" : "left",
                            }}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                        </View>
                        {message.sender === "user" && (
                          <View
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 16,
                              backgroundColor: "#ba9988",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "700",
                                color: "#ffffff",
                              }}
                            >
                              U
                            </Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </ScrollView>
                </View>

                {/* Pending Attachments Preview */}
                {attachments.length > 0 && (
                  <View
                    style={{
                      paddingVertical: 12,
                      borderTopWidth: 1,
                      borderTopColor: "rgba(186, 153, 136, 0.2)",
                      backgroundColor: "#474747",
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      marginBottom: 12,
                    }}
                  >
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 12 }}
                    >
                      {attachments.map((attachment) => (
                        <View
                          key={attachment.id}
                          style={{
                            position: "relative",
                            width: 80,
                            height: 80,
                            borderRadius: 12,
                            backgroundColor: "#232323",
                            overflow: "hidden",
                          }}
                        >
                          {attachment.type === "image" && (
                            <Image
                              source={{ uri: attachment.url }}
                              style={{ width: "100%", height: "100%" }}
                              contentFit="cover"
                              cachePolicy="memory-disk"
                            />
                          )}
                          {(attachment.type === "video" ||
                            attachment.type === "document" ||
                            attachment.type === "audio") && (
                            <View
                              style={{
                                width: "100%",
                                height: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <MaterialIcons
                                name={
                                  attachment.type === "video"
                                    ? "videocam"
                                    : attachment.type === "audio"
                                      ? "mic"
                                      : "description"
                                }
                                size={32}
                                color="#ba9988"
                              />
                            </View>
                          )}
                          <TouchableOpacity
                            onPress={() =>
                              handleRemoveAttachment(attachment.id)
                            }
                            style={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <MaterialIcons
                              name="close"
                              size={16}
                              color="#ffffff"
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Chat Input */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "flex-end",
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setShowAttachmentMenu(true)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MaterialIcons
                      name="attach-file"
                      size={22}
                      color="rgba(255, 255, 255, 0.7)"
                    />
                  </TouchableOpacity>
                  <TextInput
                    value={chatInput}
                    onChangeText={setChatInput}
                    placeholder="Type your message..."
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    multiline
                    style={{
                      flex: 1,
                      backgroundColor: "#232323",
                      borderRadius: 8,
                      padding: 12,
                      color: "#ffffff",
                      fontSize: 14,
                      maxHeight: 100,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                    onSubmitEditing={handleSendChat}
                  />
                  <TouchableOpacity
                    onPress={handleSendChat}
                    disabled={!chatInput.trim() && attachments.length === 0}
                    style={{
                      backgroundColor:
                        chatInput.trim() || attachments.length > 0
                          ? "#ba9988"
                          : "rgba(186, 153, 136, 0.3)",
                      borderRadius: 18,
                      width: 36,
                      height: 36,
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MaterialIcons
                      name="send"
                      size={18}
                      color={
                        chatInput.trim() || attachments.length > 0
                          ? "#ffffff"
                          : "rgba(255, 255, 255, 0.5)"
                      }
                    />
                  </TouchableOpacity>
                </View>

                {/* Attachment Menu Modal */}
                <Modal
                  visible={showAttachmentMenu}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setShowAttachmentMenu(false)}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      justifyContent: "flex-end",
                    }}
                    activeOpacity={1}
                    onPress={() => setShowAttachmentMenu(false)}
                  >
                    <View
                      style={{
                        backgroundColor: "#474747",
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 24,
                        paddingBottom: Platform.OS === "ios" ? 40 : 24,
                      }}
                      onStartShouldSetResponder={() => true}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 4,
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          borderRadius: 2,
                          alignSelf: "center",
                          marginBottom: 24,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: "#ffffff",
                          marginBottom: 20,
                        }}
                      >
                        Attach File
                      </Text>
                      <View style={{ gap: 12 }}>
                        <TouchableOpacity
                          onPress={handlePickImage}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 16,
                            padding: 16,
                            backgroundColor: "#232323",
                            borderRadius: 12,
                          }}
                        >
                          <View
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 24,
                              backgroundColor: "rgba(186, 153, 136, 0.2)",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <MaterialIcons
                              name="image"
                              size={24}
                              color="#ba9988"
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "#ffffff",
                              }}
                            >
                              Photo or Image
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              Choose from gallery
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={handlePickVideo}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 16,
                            padding: 16,
                            backgroundColor: "#232323",
                            borderRadius: 12,
                          }}
                        >
                          <View
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 24,
                              backgroundColor: "rgba(186, 153, 136, 0.2)",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <MaterialIcons
                              name="videocam"
                              size={24}
                              color="#ba9988"
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "#ffffff",
                              }}
                            >
                              Video
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              Choose video from gallery
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={handlePickDocument}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 16,
                            padding: 16,
                            backgroundColor: "#232323",
                            borderRadius: 12,
                          }}
                        >
                          <View
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 24,
                              backgroundColor: "rgba(186, 153, 136, 0.2)",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <MaterialIcons
                              name="description"
                              size={24}
                              color="#ba9988"
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "#ffffff",
                              }}
                            >
                              Document
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              PDF, Word, Excel, etc.
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            )}
          </View>

          {/* Right Column - Help Center Panel (Desktop only) */}
          {isDesktop && (
            <>
              {helpCenterExpanded ? (
                <View
                  style={{
                    flex: 1,
                    maxWidth: "50%",
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                    overflow: "hidden",
                    alignSelf: "stretch",
                  }}
                >
                  {/* Help Center Header - Expanded */}
                  <TouchableOpacity
                    onPress={() => setHelpCenterExpanded(false)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(186, 153, 136, 0.2)",
                      minHeight: 56,
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        flex: 1,
                      }}
                    >
                      <MaterialIcons
                        name="help-outline"
                        size={24}
                        color="#ba9988"
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: "#ffffff",
                        }}
                      >
                        Help Center
                      </Text>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color="#ba9988"
                    />
                  </TouchableOpacity>

                  {/* Expanded Content */}
                  <View style={{ flex: 1 }}>
                    {/* Search Bar */}
                    <View
                      style={{
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#232323",
                          borderRadius: 12,
                          paddingHorizontal: 12,
                          borderWidth: 1,
                          borderColor: "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <MaterialIcons
                          name="search"
                          size={18}
                          color="rgba(255, 255, 255, 0.5)"
                        />
                        <TextInput
                          value={helpSearchQuery}
                          onChangeText={setHelpSearchQuery}
                          placeholder="Search help articles..."
                          placeholderTextColor="rgba(255, 255, 255, 0.4)"
                          style={{
                            flex: 1,
                            paddingVertical: 10,
                            paddingHorizontal: 8,
                            fontSize: 14,
                            color: "#ffffff",
                          }}
                        />
                      </View>
                    </View>

                    {/* Category Filters */}
                    <View
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 8, alignItems: "center" }}
                      >
                        {helpCategories.map((category) => (
                          <TouchableOpacity
                            key={category.key}
                            onPress={() =>
                              setSelectedHelpCategory(category.key)
                            }
                            style={{
                              backgroundColor:
                                selectedHelpCategory === category.key
                                  ? "#ba9988"
                                  : "#232323",
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              borderRadius: 8,
                              borderWidth: 1,
                              borderColor:
                                selectedHelpCategory === category.key
                                  ? "#ba9988"
                                  : "rgba(186, 153, 136, 0.2)",
                              alignSelf: "flex-start",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: "600",
                                color:
                                  selectedHelpCategory === category.key
                                    ? "#ffffff"
                                    : "rgba(255, 255, 255, 0.7)",
                              }}
                            >
                              {category.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Articles List */}
                    <ScrollView
                      style={{ flex: 1 }}
                      contentContainerStyle={{ padding: 16, gap: 12 }}
                      showsVerticalScrollIndicator={false}
                    >
                      {filteredHelpArticles.length > 0 ? (
                        filteredHelpArticles.map((article) => (
                          <TouchableOpacity
                            key={article.id}
                            onPress={() =>
                              router.push(
                                `/pages/university/help/${article.id}`,
                              )
                            }
                            style={{
                              backgroundColor: "#232323",
                              borderRadius: 12,
                              padding: 12,
                              borderWidth: 1,
                              borderColor: "rgba(186, 153, 136, 0.2)",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "600",
                                color: "#ffffff",
                                marginBottom: 6,
                              }}
                              numberOfLines={2}
                            >
                              {article.title}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                              numberOfLines={2}
                            >
                              {article.content}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 8,
                                paddingTop: 8,
                                borderTopWidth: 1,
                                borderTopColor: "rgba(186, 153, 136, 0.1)",
                              }}
                            >
                              <MaterialIcons
                                name="thumb-up"
                                size={14}
                                color="#4caf50"
                              />
                              <Text
                                style={{
                                  fontSize: 11,
                                  color: "rgba(255, 255, 255, 0.5)",
                                  marginLeft: 4,
                                }}
                              >
                                {article.helpful} helpful
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View
                          style={{
                            backgroundColor: "#232323",
                            borderRadius: 12,
                            padding: 24,
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: "rgba(186, 153, 136, 0.2)",
                          }}
                        >
                          <MaterialIcons
                            name="search-off"
                            size={32}
                            color="rgba(186, 153, 136, 0.5)"
                          />
                          <Text
                            style={{
                              fontSize: 14,
                              color: "rgba(255, 255, 255, 0.6)",
                              textAlign: "center",
                              marginTop: 12,
                            }}
                          >
                            {helpSearchQuery
                              ? "No articles found matching your search"
                              : "No articles found for this category"}
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </View>
              ) : (
                /* Collapsed State - Small icon button at top */
                <TouchableOpacity
                  onPress={() => setHelpCenterExpanded(true)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: "#474747",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.4)",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "flex-start",
                    ...(Platform.OS === "web" ? { cursor: "pointer" } : {}),
                  }}
                >
                  <MaterialIcons
                    name="help-outline"
                    size={24}
                    color="#ba9988"
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </OptimizedScrollView>
    </View>
  );
}
