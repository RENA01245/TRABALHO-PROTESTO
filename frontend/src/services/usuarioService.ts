import { api } from './api';
import type { PaginatedResponse, Usuario } from '@/types';

export interface UsuarioFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateUsuarioData {
  nome: string;
  email: string;
  senha: string;
  role: 'ADMIN' | 'FUNCIONARIO';
  ativo?: boolean;
}

export interface UpdateUsuarioData {
  nome?: string;
  email?: string;
  senha?: string;
  role?: 'ADMIN' | 'FUNCIONARIO';
  ativo?: boolean;
}

export const usuarioService = {
  async list(filters: UsuarioFilters = {}): Promise<PaginatedResponse<Usuario>> {
    const { data } = await api.get<PaginatedResponse<Usuario>>('/usuarios', { params: filters });
    return data;
  },

  async getById(id: string): Promise<Usuario> {
    const { data } = await api.get<Usuario>(`/usuarios/${id}`);
    return data;
  },

  async create(payload: CreateUsuarioData): Promise<Usuario> {
    const { data } = await api.post<Usuario>('/usuarios', payload);
    return data;
  },

  async update(id: string, payload: UpdateUsuarioData): Promise<Usuario> {
    const { data } = await api.put<Usuario>(`/usuarios/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },
};
