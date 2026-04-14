import axios from 'axios';

const DEFAULT_SERVER_API_BASE_URL = 'http://localhost:5128/api';
const SERVER_API_BASE_URL = (import.meta.env.VITE_SERVER_API_BASE_URL ?? DEFAULT_SERVER_API_BASE_URL).replace(/\/$/, '');

const serverApi = axios.create({
  baseURL: SERVER_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

serverApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface CreateServerDto {
  serverName: string;
  description?: string;
}

export interface AddMemberDto {
  serverId: number;
  userId: number;
}

export interface CreateChannelDto {
  channelName: string;
  type: number; // 0 = text, 1 = voice
  serverId: number;
}

export interface CreateRoleDto {
  roleName: string;
  position: number;
  color?: string;
  serverId: number;
}

export interface AssignRoleDto {
  userId: number;
  roleId: number;
  serverId: number;
}

export interface AssignPermissionDto {
  roleId: number;
  permissionId: number;
}

export interface Server {
  id: number;
  serverName: string;
  description?: string;
  iconUrl?: string;
  ownerId?: number;
  channels?: Channel[];
}

export interface Channel {
  id: number;
  channelName: string;
  type: number;
  serverId: number;
}

export interface ServerMember {
  id: number;
  userId: number;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  roles?: Role[];
}

export interface Role {
  id: number;
  roleName: string;
  position: number;
  color?: string;
  serverId: number;
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
}

const serverService = {
  getServers: async (): Promise<Server[]> => {
    const response = await serverApi.get('/Server/get-servers');
    return response.data;
  },

  // Server
  getServerMembers: async (serverId: number): Promise<ServerMember[]> => {
    const response = await serverApi.get(`/Server/get-server-members/${serverId}`);
    return response.data;
  },

  createServer: async (data: CreateServerDto): Promise<Server> => {
    const response = await serverApi.post('/Server/create-server', data);
    return response.data;
  },

  addMember: async (data: AddMemberDto) => {
    const response = await serverApi.post('/Server/add-member', data);
    return response.data;
  },

  createChannel: async (data: CreateChannelDto): Promise<Channel> => {
    const response = await serverApi.post('/Server/create-channel', data);
    return response.data;
  },

  // Roles & Permissions
  getRoles: async (serverId: number): Promise<Role[]> => {
    const response = await serverApi.get(`/RoleServer/get-roles/${serverId}`);
    return response.data;
  },

  getPermissions: async (): Promise<Permission[]> => {
    const response = await serverApi.get('/RoleServer/get-permissions');
    return response.data;
  },

  createRole: async (data: CreateRoleDto): Promise<Role> => {
    const response = await serverApi.post('/RoleServer/create-role', data);
    return response.data;
  },

  assignRole: async (data: AssignRoleDto) => {
    const response = await serverApi.post('/RoleServer/assign-role', data);
    return response.data;
  },

  assignPermission: async (data: AssignPermissionDto) => {
    const response = await serverApi.post('/RoleServer/assign-permission', data);
    return response.data;
  },
};

export default serverService;
