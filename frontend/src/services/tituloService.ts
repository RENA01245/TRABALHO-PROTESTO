import { api } from './api';
import type { HistoricoTitulo, PaginatedResponse, Titulo, TituloStatus } from '@/types';

export interface TituloFilters {
  page?: number;
  limit?: number;
  protocolo?: string;
  documento?: string;
  nome?: string;
  status?: TituloStatus;
  dataInicio?: string;
  dataFim?: string;
}

export interface CreateTituloData {
  credorId: string;
  devedorId: string;
  valor: number;
  dataVencimento: string;
  tipoTitulo: string;
  observacoes?: string;
}

export interface UpdateTituloData extends Partial<CreateTituloData> {}

export const tituloService = {
  async list(filters: TituloFilters = {}): Promise<PaginatedResponse<Titulo>> {
    const { data } = await api.get<PaginatedResponse<Titulo>>('/titulos', { params: filters });
    return data;
  },

  async getById(id: string): Promise<Titulo> {
    const { data } = await api.get<Titulo>(`/titulos/${id}`);
    return data;
  },

  async create(payload: CreateTituloData): Promise<Titulo> {
    const { data } = await api.post<Titulo>('/titulos', payload);
    return data;
  },

  async update(id: string, payload: UpdateTituloData): Promise<Titulo> {
    const { data } = await api.put<Titulo>(`/titulos/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/titulos/${id}`);
  },

  async updateStatus(id: string, status: TituloStatus): Promise<Titulo> {
    const { data } = await api.patch<Titulo>(`/titulos/${id}/status`, { status });
    return data;
  },

  async getHistorico(id: string): Promise<HistoricoTitulo[]> {
    const { data } = await api.get<HistoricoTitulo[]>(`/titulos/${id}/historico`);
    return data;
  },

  async downloadPdf(id: string): Promise<void> {
    const response = await api.get(`/titulos/${id}/pdf`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprovante-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
