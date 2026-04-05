import api from './api';

export interface CreateConversationDto {
  name: string;
  type: number; // 0 = DM, 1 = Group
}

export interface JoinConversationDto {
  conversationId: number;
  userId: number;
}

export interface LeaveConversationDto {
  conversationId: number;
  userId: number;
}

export interface Conversation {
  id: number;
  name: string;
  type: number;
  createdAt?: string;
  lastMessage?: string;
  members?: ConversationMember[];
}

export interface ConversationMember {
  id: number;
  userId: number;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

const conversationService = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/Conversation/get-conversations');
    return response.data;
  },

  getConversationMembers: async (conversationId: number): Promise<ConversationMember[]> => {
    const response = await api.get(`/Conversation/get-conversation-members/${conversationId}`);
    return response.data;
  },

  createConversation: async (data: CreateConversationDto): Promise<Conversation> => {
    const response = await api.post('/Conversation/create-conversation', data);
    return response.data;
  },

  joinConversation: async (data: JoinConversationDto) => {
    const response = await api.post('/Conversation/join-conversation', data);
    return response.data;
  },

  leaveConversation: async (data: LeaveConversationDto) => {
    const response = await api.post('/Conversation/leave-conversation', data);
    return response.data;
  },
};

export default conversationService;
