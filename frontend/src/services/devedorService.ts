import { api } from './api';
import type { Devedor, PaginatedResponse, TipoDocumento } from '@/types';

export interface DevedorFilters {
  page?: number;
  limit?: number;
  search?: string;
  documento?: string;
}

export interface CreateDevedorData {
  nome: string;
  documento: string;
  tipoDocumento: TipoDocumento;
  email?: string;
  telefone?: string;
  endereco?: string;
}

export interface UpdateDevedorData extends Partial<CreateDevedorData> {}

export const devedorService = {
  async list(filters: DevedorFilters = {}): Promise<PaginatedResponse<Devedor>> {
    const { data } = await api.get<PaginatedResponse<Devedor>>('/devedores', { params: filters });
    return data;
  },

  async getById(id: string): Promise<Devedor> {
    const { data } = await api.get<Devedor>(`/devedores/${id}`);
    return data;
  },

  async create(payload: CreateDevedorData): Promise<Devedor> {
    const { data } = await api.post<Devedor>('/devedores', payload);
    return data;
  },

  async update(id: string, payload: UpdateDevedorData): Promise<Devedor> {
    const { data } = await api.put<Devedor>(`/devedores/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/devedores/${id}`);
  },
};
