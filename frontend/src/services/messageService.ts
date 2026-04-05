import api from './api';

export interface SendMessageDto {
  receiverId?: number | null;
  content: string;
  channelId?: number | null;
  conversationId?: number | null;
}

export interface EditMessageDto {
  messageId: number;
  senderId: number;
  content: string;
  conversationId: number;
}

export interface MarkMessageReadDto {
  messageId: number;
  userId: number;
}

export interface Message {
  id: number;
  senderId: number;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  conversationId?: number;
  channelId?: number;
  isEdited?: boolean;
}

export interface MessageReadStatus {
  messageId: number;
  userId: number;
  readAt: string;
}

const messageService = {
  getMessages: async (conversationId: number): Promise<Message[]> => {
    const response = await api.get(`/Message/get-messages/conversation/${conversationId}`);
    return response.data;
  },

  sendMessage: async (data: SendMessageDto): Promise<Message> => {
    const response = await api.post('/Message/send-message', data);
    return response.data;
  },

  editMessage: async (data: EditMessageDto): Promise<Message> => {
    const response = await api.put('/Message/edit-message', data);
    return response.data;
  },

  deleteMessage: async (messageId: number) => {
    const response = await api.delete(`/Message/delete-message/${messageId}`);
    return response.data;
  },

  // Message Read Status
  getReadStatuses: async (conversationId: number): Promise<MessageReadStatus[]> => {
    const response = await api.get(`/MessageRead/get-messages/conversation/${conversationId}`);
    return response.data;
  },

  markMessageRead: async (data: MarkMessageReadDto) => {
    const response = await api.post('/MessageRead/message-read', data);
    return response.data;
  },
};

export default messageService;
