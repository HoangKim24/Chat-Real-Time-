import { create } from 'zustand';
import conversationService from '../services/conversationService';
import type { Conversation, ConversationMember, CreateConversationDto } from '../services/conversationService';

interface ConversationState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  members: ConversationMember[];
  isLoading: boolean;
  error: string | null;

  fetchConversations: () => Promise<void>;
  selectConversation: (conversation: Conversation) => void;
  fetchMembers: (conversationId: number) => Promise<void>;
  createConversation: (data: CreateConversationDto) => Promise<Conversation | null>;
  joinConversation: (conversationId: number, userId: number) => Promise<boolean>;
  leaveConversation: (conversationId: number, userId: number) => Promise<boolean>;
  clearActive: () => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  activeConversation: null,
  members: [],
  isLoading: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const conversations = await conversationService.getConversations();
      set((state) => ({
        conversations,
        activeConversation: state.activeConversation && conversations.some((conversation) => conversation.id === state.activeConversation?.id)
          ? state.activeConversation
          : conversations[0] || null,
        isLoading: false,
      }));
    } catch {
      set({ error: 'Không tải được danh sách hội thoại', isLoading: false });
    }
  },

  selectConversation: (conversation) => {
    set({ activeConversation: conversation });
  },

  fetchMembers: async (conversationId) => {
    try {
      const members = await conversationService.getConversationMembers(conversationId);
      set({ members });
    } catch {
      set({ error: 'Không tải được danh sách thành viên' });
    }
  },

  createConversation: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const conversation = await conversationService.createConversation(data);
      set((state) => ({
        conversations: [conversation, ...state.conversations],
        activeConversation: conversation,
        isLoading: false,
      }));
      return conversation;
    } catch {
      set({ error: 'Không tạo được hội thoại', isLoading: false });
      return null;
    }
  },

  joinConversation: async (conversationId, userId) => {
    try {
      await conversationService.joinConversation({ conversationId, userId });
      return true;
    } catch {
      return false;
    }
  },

  leaveConversation: async (conversationId, userId) => {
    try {
      await conversationService.leaveConversation({ conversationId, userId });
      set((state) => ({
        conversations: state.conversations.filter((conversation) => conversation.id !== conversationId),
        activeConversation: state.activeConversation?.id === conversationId ? null : state.activeConversation,
      }));
      return true;
    } catch {
      return false;
    }
  },

  clearActive: () => set({ activeConversation: null, members: [] }),
}));
