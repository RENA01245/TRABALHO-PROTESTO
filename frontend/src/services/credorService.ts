import { api } from './api';
import type { Credor, PaginatedResponse, TipoDocumento } from '@/types';

export interface CredorFilters {
  page?: number;
  limit?: number;
  search?: string;
  documento?: string;
}

export interface CreateCredorData {
  nome: string;
  documento: string;
  tipoDocumento: TipoDocumento;
  email?: string;
  telefone?: string;
  endereco?: string;
}

export interface UpdateCredorData extends Partial<CreateCredorData> {}

export const credorService = {
  async list(filters: CredorFilters = {}): Promise<PaginatedResponse<Credor>> {
    const { data } = await api.get<PaginatedResponse<Credor>>('/credores', { params: filters });
    return data;
  },

  async getById(id: string): Promise<Credor> {
    const { data } = await api.get<Credor>(`/credores/${id}`);
    return data;
  },

  async create(payload: CreateCredorData): Promise<Credor> {
    const { data } = await api.post<Credor>('/credores', payload);
    return data;
  },

  async update(id: string, payload: UpdateCredorData): Promise<Credor> {
    const { data } = await api.put<Credor>(`/credores/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/credores/${id}`);
  },
};
