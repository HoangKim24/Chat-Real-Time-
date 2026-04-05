import { create } from 'zustand';
import serverService from '../services/serverService';
import type { Server, Channel, ServerMember, CreateServerDto, CreateChannelDto } from '../services/serverService';

interface ServerState {
  servers: Server[];
  activeServer: Server | null;
  channels: Channel[];
  members: ServerMember[];
  isLoading: boolean;
  error: string | null;

  setServers: (servers: Server[]) => void;
  selectServer: (server: Server) => void;
  createServer: (data: CreateServerDto) => Promise<Server | null>;
  fetchMembers: (serverId: number) => Promise<void>;
  addMember: (serverId: number, userId: number) => Promise<boolean>;
  createChannel: (data: CreateChannelDto) => Promise<Channel | null>;
  clearActive: () => void;
}

export const useServerStore = create<ServerState>((set) => ({
  servers: [],
  activeServer: null,
  channels: [],
  members: [],
  isLoading: false,
  error: null,

  setServers: (servers) => set({ servers }),

  selectServer: (server) => {
    set({ activeServer: server, channels: server.channels || [] });
  },

  createServer: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const server = await serverService.createServer(data);
      set((state) => ({
        servers: [...state.servers, server],
        activeServer: server,
        isLoading: false,
      }));
      return server;
    } catch {
      set({ error: 'Không tạo được máy chủ', isLoading: false });
      return null;
    }
  },

  fetchMembers: async (serverId) => {
    try {
      const members = await serverService.getServerMembers(serverId);
      set({ members });
    } catch {
      set({ error: 'Không tải được thành viên' });
    }
  },

  addMember: async (serverId, userId) => {
    try {
      await serverService.addMember({ serverId, userId });
      return true;
    } catch {
      set({ error: 'Không thêm được thành viên' });
      return false;
    }
  },

  createChannel: async (data) => {
    try {
      const channel = await serverService.createChannel(data);
      set((state) => ({
        channels: [...state.channels, channel],
      }));
      return channel;
    } catch {
      set({ error: 'Không tạo được kênh' });
      return null;
    }
  },

  clearActive: () => set({ activeServer: null, channels: [], members: [] }),
}));
