import { create } from 'zustand';
import authService from '../services/authService';
import type { UserLoginDto, UserRegisterDto, UserUpdateDto } from '../services/authService';

export interface User {
  id: number;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (data: UserLoginDto) => Promise<boolean>;
  register: (data: UserRegisterDto) => Promise<boolean>;
  updateProfile: (data: UserUpdateDto) => Promise<boolean>;
  logout: () => void;
  initialize: () => void;
  setError: (error: string | null) => void;
}

const isDemoMode = import.meta.env.DEV;

const DEV_LOGIN_EMAIL = 'demo@chatflow.vn';
const DEV_LOGIN_PASSWORD = 'Demo@123456';

const buildDemoUser = (data: UserLoginDto | UserRegisterDto): User => {
  const username = 'username' in data ? data.username : data.email.split('@')[0] || 'nguoi-dung';

  return {
    id: Math.floor(Date.now() / 1000) % 100000,
    email: data.email,
    username,
    displayName: username,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=06b6d4&color=fff`,
  };
};

const persistDemoSession = (user: User) => {
  const token = `demo-token-${user.id}`;
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
  return token;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initialize: () => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ token, user, isAuthenticated: true });
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  },

  login: async (data: UserLoginDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(data);
      const { token, user } = response;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error: unknown) {
      const backendMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;

      if (isDemoMode) {
        if (data.email.trim().toLowerCase() === DEV_LOGIN_EMAIL && data.password === DEV_LOGIN_PASSWORD) {
          const user = buildDemoUser({ email: DEV_LOGIN_EMAIL, password: DEV_LOGIN_PASSWORD });
          const token = persistDemoSession(user);
          set({ user, token, isAuthenticated: true, isLoading: false, error: null });
          return true;
        }

        set({ error: backendMessage || `Tài khoản dùng để đăng nhập là ${DEV_LOGIN_EMAIL} / ${DEV_LOGIN_PASSWORD}`, isLoading: false });
        return false;
      }

      const message = backendMessage || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  register: async (data: UserRegisterDto) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(data);
      set({ isLoading: false });
      return true;
    } catch (error: unknown) {
      const backendMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      const message = backendMessage || (isDemoMode
        ? `Hãy dùng tài khoản ${DEV_LOGIN_EMAIL} / ${DEV_LOGIN_PASSWORD}.`
        : 'Đăng ký thất bại. Vui lòng thử lại.');
      set({ error: message, isLoading: false });
      return false;
    }
  },

  updateProfile: async (data: UserUpdateDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.updateProfile(data);
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...data, ...response };
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        set({ user: updatedUser, isLoading: false });
      }
      return true;
    } catch (error: unknown) {
      if (isDemoMode) {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...data };
          localStorage.setItem('auth_user', JSON.stringify(updatedUser));
          set({ user: updatedUser, isLoading: false, error: null });
        } else {
          set({ isLoading: false, error: null });
        }
        return true;
      }

      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Cập nhật thất bại.';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setError: (error) => set({ error }),
}));
