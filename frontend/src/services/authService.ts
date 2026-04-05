import api from './api';

export interface UserRegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserUpdateDto {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    bio?: string;
  };
}

const authService = {
  register: async (data: UserRegisterDto) => {
    const response = await api.post('/Auth/register', data);
    return response.data;
  },

  login: async (data: UserLoginDto): Promise<AuthResponse> => {
    const response = await api.post('/Auth/login', data);
    return response.data;
  },

  updateProfile: async (data: UserUpdateDto) => {
    const response = await api.put('/Auth/update', data);
    return response.data;
  },
};

export default authService;
