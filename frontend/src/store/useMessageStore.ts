import { create } from 'zustand';
import messageService from '../services/messageService';
import type { Message, SendMessageDto, EditMessageDto } from '../services/messageService';

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
    set({ isLoading: true, error: null });
    try {
      const messages = await messageService.getMessages(conversationId);
      set({ messages, isLoading: false });
    } catch {
      set({ error: 'Không tải được tin nhắn', isLoading: false });
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
      set({ error: 'Không gửi được tin nhắn' });
      return null;
    }
  },

  editMessage: async (data) => {
    try {
      const updated = await messageService.editMessage(data);
      set((state) => ({
        messages: state.messages.map(m => m.id === updated.id ? updated : m),
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
        messages: state.messages.filter(m => m.id !== messageId),
      }));
      return true;
    } catch {
      set({ error: 'Không xóa được tin nhắn' });
      return false;
    }
  },

  // For real-time updates (SignalR)
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  updateMessage: (message) => {
    set((state) => ({
      messages: state.messages.map(m => m.id === message.id ? message : m),
    }));
  },

  removeMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.filter(m => m.id !== messageId),
    }));
  },

  clearMessages: () => set({ messages: [], error: null }),
}));
