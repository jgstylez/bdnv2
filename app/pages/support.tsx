import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, Platform, Modal, Alert } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { MessageAttachment } from '@/types/messages';

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

export default function Support() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
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

  const categories = [
    "Account Issues",
    "Payment & Billing",
    "Business Enrollment",
    "Technical Support",
    "Feature Request",
    "General Inquiry",
  ];

  const handleSubmitForm = () => {
    if (!formData.subject || !formData.category || !formData.message || !formData.email || !formData.name) {
      alert("Please fill in all required fields");
      return;
    }
    // TODO: Submit form to API
    alert("Your message has been sent! We'll get back to you within 24 hours.");
    setFormData({
      subject: "",
      category: "",
      message: "",
      email: mockAuthenticatedUser.email,
      name: mockAuthenticatedUser.name,
    });
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "We need access to your photos to send images.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        const newAttachments: MessageAttachment[] = result.assets.map((asset, index) => ({
          id: `img-${Date.now()}-${index}`,
          type: "image",
          url: asset.uri,
          fileName: asset.fileName || `image-${index}.jpg`,
          fileSize: asset.fileSize,
          mimeType: asset.mimeType || "image/jpeg",
        }));
        setAttachments([...attachments, ...newAttachments]);
        setShowAttachmentMenu(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handlePickVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "We need access to your videos to send videos.");
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
        const newAttachments: MessageAttachment[] = result.assets.map((asset, index) => ({
          id: `doc-${Date.now()}-${index}`,
          type: "document",
          url: asset.uri,
          fileName: asset.name,
          fileSize: asset.size,
          mimeType: asset.mimeType || "application/octet-stream",
        }));
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
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isMobile ? 20 : 40,
          paddingTop: Platform.OS === "web" ? 20 : 36,
          paddingBottom: 40,
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
              backgroundColor: activeTab === "form" ? "#ba9988" : "transparent",
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
              color={activeTab === "form" ? "#ffffff" : "rgba(255, 255, 255, 0.7)"}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: activeTab === "form" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
              }}
            >
              Contact Form
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("chat")}
            style={{
              flex: 1,
              backgroundColor: activeTab === "chat" ? "#ba9988" : "transparent",
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
              color={activeTab === "chat" ? "#ffffff" : "rgba(255, 255, 255, 0.7)"}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: activeTab === "chat" ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
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
                Fill out the form below and we'll get back to you within 24 hours.
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
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
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
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
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
                      color: formData.category ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
                    }}
                  >
                    {formData.category || "Select a category"}
                  </Text>
                  <MaterialIcons
                    name={categoryDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
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
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                      onStartShouldSetResponder={() => true}
                    >
                      <View
                        style={{
                          padding: 16,
                          borderBottomWidth: 1,
                          borderBottomColor: "rgba(186, 153, 136, 0.2)",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
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
                        <TouchableOpacity onPress={() => setCategoryDropdownOpen(false)}>
                          <MaterialIcons name="close" size={20} color="rgba(255, 255, 255, 0.6)" />
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
                              borderBottomColor: "rgba(186, 153, 136, 0.1)",
                              backgroundColor: formData.category === category ? "rgba(186, 153, 136, 0.2)" : "transparent",
                      }}
                    >
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text
                        style={{
                                  fontSize: 14,
                                  fontWeight: formData.category === category ? "600" : "400",
                                  color: formData.category === category ? "#ba9988" : "#ffffff",
                        }}
                      >
                        {category}
                      </Text>
                              {formData.category === category && (
                                <MaterialIcons name="check" size={20} color="#ba9988" />
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
                  onChangeText={(text) => setFormData({ ...formData, subject: text })}
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
                  onChangeText={(text) => setFormData({ ...formData, message: text })}
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
                  <MaterialIcons name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingVertical: 8,
                  }}
                >
                  <MaterialIcons name="menu-book" size={20} color="#ba9988" />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#ffffff",
                      flex: 1,
                    }}
                  >
                    User Guides
                  </Text>
                  <MaterialIcons name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
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
                  <MaterialIcons name="chevron-right" size={20} color="rgba(255, 255, 255, 0.5)" />
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
                      alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
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
                        <MaterialIcons name="support-agent" size={18} color="#ffffff" />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                    <View
                      style={{
                        backgroundColor: message.sender === "user" ? "#ba9988" : "#232323",
                        borderRadius: 16,
                        padding: 12,
                        borderTopLeftRadius: message.sender === "support" ? 4 : 16,
                        borderTopRightRadius: message.sender === "user" ? 4 : 16,
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
                      {message.attachments && message.attachments.length > 0 && (
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
                                  <MaterialIcons name="videocam" size={32} color="#ba9988" />
                                  {attachment.duration && (
                                    <Text
                                      style={{
                                        fontSize: 12,
                                        color: "rgba(255, 255, 255, 0.7)",
                                        marginTop: 4,
                                      }}
                                    >
                                      {Math.floor(attachment.duration / 60)}:
                                      {Math.floor(attachment.duration % 60)
                                        .toString()
                                        .padStart(2, "0")}
                                    </Text>
                                  )}
                                </View>
                              )}
                              {(attachment.type === "document" || attachment.type === "audio") && (
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
                                    name={attachment.type === "audio" ? "mic" : "description"}
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
                                          color: "rgba(255, 255, 255, 0.6)",
                                        }}
                                      >
                                        {formatFileSize(attachment.fileSize)}
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
                        textAlign: message.sender === "user" ? "right" : "left",
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
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
                      {(attachment.type === "video" || attachment.type === "document" || attachment.type === "audio") && (
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
                        onPress={() => handleRemoveAttachment(attachment.id)}
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
                        <MaterialIcons name="close" size={16} color="#ffffff" />
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
                <MaterialIcons name="attach-file" size={22} color="rgba(255, 255, 255, 0.7)" />
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
                  backgroundColor: chatInput.trim() || attachments.length > 0 ? "#ba9988" : "rgba(186, 153, 136, 0.3)",
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
                  color={chatInput.trim() || attachments.length > 0 ? "#ffffff" : "rgba(255, 255, 255, 0.5)"}
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
                        <MaterialIcons name="image" size={24} color="#ba9988" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
                          Photo or Image
                        </Text>
                        <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
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
                        <MaterialIcons name="videocam" size={24} color="#ba9988" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
                          Video
                        </Text>
                        <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
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
                        <MaterialIcons name="description" size={24} color="#ba9988" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
                          Document
                        </Text>
                        <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
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
      </ScrollView>
    </View>
  );
}

