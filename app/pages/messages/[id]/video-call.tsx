import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  StatusBar as RNStatusBar,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { getDailyCallConfig } from "../../../../services/daily-co";
import { VideoCallParticipant } from "../../../../types/video-call";

/**
 * Video Call Screen
 * 
 * This screen handles video conferencing using Daily.co
 * 
 * To integrate Daily.co:
 * 1. Install: npm install @daily-co/react-native-daily-js
 * 2. Import DailyIframe or DailyReactNative from the package
 * 3. Replace the mock implementation with actual Daily.co components
 * 
 * Example integration:
 * import DailyIframe from '@daily-co/react-native-daily-js';
 * 
 * Then use:
 * <DailyIframe
 *   url={callConfig.url}
 *   token={callConfig.token}
 *   showLeaveButton={false}
 *   onLeftMeeting={handleLeaveCall}
 *   onParticipantJoined={handleParticipantJoined}
 *   onParticipantLeft={handleParticipantLeft}
 * />
 */

export default function VideoCallScreen() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isMobile = width < 768;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<VideoCallParticipant[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callConfig, setCallConfig] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: string; text: string; timestamp: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  
  // A/V Settings
  const [videoBackground, setVideoBackground] = useState<"none" | "blur" | "image">("none");
  const [backgroundBlurLevel, setBackgroundBlurLevel] = useState(10);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const [echoCancellation, setEchoCancellation] = useState(true);
  const [autoGainControl, setAutoGainControl] = useState(true);
  
  const currentUserId = "user1";
  const currentUserName = "You";
  const conversationId = id || "";
  const isGroupCall = conversationId.startsWith("group-");
  const chatPanelWidth = isMobile ? width * 0.85 : 320;

  useEffect(() => {
    initializeCall();
    return () => {
      // Cleanup on unmount
      leaveCall();
    };
  }, []);

  const initializeCall = async () => {
    try {
      setIsLoading(true);
      
      // Get Daily.co call configuration
      const config = await getDailyCallConfig(
        conversationId,
        currentUserId,
        currentUserName,
        isGroupCall
      );
      
      setCallConfig(config);
      
      // Add local participant
      const localParticipant: VideoCallParticipant = {
        id: currentUserId,
        userId: currentUserId,
        userName: currentUserName,
        isLocal: true,
        isAudioEnabled: true,
        isVideoEnabled: true,
        isScreenSharing: false,
        joinedAt: new Date().toISOString(),
      };
      
      setParticipants([localParticipant]);
      setIsConnected(true);
      setIsLoading(false);
      
      // Simulate other participants joining the call
      setTimeout(() => {
        const mockParticipants: VideoCallParticipant[] = [
          {
            id: "user2",
            userId: "user2",
            userName: "Sarah Johnson",
            isLocal: false,
            isAudioEnabled: true,
            isVideoEnabled: true,
            isScreenSharing: false,
            joinedAt: new Date().toISOString(),
          },
          {
            id: "user3",
            userId: "user3",
            userName: "Marcus Williams",
            isLocal: false,
            isAudioEnabled: true,
            isVideoEnabled: false,
            isScreenSharing: false,
            joinedAt: new Date().toISOString(),
          },
          {
            id: "user4",
            userId: "user4",
            userName: "Jasmine Brown",
            isLocal: false,
            isAudioEnabled: false,
            isVideoEnabled: true,
            isScreenSharing: false,
            joinedAt: new Date().toISOString(),
          },
        ];
        
        setParticipants([localParticipant, ...mockParticipants]);
        
        // Add welcome chat messages
        setTimeout(() => {
          setChatMessages([
            {
              id: "chat-1",
              sender: "Sarah Johnson",
              text: "Hey everyone! 👋",
              timestamp: new Date().toISOString(),
            },
            {
              id: "chat-2",
              sender: "Marcus Williams",
              text: "Great to see you all!",
              timestamp: new Date().toISOString(),
            },
          ]);
        }, 2000);
      }, 1500);
      
      // TODO: Initialize Daily.co call here
      // Example:
      // const call = DailyIframe.createFrame(/* config */);
      // await call.join({ url: config.url, token: config.token });
      
    } catch (error) {
      console.error("Error initializing call:", error);
      Alert.alert("Error", "Failed to start video call. Please try again.");
      setIsLoading(false);
      router.back();
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Toggle audio in Daily.co call
    // call.setLocalAudio(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // TODO: Toggle video in Daily.co call
    // call.setLocalVideo(!isVideoOff);
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // TODO: Toggle screen share in Daily.co call
    // if (!isScreenSharing) {
    //   call.startScreenShare();
    // } else {
    //   call.stopScreenShare();
    // }
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: `chat-${Date.now()}`,
      sender: currentUserName,
      text: chatInput.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");
    
    // TODO: Send message via Daily.co chat API
    // call.sendAppMessage({ type: 'chat', ...newMessage });
  };

  const handleApplyVideoBackground = () => {
    // TODO: Apply video background settings to Daily.co
    // if (videoBackground === "blur") {
    //   call.setInputDevicesAsync({ videoDeviceId: "blur" });
    //   call.setBackgroundBlur({ blur: backgroundBlurLevel });
    // } else if (videoBackground === "image" && backgroundImage) {
    //   call.setBackgroundImage({ url: backgroundImage });
    // } else {
    //   call.setBackgroundBlur({ blur: 0 });
    // }
    setShowSettings(false);
  };

  const handleLeaveCall = () => {
    Alert.alert(
      "Leave Call?",
      "Are you sure you want to leave the video call?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            leaveCall();
            router.back();
          },
        },
      ]
    );
  };

  const leaveCall = () => {
    setIsConnected(false);
    // TODO: Leave Daily.co call
    // call.leave();
  };

  const handleParticipantJoined = (participant: VideoCallParticipant) => {
    setParticipants((prev) => [...prev, participant]);
  };

  const handleParticipantLeft = (participantId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== participantId));
  };

  const renderParticipantVideo = (
    participant: VideoCallParticipant,
    containerWidth: number,
    containerHeight: number
  ) => {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {participant.isVideoEnabled ? (
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#1a1a1a",
            }}
          >
            {/* TODO: Render actual video stream here */}
            <Text style={{ color: "#ffffff", fontSize: isMobile ? 14 : 16 }}>
              {participant.userName} {participant.isLocal ? "(You)" : ""}
            </Text>
            {participant.isScreenSharing && (
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <MaterialIcons name="screen-share" size={14} color="#ffffff" />
                <Text style={{ color: "#ffffff", fontSize: 10 }}>Sharing</Text>
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#474747",
            }}
          >
            <View
              style={{
                width: Math.min(containerWidth * 0.3, 80),
                height: Math.min(containerWidth * 0.3, 80),
                borderRadius: Math.min(containerWidth * 0.15, 40),
                backgroundColor: "#ba9988",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: Math.min(containerWidth * 0.1, 24),
                  fontWeight: "700",
                }}
              >
                {participant.userName.charAt(0)}
              </Text>
            </View>
            <Text
              style={{
                color: "#ffffff",
                fontSize: isMobile ? 12 : 14,
                marginTop: 8,
              }}
            >
              {participant.userName}
            </Text>
          </View>
        )}
        {!participant.isAudioEnabled && (
          <View
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <MaterialIcons name="mic-off" size={14} color="#ffffff" />
          </View>
        )}
        {participant.isLocal && (
          <View
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "rgba(186, 153, 136, 0.9)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 10, fontWeight: "600" }}>
              You
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#232323", justifyContent: "center", alignItems: "center" }}>
        <StatusBar style="light" />
        <MaterialIcons name="videocam" size={64} color="#ba9988" />
        <Text style={{ color: "#ffffff", fontSize: 18, marginTop: 16 }}>
          Connecting to call...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar style="light" />
      <RNStatusBar barStyle="light-content" />
      
      {/* Video Grid */}
      <View style={{ flex: 1, position: "relative" }}>
        {/* TODO: Replace with Daily.co video components */}
        {/* This is a placeholder for the actual video grid */}
        <View
          style={{
            flex: 1,
            backgroundColor: "#232323",
            padding: 16,
          }}
        >
          {participants.length === 1 ? (
            // Single participant - full screen
            <View
              style={{
                flex: 1,
                backgroundColor: "#474747",
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#ba9988",
              }}
            >
              {renderParticipantVideo(participants[0], width, height)}
            </View>
          ) : (
            // Multiple participants - grid layout
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {participants.map((participant) => {
                const gridWidth = isMobile 
                  ? (width - 40 - 8) / 2 
                  : (width - 80 - 24) / 2;
                const gridHeight = isMobile
                  ? (height - 200 - 8) / 2
                  : (height - 200 - 24) / 2;
                
                return (
                  <View
                    key={participant.id}
                    style={{
                      width: gridWidth,
                      height: gridHeight,
                      backgroundColor: "#474747",
                      borderRadius: 16,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: participant.isLocal ? "#ba9988" : "rgba(186, 153, 136, 0.3)",
                      overflow: "hidden",
                    }}
                  >
                    {renderParticipantVideo(participant, gridWidth, gridHeight)}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* Controls Bar */}
      <View
        style={{
          paddingHorizontal: isMobile ? 12 : 40,
          paddingVertical: isMobile ? 12 : 20,
          backgroundColor: "#232323",
          borderTopWidth: 1,
          borderTopColor: "rgba(71, 71, 71, 0.3)",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: isMobile ? 8 : 16,
          }}
        >
          {/* Mute/Unmute */}
          <TouchableOpacity
            onPress={handleToggleMute}
            style={{
              width: isMobile ? 48 : 56,
              height: isMobile ? 48 : 56,
              borderRadius: isMobile ? 24 : 28,
              backgroundColor: isMuted ? "#d32f2f" : "#474747",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons
              name={isMuted ? "mic-off" : "mic"}
              size={isMobile ? 20 : 24}
              color="#ffffff"
            />
          </TouchableOpacity>

          {/* Video On/Off */}
          <TouchableOpacity
            onPress={handleToggleVideo}
            style={{
              width: isMobile ? 48 : 56,
              height: isMobile ? 48 : 56,
              borderRadius: isMobile ? 24 : 28,
              backgroundColor: isVideoOff ? "#d32f2f" : "#474747",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons
              name={isVideoOff ? "videocam-off" : "videocam"}
              size={isMobile ? 20 : 24}
              color="#ffffff"
            />
          </TouchableOpacity>

          {/* Screen Share */}
          {!isMobile && (
            <TouchableOpacity
              onPress={handleToggleScreenShare}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: isScreenSharing ? "#ba9988" : "#474747",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name="screen-share"
                size={24}
                color="#ffffff"
              />
            </TouchableOpacity>
          )}

          {/* Chat Toggle */}
          <TouchableOpacity
            onPress={() => setShowChat(!showChat)}
            style={{
              width: isMobile ? 48 : 56,
              height: isMobile ? 48 : 56,
              borderRadius: isMobile ? 24 : 28,
              backgroundColor: showChat ? "#ba9988" : "#474747",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="chat" size={isMobile ? 20 : 24} color="#ffffff" />
            {chatMessages.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: isMobile ? 6 : 8,
                  right: isMobile ? 6 : 8,
                  width: isMobile ? 16 : 18,
                  height: isMobile ? 16 : 18,
                  borderRadius: isMobile ? 8 : 9,
                  backgroundColor: "#d32f2f",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: isMobile ? 9 : 10, fontWeight: "700" }}>
                  {chatMessages.length > 9 ? "9+" : chatMessages.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            onPress={() => setShowSettings(true)}
            style={{
              width: isMobile ? 48 : 56,
              height: isMobile ? 48 : 56,
              borderRadius: isMobile ? 24 : 28,
              backgroundColor: "#474747",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="settings" size={isMobile ? 20 : 24} color="#ffffff" />
          </TouchableOpacity>

          {/* Leave Call */}
          <TouchableOpacity
            onPress={handleLeaveCall}
            style={{
              width: isMobile ? 48 : 56,
              height: isMobile ? 48 : 56,
              borderRadius: isMobile ? 24 : 28,
              backgroundColor: "#d32f2f",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="call-end" size={isMobile ? 20 : 24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Participant Count */}
        <Text
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: isMobile ? 11 : 12,
            textAlign: "center",
            marginTop: isMobile ? 8 : 12,
          }}
        >
          {participants.length} {participants.length === 1 ? "participant" : "participants"}
        </Text>
      </View>

      {/* Chat Panel */}
      {showChat && (
        <View
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: chatPanelWidth,
            backgroundColor: "#232323",
            borderLeftWidth: 1,
            borderLeftColor: "rgba(71, 71, 71, 0.3)",
            zIndex: 1000,
          }}
        >
          {/* Chat Header */}
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(71, 71, 71, 0.3)",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }}>
              Chat
            </Text>
            <TouchableOpacity onPress={() => setShowChat(false)}>
              <MaterialIcons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Chat Messages */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16, gap: 12 }}
          >
            {chatMessages.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 40,
                }}
              >
                <MaterialIcons name="chat-bubble-outline" size={48} color="rgba(255, 255, 255, 0.3)" />
                <Text style={{ color: "rgba(255, 255, 255, 0.5)", marginTop: 16, textAlign: "center" }}>
                  No messages yet
                </Text>
              </View>
            ) : (
              chatMessages.map((message) => (
                <View
                  key={message.id}
                  style={{
                    alignSelf: message.sender === currentUserName ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                  }}
                >
                  {message.sender !== currentUserName && (
                    <Text
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: 12,
                        marginBottom: 4,
                      }}
                    >
                      {message.sender}
                    </Text>
                  )}
                  <View
                    style={{
                      backgroundColor: message.sender === currentUserName ? "#ba9988" : "#474747",
                      borderRadius: 16,
                      padding: 12,
                    }}
                  >
                    <Text style={{ color: "#ffffff", fontSize: 14 }}>
                      {message.text}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontSize: 10,
                      marginTop: 4,
                      textAlign: message.sender === currentUserName ? "right" : "left",
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>

          {/* Chat Input */}
          <View
            style={{
              padding: 16,
              borderTopWidth: 1,
              borderTopColor: "rgba(71, 71, 71, 0.3)",
              flexDirection: "row",
              gap: 8,
            }}
          >
            <TextInput
              value={chatInput}
              onChangeText={setChatInput}
              placeholder="Type a message..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              style={{
                flex: 1,
                backgroundColor: "#474747",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 10,
                color: "#ffffff",
                fontSize: 14,
              }}
              onSubmitEditing={handleSendChatMessage}
            />
            <TouchableOpacity
              onPress={handleSendChatMessage}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#ba9988",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="send" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#232323",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: height * 0.9,
              paddingBottom: Platform.OS === "ios" ? 40 : 20,
            }}
          >
            {/* Settings Header */}
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(71, 71, 71, 0.3)",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "700" }}>
                Settings
              </Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <MaterialIcons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 20, gap: 24 }}
            >
              {/* Video Background Section */}
              <View>
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600", marginBottom: 16 }}>
                  Video Background
                </Text>
                
                <View style={{ gap: 12 }}>
                  {/* None */}
                  <TouchableOpacity
                    onPress={() => setVideoBackground("none")}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 12,
                      backgroundColor: videoBackground === "none" ? "#474747" : "transparent",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: videoBackground === "none" ? "#ba9988" : "rgba(71, 71, 71, 0.3)",
                    }}
                  >
                    <MaterialIcons
                      name={videoBackground === "none" ? "radio-button-checked" : "radio-button-unchecked"}
                      size={20}
                      color={videoBackground === "none" ? "#ba9988" : "rgba(255, 255, 255, 0.6)"}
                    />
                    <Text style={{ color: "#ffffff", marginLeft: 12, fontSize: 14 }}>
                      None
                    </Text>
                  </TouchableOpacity>

                  {/* Blur */}
                  <TouchableOpacity
                    onPress={() => setVideoBackground("blur")}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 12,
                      backgroundColor: videoBackground === "blur" ? "#474747" : "transparent",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: videoBackground === "blur" ? "#ba9988" : "rgba(71, 71, 71, 0.3)",
                    }}
                  >
                    <MaterialIcons
                      name={videoBackground === "blur" ? "radio-button-checked" : "radio-button-unchecked"}
                      size={20}
                      color={videoBackground === "blur" ? "#ba9988" : "rgba(255, 255, 255, 0.6)"}
                    />
                    <Text style={{ color: "#ffffff", marginLeft: 12, fontSize: 14 }}>
                      Blur Background
                    </Text>
                  </TouchableOpacity>

                  {/* Blur Level Slider */}
                  {videoBackground === "blur" && (
                    <View style={{ marginLeft: 32, marginTop: 8, padding: 12, backgroundColor: "#1a1a1a", borderRadius: 8 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                        <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 12 }}>
                          Blur Level
                        </Text>
                        <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "600" }}>
                          {backgroundBlurLevel}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                        <TouchableOpacity
                          onPress={() => setBackgroundBlurLevel(Math.max(1, backgroundBlurLevel - 1))}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: "#474747",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <MaterialIcons name="remove" size={20} color="#ffffff" />
                        </TouchableOpacity>
                        <View style={{ flex: 1, height: 6, backgroundColor: "#474747", borderRadius: 3, position: "relative" }}>
                          <View
                            style={{
                              width: `${(backgroundBlurLevel / 20) * 100}%`,
                              height: "100%",
                              backgroundColor: "#ba9988",
                              borderRadius: 3,
                            }}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => setBackgroundBlurLevel(Math.min(20, backgroundBlurLevel + 1))}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: "#474747",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <MaterialIcons name="add" size={20} color="#ffffff" />
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                        <Text style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 10 }}>Light</Text>
                        <Text style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 10 }}>Heavy</Text>
                      </View>
                    </View>
                  )}

                  {/* Custom Image */}
                  <TouchableOpacity
                    onPress={() => setVideoBackground("image")}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 12,
                      backgroundColor: videoBackground === "image" ? "#474747" : "transparent",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: videoBackground === "image" ? "#ba9988" : "rgba(71, 71, 71, 0.3)",
                    }}
                  >
                    <MaterialIcons
                      name={videoBackground === "image" ? "radio-button-checked" : "radio-button-unchecked"}
                      size={20}
                      color={videoBackground === "image" ? "#ba9988" : "rgba(255, 255, 255, 0.6)"}
                    />
                    <Text style={{ color: "#ffffff", marginLeft: 12, fontSize: 14 }}>
                      Custom Image
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Audio Settings Section */}
              <View>
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600", marginBottom: 16 }}>
                  Audio Settings
                </Text>
                
                <View style={{ gap: 16 }}>
                  {/* Noise Suppression */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 8,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "#ffffff", fontSize: 14 }}>
                        Noise Suppression
                      </Text>
                      <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 12, marginTop: 4 }}>
                        Reduce background noise
                      </Text>
                    </View>
                    <Switch
                      value={noiseSuppression}
                      onValueChange={setNoiseSuppression}
                      trackColor={{ false: "#474747", true: "#ba9988" }}
                      thumbColor="#ffffff"
                    />
                  </View>

                  {/* Echo Cancellation */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 8,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "#ffffff", fontSize: 14 }}>
                        Echo Cancellation
                      </Text>
                      <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 12, marginTop: 4 }}>
                        Prevent audio feedback
                      </Text>
                    </View>
                    <Switch
                      value={echoCancellation}
                      onValueChange={setEchoCancellation}
                      trackColor={{ false: "#474747", true: "#ba9988" }}
                      thumbColor="#ffffff"
                    />
                  </View>

                  {/* Auto Gain Control */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 8,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "#ffffff", fontSize: 14 }}>
                        Auto Gain Control
                      </Text>
                      <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 12, marginTop: 4 }}>
                        Automatically adjust volume
                      </Text>
                    </View>
                    <Switch
                      value={autoGainControl}
                      onValueChange={setAutoGainControl}
                      trackColor={{ false: "#474747", true: "#ba9988" }}
                      thumbColor="#ffffff"
                    />
                  </View>
                </View>
              </View>

              {/* Apply Button */}
              <TouchableOpacity
                onPress={handleApplyVideoBackground}
                style={{
                  backgroundColor: "#ba9988",
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>
                  Apply Settings
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

