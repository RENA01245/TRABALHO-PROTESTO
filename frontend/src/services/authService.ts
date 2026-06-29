import { api, setToken, removeToken } from './api';
import type { ForgotPasswordResponse, LoginResponse, Usuario } from '@/types';

const USER_KEY = 'protesto_user';

export const authService = {
  async login(email: string, senha: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, senha });
    setToken(data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const { data } = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token: string, senha: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/auth/reset-password', { token, senha });
    return data;
  },

  async me(): Promise<Usuario> {
    const { data } = await api.get<Usuario>('/auth/me');
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  },

  logout(): void {
    removeToken();
    localStorage.removeItem(USER_KEY);
  },

  getStoredUser(): Usuario | null {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as Usuario;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('protesto_token');
  },
};
