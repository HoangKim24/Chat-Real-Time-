import { create } from 'zustand';
import serverService from '../services/serverService';
import type { Server, Channel, ServerMember, CreateServerDto, CreateChannelDto } from '../services/serverService';

const SERVER_STATE_STORAGE_KEY = 'chatflow_server_state';

interface PersistedServerState {
  servers: Server[];
  activeServerId: number | null;
}

const loadPersistedServerState = (): { servers: Server[]; activeServer: Server | null; channels: Channel[] } => {
  if (typeof window === 'undefined') {
    return { servers: [], activeServer: null, channels: [] };
  }

  try {
    const raw = localStorage.getItem(SERVER_STATE_STORAGE_KEY);
    if (!raw) {
      return { servers: [], activeServer: null, channels: [] };
    }

    const parsed = JSON.parse(raw) as Partial<PersistedServerState>;
    const servers = Array.isArray(parsed.servers)
      ? parsed.servers.filter((server): server is Server => {
          return !!server && typeof server.id === 'number' && typeof server.serverName === 'string';
        })
      : [];

    const activeServer = servers.find((server) => server.id === parsed.activeServerId) || servers[0] || null;

    return {
      servers,
      activeServer,
      channels: activeServer?.channels || [],
    };
  } catch {
    return { servers: [], activeServer: null, channels: [] };
  }
};

const persistServerState = (servers: Server[], activeServer: Server | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  const payload: PersistedServerState = {
    servers,
    activeServerId: activeServer?.id ?? null,
  };

  try {
    localStorage.setItem(SERVER_STATE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota / private mode errors
  }
};

const initialServerState = loadPersistedServerState();

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
  renameServer: (serverId: number, serverName: string) => boolean;
  fetchMembers: (serverId: number) => Promise<void>;
  addMember: (serverId: number, userId: number) => Promise<boolean>;
  createChannel: (data: CreateChannelDto) => Promise<Channel | null>;
  clearActive: () => void;
}

export const useServerStore = create<ServerState>((set) => ({
  servers: initialServerState.servers,
  activeServer: initialServerState.activeServer,
  channels: initialServerState.channels,
  members: [],
  isLoading: false,
  error: null,

  setServers: (servers) => {
    set((state) => {
      const activeServer = servers.find((server) => server.id === state.activeServer?.id) || servers[0] || null;
      const channels = activeServer?.channels || [];
      persistServerState(servers, activeServer);
      return { servers, activeServer, channels };
    });
  },

  selectServer: (server) => {
    set((state) => {
      const selectedServer = state.servers.find((s) => s.id === server.id) || server;
      persistServerState(state.servers, selectedServer);
      return { activeServer: selectedServer, channels: selectedServer.channels || [] };
    });
  },

  renameServer: (serverId, serverName) => {
    const trimmedName = serverName.trim();

    if (!trimmedName) {
      set({ error: 'Tên workspace không được để trống' });
      return false;
    }

    let renamed = false;

    set((state) => {
      const updatedServers = state.servers.map((server) => {
        if (server.id !== serverId) {
          return server;
        }

        renamed = true;
        return {
          ...server,
          serverName: trimmedName,
        };
      });

      const updatedActiveServer = state.activeServer?.id === serverId
        ? { ...state.activeServer, serverName: trimmedName }
        : state.activeServer;

      if (renamed) {
        persistServerState(updatedServers, updatedActiveServer);
      }

      return {
        servers: updatedServers,
        activeServer: updatedActiveServer,
        error: renamed ? null : 'Không tìm thấy workspace cần đổi tên',
      };
    });

    return renamed;
  },

  createServer: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const server = await serverService.createServer(data);
      set((state) => ({
        servers: (() => {
          const nextServers = [...state.servers, server];
          persistServerState(nextServers, server);
          return nextServers;
        })(),
        activeServer: server,
        channels: server.channels || [],
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
      set((state) => {
        const updatedChannels = [...state.channels, channel];
        const updatedActiveServer = state.activeServer
          ? { ...state.activeServer, channels: updatedChannels }
          : state.activeServer;
        const updatedServers = state.servers.map((server) =>
          updatedActiveServer && server.id === updatedActiveServer.id
            ? { ...server, channels: updatedChannels }
            : server
        );

        persistServerState(updatedServers, updatedActiveServer);

        return {
          channels: updatedChannels,
          activeServer: updatedActiveServer,
          servers: updatedServers,
        };
      });
      return channel;
    } catch {
      set({ error: 'Không tạo được kênh' });
      return null;
    }
  },

  clearActive: () =>
    set((state) => {
      persistServerState(state.servers, null);
      return { activeServer: null, channels: [], members: [] };
    }),
}));
