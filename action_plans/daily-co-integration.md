# Daily.co Video Conferencing Integration Guide

## Overview

This document outlines the video conferencing implementation with Daily.co integration support. The foundation is in place and ready for Daily.co SDK integration.

## Current Implementation

### Files Created

1. **`types/video-call.ts`** - TypeScript types for video calls and participants
2. **`services/daily-co.ts`** - Daily.co service layer with mock implementations
3. **`app/pages/messages/[id]/video-call.tsx`** - Video call screen component
4. **Updated `app/pages/messages/[id].tsx`** - Added video call button in chat header

### Features Implemented

- ✅ Video call button in chat header
- ✅ Video call screen with controls
- ✅ Participant management
- ✅ Audio/video toggle controls
- ✅ Screen sharing support (desktop)
- ✅ Leave call functionality
- ✅ Daily.co service structure (ready for integration)

## Daily.co Integration Steps

### 1. Install Daily.co SDK

```bash
npm install @daily-co/react-native-daily-js
```

For React Native, you may also need:
```bash
npm install @daily-co/daily-js
```

### 2. Set Up Environment Variables

Add to your `.env` file:
```
EXPO_PUBLIC_DAILY_CO_API_KEY=your_api_key_here
EXPO_PUBLIC_DAILY_CO_DOMAIN=your-domain.daily.co
```

### 3. Backend Setup (Recommended)

For production, create a backend API to:
- Generate Daily.co rooms securely
- Create room tokens with proper permissions
- Manage room lifecycle

Example backend endpoint:
```typescript
POST /api/video-calls/create-room
{
  conversationId: string,
  isGroupCall: boolean
}

Response:
{
  roomUrl: string,
  roomToken: string,
  roomName: string
}
```

### 4. Update Daily.co Service

Replace mock implementations in `services/daily-co.ts`:

```typescript
import DailyIframe from '@daily-co/react-native-daily-js';

export async function createDailyRoom(conversationId: string, isGroupCall: boolean) {
  const response = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${DAILY_CO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `bdn-${conversationId}-${Date.now()}`,
      privacy: "private",
      properties: {
        enable_screenshare: true,
        enable_chat: true,
        enable_knocking: true,
        max_participants: isGroupCall ? 50 : 2,
      },
    }),
  });
  
  return await response.json();
}
```

### 5. Update Video Call Screen

In `app/pages/messages/[id]/video-call.tsx`, replace the placeholder video grid with Daily.co components:

```typescript
import DailyIframe from '@daily-co/react-native-daily-js';

// In the component:
const callFrameRef = useRef<DailyIframe | null>(null);

useEffect(() => {
  if (callConfig) {
    const callFrame = DailyIframe.createFrame();
    callFrameRef.current = callFrame;
    
    callFrame.join({ url: callConfig.url, token: callConfig.token });
    
    callFrame.on('participant-joined', (event) => {
      handleParticipantJoined(event.participant);
    });
    
    callFrame.on('participant-left', (event) => {
      handleParticipantLeft(event.participant.session_id);
    });
    
    return () => {
      callFrame.leave();
    };
  }
}, [callConfig]);
```

### 6. Implement Video Controls

Update the control handlers to use Daily.co API:

```typescript
const handleToggleMute = () => {
  callFrameRef.current?.setLocalAudio(!isMuted);
  setIsMuted(!isMuted);
};

const handleToggleVideo = () => {
  callFrameRef.current?.setLocalVideo(!isVideoOff);
  setIsVideoOff(!isVideoOff);
};

const handleToggleScreenShare = async () => {
  if (!isScreenSharing) {
    await callFrameRef.current?.startScreenShare();
  } else {
    await callFrameRef.current?.stopScreenShare();
  }
  setIsScreenSharing(!isScreenSharing);
};
```

## UI Features

### Video Call Screen

- **Video Grid**: Displays all participants' video streams
- **Controls Bar**: 
  - Mute/Unmute microphone
  - Toggle video on/off
  - Screen sharing (desktop only)
  - Leave call
- **Participant Count**: Shows number of active participants
- **Participant Indicators**: Shows who's sharing screen, muted, etc.

### Chat Integration

- Video call button appears in chat header
- Supports both direct and group calls
- Call state persists during navigation

## Testing

1. Start a video call from any conversation
2. Test audio/video toggles
3. Test screen sharing (desktop)
4. Test leaving call
5. Test with multiple participants (group calls)

## Security Considerations

1. **Room Tokens**: Generate server-side for security
2. **Room Privacy**: Use private rooms for conversations
3. **Access Control**: Verify user permissions before joining
4. **Token Expiration**: Set appropriate expiration times

## Next Steps

1. Install Daily.co SDK
2. Set up backend API for room/token generation
3. Replace mock implementations with real Daily.co calls
4. Add error handling and reconnection logic
5. Add call notifications
6. Add call history/recording (if needed)

## Resources

- [Daily.co Documentation](https://docs.daily.co/)
- [Daily.co React Native SDK](https://github.com/daily-co/daily-js)
- [Daily.co API Reference](https://docs.daily.co/reference/rest-api)

