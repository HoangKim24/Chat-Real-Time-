import { create } from 'zustand';
import messageService from '../services/messageService';
import type { Message, SendMessageDto, EditMessageDto } from '../services/messageService';
import { useAuthStore } from './useAuthStore';

interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  fetchMessages: (conversationId: number) => Promise<void>;
  sendMessage: (data: SendMessageDto) => Promise<Message | null>;
  editMessage: (data: EditMessageDto) => Promise<boolean>;
  deleteMessage: (messageId: number) => Promise<boolean>;
  addMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  removeMessage: (messageId: number) => void;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  fetchMessages: async (conversationId) => {
    set({ isLoading: true, error: null, messages: [] });
    try {
      const messages = await messageService.getMessages(conversationId);
      set({ messages, isLoading: false });
    } catch {
      set({ error: 'Không tải được tin nhắn', isLoading: false, messages: [] });
    }
  },

  sendMessage: async (data) => {
    try {
      const message = await messageService.sendMessage(data);
      set((state) => ({
        messages: [...state.messages, message],
      }));
      return message;
    } catch {
      const currentUser = useAuthStore.getState().user;

      if (!currentUser) {
        set({ error: 'Không gửi được tin nhắn' });
        return null;
      }

      const localMessage: Message = {
        id: -Date.now(),
        senderId: currentUser.id,
        senderName: currentUser.displayName || currentUser.username,
        senderAvatar: currentUser.avatarUrl,
        content: data.content,
        createdAt: new Date().toISOString(),
        conversationId: data.conversationId ?? undefined,
        channelId: data.channelId ?? undefined,
        isEdited: false,
      };

      set((state) => ({
        messages: [...state.messages, localMessage],
        error: null,
      }));
      return localMessage;
    }
  },

  editMessage: async (data) => {
    try {
      const updated = await messageService.editMessage(data);
      set((state) => ({
        messages: state.messages.map((message) => message.id === updated.id ? updated : message),
      }));
      return true;
    } catch {
      set({ error: 'Không chỉnh sửa được tin nhắn' });
      return false;
    }
  },

  deleteMessage: async (messageId) => {
    try {
      await messageService.deleteMessage(messageId);
      set((state) => ({
        messages: state.messages.filter((message) => message.id !== messageId),
      }));
      return true;
    } catch {
      set({ error: 'Không xóa được tin nhắn' });
      return false;
    }
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  updateMessage: (message) => {
    set((state) => ({
      messages: state.messages.map((item) => item.id === message.id ? message : item),
    }));
  },

  removeMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== messageId),
    }));
  },

  clearMessages: () => set({ messages: [], error: null }),
}));
