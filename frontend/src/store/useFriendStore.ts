import { create } from 'zustand';
import friendService from '../services/friendService';
import type { Friend, FriendRequest } from '../services/friendService';

interface FriendState {
  friends: Friend[];
  friendRequests: FriendRequest[];
  isLoading: boolean;
  error: string | null;

  fetchFriends: () => Promise<void>;
  fetchFriendRequests: () => Promise<void>;
  sendFriendRequest: (receiverId: number) => Promise<boolean>;
  acceptFriendRequest: (requestId: number) => Promise<boolean>;
}

export const useFriendStore = create<FriendState>((set) => ({
  friends: [],
  friendRequests: [],
  isLoading: false,
  error: null,

  fetchFriends: async () => {
    set({ isLoading: true, error: null });
    try {
      const friends = await friendService.getFriends();
      set({ friends, isLoading: false });
    } catch {
      set({ error: 'Không tải được danh sách bạn bè', isLoading: false });
    }
  },

  fetchFriendRequests: async () => {
    try {
      const friendRequests = await friendService.getFriendRequests();
      set({ friendRequests });
    } catch {
      set({ error: 'Không tải được lời mời kết bạn' });
    }
  },

  sendFriendRequest: async (receiverId) => {
    try {
      await friendService.sendFriendRequest({ receiverId });
      return true;
    } catch {
      set({ error: 'Không gửi được lời mời kết bạn' });
      return false;
    }
  },

  acceptFriendRequest: async (requestId) => {
    try {
      await friendService.acceptFriendRequest(requestId);
      set((state) => ({
        friendRequests: state.friendRequests.filter(r => r.id !== requestId),
      }));
      return true;
    } catch {
      set({ error: 'Không chấp nhận được lời mời kết bạn' });
      return false;
    }
  },
}));
