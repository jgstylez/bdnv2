import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, Platform, KeyboardAvoidingView, Modal, Alert } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Message, MessageAttachment } from '@/types/messages';

// Mock messages by conversation ID
const getMessagesForConversation = (conversationId: string): Message[] => {
  const messagesByConversation: Record<string, Message[]> = {
    "conv-1": [
      {
        id: "msg-1",
        conversationId: "conv-1",
        senderId: "business-1",
        senderName: "Soul Food Kitchen",
        recipientId: "user1",
        recipientName: "You",
        text: "Thank you for your order! Your food will be ready in 15 minutes.",
        read: false,
        createdAt: "2024-02-15T10:30:00Z",
      },
      {
        id: "msg-2",
        conversationId: "conv-1",
        senderId: "user1",
        senderName: "You",
        recipientId: "business-1",
        recipientName: "Soul Food Kitchen",
        text: "Great! I'll be there soon.",
        read: true,
        createdAt: "2024-02-15T10:31:00Z",
      },
      {
        id: "msg-3",
        conversationId: "conv-1",
        senderId: "business-1",
        senderName: "Soul Food Kitchen",
        recipientId: "user1",
        recipientName: "You",
        text: "Perfect! See you then.",
        read: false,
        createdAt: "2024-02-15T10:32:00Z",
      },
    ],
    "group-1": [
      {
        id: "group-msg-1",
        conversationId: "group-1",
        senderId: "user2",
        senderName: "Sarah Johnson",
        recipientId: "group-1",
        recipientName: "Black Business Network",
        text: "Hey everyone! Welcome to the Black Business Network group 🎉",
        read: true,
        createdAt: "2024-02-15T10:00:00Z",
      },
      {
        id: "group-msg-2",
        conversationId: "group-1",
        senderId: "user1",
        senderName: "You",
        recipientId: "group-1",
        recipientName: "Black Business Network",
        text: "Thanks for adding me! Excited to connect with everyone.",
        read: true,
        createdAt: "2024-02-15T10:05:00Z",
      },
      {
        id: "group-msg-3",
        conversationId: "group-1",
        senderId: "user4",
        senderName: "Jasmine Brown",
        recipientId: "group-1",
        recipientName: "Black Business Network",
        text: "Welcome! Feel free to share your business or ask questions.",
        read: true,
        createdAt: "2024-02-15T10:10:00Z",
      },
      {
        id: "group-msg-4",
        conversationId: "group-1",
        senderId: "user5",
        senderName: "David Lee",
        recipientId: "group-1",
        recipientName: "Black Business Network",
        text: "Anyone know of good networking events coming up?",
        read: true,
        createdAt: "2024-02-15T12:30:00Z",
      },
      {
        id: "group-msg-5",
        conversationId: "group-1",
        senderId: "user3",
        senderName: "Marcus Williams",
        recipientId: "group-1",
        recipientName: "Black Business Network",
        text: "Just checked out the new restaurant downtown - amazing food! 🍽️",
        read: false,
        createdAt: "2024-02-15T14:20:00Z",
      },
      {
        id: "group-msg-6",
        conversationId: "group-1",
        senderId: "user4",
        senderName: "Jasmine Brown",
        recipientId: "group-1",
        recipientName: "Black Business Network",
        text: "Oh nice! What's it called? I've been looking for new spots.",
        read: false,
        createdAt: "2024-02-15T14:25:00Z",
      },
      {
        id: "group-msg-7",
        conversationId: "group-1",
        senderId: "user2",
        senderName: "Sarah Johnson",
        recipientId: "group-1",
        recipientName: "Black Business Network",
        text: "I've been there too! The owner is super friendly and supports local suppliers.",
        read: false,
        createdAt: "2024-02-15T14:30:00Z",
      },
    ],
    "group-2": [
      {
        id: "group2-msg-1",
        conversationId: "group-2",
        senderId: "user6",
        senderName: "Alex Thompson",
        recipientId: "group-2",
        recipientName: "Community Events",
        text: "Who's going to the networking event this weekend?",
        read: true,
        createdAt: "2024-02-15T11:45:00Z",
      },
      {
        id: "group2-msg-2",
        conversationId: "group-2",
        senderId: "user1",
        senderName: "You",
        recipientId: "group-2",
        recipientName: "Community Events",
        text: "I'll be there! Looking forward to it.",
        read: true,
        createdAt: "2024-02-15T11:50:00Z",
      },
      {
        id: "group2-msg-3",
        conversationId: "group-2",
        senderId: "user7",
        senderName: "Maria Garcia",
        recipientId: "group-2",
        recipientName: "Community Events",
        text: "Same here! Should we meet up beforehand?",
        read: true,
        createdAt: "2024-02-15T11:55:00Z",
      },
      {
        id: "group2-msg-4",
        conversationId: "group-2",
        senderId: "user8",
        senderName: "James Wilson",
        recipientId: "group-2",
        recipientName: "Community Events",
        text: "Great idea! Let's coordinate in the group chat.",
        read: true,
        createdAt: "2024-02-15T12:00:00Z",
      },
    ],
  };

  return messagesByConversation[conversationId] || [];
};

// Conversation metadata
const getConversationInfo = (conversationId: string): { name: string; isGroup: boolean; participantCount?: number } => {
  const info: Record<string, { name: string; isGroup: boolean; participantCount?: number }> = {
    "conv-1": { name: "Soul Food Kitchen", isGroup: false },
    "conv-2": { name: "BDN Support", isGroup: false },
    "conv-3": { name: "Sarah Johnson", isGroup: false },
    "group-1": { name: "Black Business Network", isGroup: true, participantCount: 5 },
    "group-2": { name: "Community Events", isGroup: true, participantCount: 4 },
  };
  return info[conversationId] || { name: "Unknown", isGroup: false };
};

// Common emojis
const commonEmojis = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
  "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
  "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
  "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
  "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬",
  "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "👏", "🙌", "👐",
  "❤️", "💛", "💚", "💙", "💜", "🖤", "🤍", "💔", "❣️", "💕",
  "💖", "💗", "💘", "💝", "💞", "💟", "☮️", "✝️", "☪️", "🕉",
  "🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🥈", "🥉", "⭐", "🌟",
];

export default function ConversationDetail() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isMobile = width < 768;
  const conversationId = id || "conv-1";
  const conversationInfo = getConversationInfo(conversationId);
  const [messages, setMessages] = useState<Message[]>(getMessagesForConversation(conversationId));
  const [messageInput, setMessageInput] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const currentUserId = "user1";
  const conversationName = conversationInfo.name;
  const isGroup = conversationInfo.isGroup;

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

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
          thumbnailUrl: asset.uri,
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

  const handleStartRecording = async () => {
    try {
      // Request microphone permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      // TODO: Request audio recording permissions
      setIsRecording(true);
      setShowAttachmentMenu(false);
      // TODO: Start audio recording
      Alert.alert("Voice Note", "Recording started. Tap stop when done.");
    } catch (error) {
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // TODO: Stop recording and add audio attachment
    const newAttachment: MessageAttachment = {
      id: `audio-${Date.now()}`,
      type: "audio",
      url: "mock-audio-url",
      fileName: "voice-note.m4a",
      duration: 30, // Mock duration
    };
    setAttachments([...attachments, newAttachment]);
    Alert.alert("Voice Note", "Recording saved");
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments(attachments.filter(a => a.id !== attachmentId));
  };

  const handleEmojiPress = (emoji: string) => {
    setMessageInput(messageInput + emoji);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() && attachments.length === 0) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: conversationId,
      senderId: currentUserId,
      senderName: "You",
      recipientId: isGroup ? conversationId : (conversationId === "conv-1" ? "business-1" : "user2"),
      recipientName: conversationName,
      text: messageInput.trim(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
    setAttachments([]);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Generate avatar color based on sender name
  const getAvatarColor = (name: string): string => {
    const colors = ["#ba9988", "#8B6F47", "#A67C52", "#C49A6C", "#D4A574", "#E6B88A"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Get avatar initial
  const getAvatarInitial = (name: string): string => {
    if (name === "You") return "Y";
    return name.charAt(0).toUpperCase();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#232323" }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: isMobile ? 20 : 40,
            paddingTop: Platform.OS === "web" ? 20 : 36,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(71, 71, 71, 0.3)",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#ba9988",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isGroup ? (
              <MaterialIcons name="groups" size={20} color="#ffffff" />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#ffffff",
                }}
              >
                {conversationName.charAt(0)}
              </Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              {conversationName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              {isGroup ? `${conversationInfo.participantCount} members` : "Online"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push(`/pages/messages/${conversationId}/video-call`)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#474747",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="videocam" size={20} color="#ba9988" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: isMobile ? 20 : 40,
            paddingVertical: 20,
            gap: 16,
          }}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {messages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId;
            const showAvatar = isGroup || !isOwnMessage;
            return (
              <View
                key={message.id}
                style={{
                  flexDirection: isOwnMessage ? "row-reverse" : "row",
                  alignSelf: isOwnMessage ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  gap: 8,
                  alignItems: "flex-start",
                }}
              >
                {/* Avatar - shown for group chats or non-own messages */}
                {showAvatar ? (
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: getAvatarColor(message.senderName),
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#ffffff",
                      }}
                    >
                      {getAvatarInitial(message.senderName)}
                    </Text>
                  </View>
                ) : (
                  <View style={{ width: 32 }} />
                )}
                <View style={{ flex: 1, minWidth: 0 }}>
                  {!isOwnMessage && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.6)",
                        marginBottom: 4,
                        paddingLeft: 4,
                      }}
                    >
                      {message.senderName}
                    </Text>
                  )}
                  {isOwnMessage && isGroup && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.6)",
                        marginBottom: 4,
                        paddingRight: 4,
                        textAlign: "right",
                      }}
                    >
                      {message.senderName}
                    </Text>
                  )}
                  <View
                    style={{
                      backgroundColor: isOwnMessage ? "#ba9988" : "#474747",
                      borderRadius: 16,
                      padding: 12,
                      borderTopLeftRadius: isOwnMessage ? 16 : 4,
                      borderTopRightRadius: isOwnMessage ? 4 : 16,
                    }}
                  >
                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <View style={{ gap: 8, marginBottom: message.text ? 8 : 0 }}>
                      {message.attachments.map((attachment) => (
                        <View key={attachment.id}>
                          {attachment.type === "image" && (
                            <Image
                              source={{ uri: attachment.url }}
                              style={{
                                width: 200,
                                height: 200,
                                borderRadius: 12,
                                backgroundColor: "#232323",
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
                                backgroundColor: "#232323",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <MaterialIcons name="play-circle-filled" size={48} color="#ba9988" />
                              {attachment.duration && (
                                <View
                                  style={{
                                    position: "absolute",
                                    bottom: 8,
                                    right: 8,
                                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                                    paddingHorizontal: 6,
                                    paddingVertical: 2,
                                    borderRadius: 4,
                                  }}
                                >
                                  <Text style={{ fontSize: 10, color: "#ffffff" }}>
                                    {formatDuration(attachment.duration)}
                                  </Text>
                                </View>
                              )}
                            </View>
                          )}
                          {(attachment.type === "document" || attachment.type === "audio") && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12,
                                backgroundColor: "#232323",
                                borderRadius: 12,
                                padding: 12,
                                minWidth: 200,
                              }}
                            >
                              <MaterialIcons
                                name={attachment.type === "audio" ? "mic" : "description"}
                                size={32}
                                color="#ba9988"
                              />
                              <View style={{ flex: 1 }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    fontWeight: "600",
                                    color: "#ffffff",
                                    marginBottom: 4,
                                  }}
                                  numberOfLines={1}
                                >
                                  {attachment.fileName || "File"}
                                </Text>
                                {attachment.type === "audio" && attachment.duration && (
                                  <Text style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.6)" }}>
                                    {formatDuration(attachment.duration)}
                                  </Text>
                                )}
                                {attachment.fileSize && (
                                  <Text style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.6)" }}>
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

                  {/* Message Text */}
                  {message.text && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#ffffff",
                        lineHeight: 20,
                      }}
                    >
                      {message.text}
                    </Text>
                  )}
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "rgba(255, 255, 255, 0.5)",
                      marginTop: 4,
                      textAlign: isOwnMessage ? "right" : "left",
                      paddingLeft: isOwnMessage ? 0 : 4,
                      paddingRight: isOwnMessage ? 4 : 0,
                    }}
                  >
                    {formatTime(message.createdAt)}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Pending Attachments Preview */}
        {attachments.length > 0 && (
          <View
            style={{
              paddingHorizontal: isMobile ? 20 : 40,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(71, 71, 71, 0.3)",
              backgroundColor: "#232323",
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
                    backgroundColor: "#474747",
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

        {/* Input */}
        <View
          style={{
            paddingHorizontal: isMobile ? 20 : 40,
            paddingVertical: 16,
            borderTopWidth: 1,
            borderTopColor: "rgba(71, 71, 71, 0.3)",
            backgroundColor: "#232323",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#474747",
              borderRadius: 24,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
              minHeight: 52,
            }}
          >
            {/* Attachment Button */}
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

            {/* Text Input */}
            <TextInput
              value={messageInput}
              onChangeText={setMessageInput}
              placeholder="Type a message..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              multiline
              textAlignVertical="center"
              style={{
                flex: 1,
                fontSize: 15,
                color: "#ffffff",
                maxHeight: 100,
                paddingVertical: 8,
                paddingHorizontal: 8,
                minHeight: 36,
                lineHeight: 20,
                textAlign: "left",
                includeFontPadding: false,
              }}
              onSubmitEditing={handleSendMessage}
            />

            {/* Emoji Button */}
            <TouchableOpacity
              onPress={() => setShowEmojiPicker(!showEmojiPicker)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MaterialIcons name="mood" size={22} color="rgba(255, 255, 255, 0.7)" />
            </TouchableOpacity>

            {/* Send Button */}
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!messageInput.trim() && attachments.length === 0}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: messageInput.trim() || attachments.length > 0 ? "#ba9988" : "rgba(186, 153, 136, 0.3)",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MaterialIcons
                name="send"
                size={18}
                color={messageInput.trim() || attachments.length > 0 ? "#ffffff" : "rgba(255, 255, 255, 0.5)"}
              />
            </TouchableOpacity>
          </View>
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

                <TouchableOpacity
                  onPress={isRecording ? handleStopRecording : handleStartRecording}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                    padding: 16,
                    backgroundColor: isRecording ? "rgba(255, 68, 68, 0.2)" : "#232323",
                    borderRadius: 12,
                    borderWidth: isRecording ? 2 : 0,
                    borderColor: "#ff4444",
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: isRecording ? "rgba(255, 68, 68, 0.3)" : "rgba(186, 153, 136, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons
                      name={isRecording ? "stop" : "mic"}
                      size={24}
                      color={isRecording ? "#ff4444" : "#ba9988"}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
                      {isRecording ? "Stop Recording" : "Voice Note"}
                    </Text>
                    <Text style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
                      {isRecording ? "Tap to stop recording" : "Record audio message"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Emoji Picker Modal */}
        <Modal
          visible={showEmojiPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowEmojiPicker(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "flex-end",
            }}
            activeOpacity={1}
            onPress={() => setShowEmojiPicker(false)}
          >
            <View
              style={{
                backgroundColor: "#474747",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 24,
                paddingBottom: Platform.OS === "ios" ? 40 : 24,
                maxHeight: "50%",
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
                  marginBottom: 20,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 16,
                }}
              >
                Emojis
              </Text>
              <ScrollView
                style={{ maxHeight: 300 }}
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {commonEmojis.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleEmojiPress(emoji)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#232323",
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}
