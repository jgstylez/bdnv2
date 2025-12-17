import React, { useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Modal, Platform } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import * as ImagePicker from "expo-image-picker";

type TargetAudience = "all" | "consumers" | "businesses" | "nonprofits" | "specific";
type EntityType = "user" | "business" | "nonprofit";
type SendType = "immediate" | "scheduled";

export default function EmailManagement() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [showSendModal, setShowSendModal] = useState(false);
  const [targetAudience, setTargetAudience] = useState<TargetAudience>("all");
  const [entityType, setEntityType] = useState<EntityType>("user");
  const [sendType, setSendType] = useState<SendType>("immediate");
  const [title, setTitle] = useState("");
  const [subheading, setSubheading] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [specificEntity, setSpecificEntity] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSendTest = () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content");
      return;
    }
    // TODO: Send test email via API
    alert("Test email sent successfully!");
  };

  const handleSend = () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content");
      return;
    }
    if (targetAudience === "specific" && !specificEntity.trim()) {
      alert("Please enter entity ID or email");
      return;
    }
    if (sendType === "scheduled" && (!scheduledDate.trim() || !scheduledTime.trim())) {
      alert("Please select scheduled date and time");
      return;
    }
    // TODO: Send email via API
    const audienceText = targetAudience === "all" ? "all users" : targetAudience;
    const sendText = sendType === "immediate" ? "immediately" : `scheduled for ${scheduledDate} ${scheduledTime}`;
    alert(`Email sent successfully to ${audienceText} ${sendText}`);
    resetForm();
  };

  const resetForm = () => {
    setShowSendModal(false);
    setTitle("");
    setSubheading("");
    setImageUri(null);
    setContent("");
    setSpecificEntity("");
    setTargetAudience("all");
    setSendType("immediate");
    setScheduledDate("");
    setScheduledTime("");
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
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: isMobile ? 28 : 36,
              fontWeight: "800",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Email Management
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 24,
            }}
          >
            Send emails to users, businesses, or nonprofits. Target specific audiences, schedule sends, or send immediately.
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={{ marginBottom: 32, flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          <TouchableOpacity
            onPress={() => setShowSendModal(true)}
            style={{
              backgroundColor: "#ba9988",
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              flex: isMobile ? 1 : 0,
              minWidth: isMobile ? "100%" : 200,
            }}
          >
            <MaterialIcons name="send" size={24} color="#ffffff" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              Send Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSendTest}
            style={{
              backgroundColor: "#474747",
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              flex: isMobile ? 1 : 0,
              minWidth: isMobile ? "100%" : 200,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <MaterialIcons name="bug-report" size={24} color="#ba9988" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              Send Test
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Emails */}
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Recent Emails
          </Text>
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
            <MaterialIcons name="email" size={48} color="rgba(186, 153, 136, 0.5)" />
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              No recent emails sent. Use the button above to send your first email.
            </Text>
          </View>
        </View>

        {/* Send Modal */}
        <Modal
          visible={showSendModal}
          transparent
          animationType="slide"
          onRequestClose={resetForm}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <ScrollView
              style={{
                backgroundColor: "#474747",
                borderRadius: 20,
                padding: 24,
                width: "100%",
                maxWidth: 800,
                maxHeight: "90%",
                borderWidth: 1,
                borderColor: "rgba(186, 153, 136, 0.2)",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  Send Email
                </Text>
                <TouchableOpacity onPress={resetForm}>
                  <MaterialIcons name="close" size={24} color="rgba(255, 255, 255, 0.7)" />
                </TouchableOpacity>
              </View>

              {/* Target Audience */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 12,
                  }}
                >
                  Target Audience
                </Text>
                <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { key: "all", label: "All Users" },
                    { key: "consumers", label: "Consumers" },
                    { key: "businesses", label: "Businesses" },
                    { key: "nonprofits", label: "Nonprofits" },
                    { key: "specific", label: "Specific Entity" },
                  ].map((audience) => (
                    <TouchableOpacity
                      key={audience.key}
                      onPress={() => setTargetAudience(audience.key as TargetAudience)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: targetAudience === audience.key ? "#ba9988" : "#232323",
                        borderWidth: 1,
                        borderColor:
                          targetAudience === audience.key
                            ? "#ba9988"
                            : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: targetAudience === audience.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        {audience.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Entity Type (for specific) */}
              {targetAudience === "specific" && (
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: 12,
                    }}
                  >
                    Entity Type
                  </Text>
                  <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                    {[
                      { key: "user", label: "User" },
                      { key: "business", label: "Business" },
                      { key: "nonprofit", label: "Nonprofit" },
                    ].map((type) => (
                      <TouchableOpacity
                        key={type.key}
                        onPress={() => setEntityType(type.key as EntityType)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: entityType === type.key ? "#ba9988" : "#232323",
                          borderWidth: 1,
                          borderColor:
                            entityType === type.key
                              ? "#ba9988"
                              : "rgba(186, 153, 136, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: entityType === type.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Specific Entity Input */}
              {targetAudience === "specific" && (
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: 8,
                    }}
                  >
                    Entity ID or Email *
                  </Text>
                  <TextInput
                    value={specificEntity}
                    onChangeText={setSpecificEntity}
                    placeholder="user@example.com or entity-id"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 14,
                      color: "#ffffff",
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                    }}
                  />
                </View>
              )}

              {/* Send Type */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 12,
                  }}
                >
                  Send Type
                </Text>
                <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { key: "immediate", label: "Immediate" },
                    { key: "scheduled", label: "Scheduled" },
                  ].map((type) => (
                    <TouchableOpacity
                      key={type.key}
                      onPress={() => setSendType(type.key as SendType)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: sendType === type.key ? "#ba9988" : "#232323",
                        borderWidth: 1,
                        borderColor:
                          sendType === type.key
                            ? "#ba9988"
                            : "rgba(186, 153, 136, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: sendType === type.key ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Scheduled Date/Time */}
              {sendType === "scheduled" && (
                <View style={{ marginBottom: 20, flexDirection: "row", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Date *
                    </Text>
                    <TextInput
                      value={scheduledDate}
                      onChangeText={setScheduledDate}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      style={{
                        backgroundColor: "#232323",
                        borderRadius: 12,
                        padding: 14,
                        color: "#ffffff",
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      Time *
                    </Text>
                    <TextInput
                      value={scheduledTime}
                      onChangeText={setScheduledTime}
                      placeholder="HH:MM"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      style={{
                        backgroundColor: "#232323",
                        borderRadius: 12,
                        padding: 14,
                        color: "#ffffff",
                        fontSize: 14,
                        borderWidth: 1,
                        borderColor: "rgba(186, 153, 136, 0.2)",
                      }}
                    />
                  </View>
                </View>
              )}

              {/* Title */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Title *
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter email title..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 14,
                    color: "#ffffff",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>

              {/* Subheading */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Subheading
                </Text>
                <TextInput
                  value={subheading}
                  onChangeText={setSubheading}
                  placeholder="Enter email subheading..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  style={{
                    backgroundColor: "#232323",
                    borderRadius: 12,
                    padding: 14,
                    color: "#ffffff",
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                />
              </View>

              {/* Image */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  Image
                </Text>
                {imageUri ? (
                  <View>
                    <Image
                      source={{ uri: imageUri }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 12,
                        marginBottom: 12,
                      }}
                      contentFit="cover"
cachePolicy="memory-disk"
                    />
                    <TouchableOpacity
                      onPress={() => setImageUri(null)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        backgroundColor: "#232323",
                        borderRadius: 8,
                        alignSelf: "flex-start",
                      }}
                    >
                      <Text style={{ color: "#ba9988", fontSize: 14, fontWeight: "600" }}>
                        Remove Image
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={pickImage}
                    style={{
                      backgroundColor: "#232323",
                      borderRadius: 12,
                      padding: 40,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "rgba(186, 153, 136, 0.2)",
                      borderStyle: "dashed",
                    }}
                  >
                    <MaterialIcons name="image" size={32} color="rgba(186, 153, 136, 0.5)" />
                    <Text
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        marginTop: 8,
                        fontSize: 14,
                      }}
                    >
                      Tap to add image
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Content */}
              <View style={{ marginBottom: 24 }}>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  label="Content"
                  required
                  placeholder="Enter email content..."
                />
              </View>

              {/* Actions */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={resetForm}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
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
                  onPress={handleSend}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
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
                    {sendType === "scheduled" ? "Schedule Send" : "Send Now"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

