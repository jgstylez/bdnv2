/**
 * Daily.co Video Conferencing Service
 * 
 * This service provides integration with Daily.co for video conferencing.
 * 
 * Setup Instructions:
 * 1. Install Daily.co React Native SDK: npm install @daily-co/react-native-daily-js
 * 2. Get your Daily.co API key from https://dashboard.daily.co/
 * 3. Set DAILY_CO_API_KEY in your environment variables
 * 4. Configure your backend to generate room tokens (for security)
 * 
 * For production, you should generate room tokens server-side for security.
 * This is a client-side implementation for development/testing.
 */

import { DailyCallConfig, VideoCall } from "../types/video-call";

// Daily.co API configuration
const DAILY_CO_API_KEY = process.env.EXPO_PUBLIC_DAILY_CO_API_KEY || "";
const DAILY_CO_DOMAIN = process.env.EXPO_PUBLIC_DAILY_CO_DOMAIN || "your-domain.daily.co";

/**
 * Create a Daily.co room
 * Note: In production, this should be done server-side
 */
export async function createDailyRoom(conversationId: string, isGroupCall: boolean = false): Promise<{
  url: string;
  name: string;
  id: string;
}> {
  try {
    // In production, call your backend API to create the room
    // This is a mock implementation
    const roomName = `bdn-${conversationId}-${Date.now()}`;
    
    // For now, return a mock room URL
    // Replace this with actual Daily.co API call:
    /*
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DAILY_CO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        privacy: "private",
        properties: {
          enable_screenshare: true,
          enable_chat: true,
          enable_knocking: true,
          max_participants: isGroupCall ? 50 : 2,
        },
      }),
    });
    
    const data = await response.json();
    return {
      url: data.url,
      name: data.name,
      id: data.id,
    };
    */
    
    // Mock response for development
    return {
      url: `https://${DAILY_CO_DOMAIN}/${roomName}`,
      name: roomName,
      id: roomName,
    };
  } catch (error) {
    console.error("Error creating Daily.co room:", error);
    throw error;
  }
}

/**
 * Generate a Daily.co room token
 * Note: In production, this should be done server-side for security
 */
export async function generateDailyToken(
  roomName: string,
  userId: string,
  userName: string,
  isOwner: boolean = false
): Promise<string> {
  try {
    // In production, call your backend API to generate the token
    // This is a mock implementation
    // Replace this with actual Daily.co API call:
    /*
    const response = await fetch("https://api.daily.co/v1/meeting-tokens", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DAILY_CO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_id: userId,
          user_name: userName,
          is_owner: isOwner,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
        },
      }),
    });
    
    const data = await response.json();
    return data.token;
    */
    
    // Mock token for development
    return `mock-token-${roomName}-${userId}-${Date.now()}`;
  } catch (error) {
    console.error("Error generating Daily.co token:", error);
    throw error;
  }
}

/**
 * Get Daily.co call configuration
 */
export async function getDailyCallConfig(
  conversationId: string,
  userId: string,
  userName: string,
  isGroupCall: boolean = false
): Promise<DailyCallConfig> {
  const room = await createDailyRoom(conversationId, isGroupCall);
  const token = await generateDailyToken(room.name, userId, userName, true);
  
  return {
    url: room.url,
    token: token,
    userName: userName,
    userData: {
      userId: userId,
      conversationId: conversationId,
    },
  };
}

/**
 * Delete a Daily.co room
 */
export async function deleteDailyRoom(roomName: string): Promise<void> {
  try {
    // In production, call your backend API to delete the room
    // Replace this with actual Daily.co API call:
    /*
    await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${DAILY_CO_API_KEY}`,
      },
    });
    */
    console.log(`Room ${roomName} would be deleted`);
  } catch (error) {
    console.error("Error deleting Daily.co room:", error);
    throw error;
  }
}

