export interface VideoCallParticipant {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isLocal: boolean;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  joinedAt: string;
}

export interface VideoCall {
  id: string;
  conversationId: string;
  roomName: string;
  dailyRoomUrl?: string;
  dailyRoomToken?: string;
  participants: VideoCallParticipant[];
  startedAt: string;
  endedAt?: string;
  status: "scheduled" | "active" | "ended";
  isGroupCall: boolean;
}

export interface DailyCallConfig {
  url: string;
  token?: string;
  userName: string;
  userData?: {
    userId: string;
    conversationId: string;
  };
}

export interface DailyParticipant {
  session_id: string;
  user_name?: string;
  user_id?: string;
  local?: boolean;
  owner?: boolean;
  owner_id?: string;
  joined_at?: number;
  will_eject_at?: number;
  video?: boolean;
  audio?: boolean;
  screen?: boolean;
  screen_video?: boolean;
  screen_audio?: boolean;
}

