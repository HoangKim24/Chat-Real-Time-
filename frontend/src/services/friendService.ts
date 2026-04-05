import api from './api';

export interface FriendRequestDto {
  receiverId: number;
}

export interface Friend {
  id: number;
  userId: number;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  status?: string; // online, offline, idle, dnd
  activity?: string;
}

export interface FriendRequest {
  id: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  receiverId: number;
  receiverName?: string;
  status: string; // pending, accepted, rejected
  createdAt: string;
}

const friendService = {
  getFriends: async (): Promise<Friend[]> => {
    const response = await api.get('/Friend/get-friends');
    return response.data;
  },

  getFriendRequests: async (): Promise<FriendRequest[]> => {
    const response = await api.get('/FriendRequest/friend-requests');
    return response.data;
  },

  sendFriendRequest: async (data: FriendRequestDto) => {
    const response = await api.post('/FriendRequest/send-friend-request', data);
    return response.data;
  },

  acceptFriendRequest: async (requestId: number) => {
    const response = await api.post('/FriendRequest/accept-friend-request', requestId);
    return response.data;
  },
};

export default friendService;
