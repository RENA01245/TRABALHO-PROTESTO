export type Role = 'ADMIN' | 'FUNCIONARIO';
export type TipoDocumento = 'CPF' | 'CNPJ';
export type TituloStatus =
  | 'PENDENTE'
  | 'EM_ANALISE'
  | 'PROTESTADO'
  | 'CANCELADO'
  | 'RETIRADO'
  | 'PAGO';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: Role;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Credor {
  id: string;
  nome: string;
  documento: string;
  tipoDocumento: TipoDocumento;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Devedor {
  id: string;
  nome: string;
  documento: string;
  tipoDocumento: TipoDocumento;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Titulo {
  id: string;
  protocolo: string;
  credorId: string;
  devedorId: string;
  valor: number;
  dataVencimento: string;
  dataProtesto?: string | null;
  tipoTitulo: string;
  status: TituloStatus;
  observacoes?: string | null;
  createdAt: string;
  updatedAt: string;
  credor?: Credor;
  devedor?: Devedor;
}

export interface HistoricoTitulo {
  id: string;
  tituloId: string;
  usuarioId: string;
  acao: string;
  campo?: string | null;
  valorAnterior?: string | null;
  valorNovo?: string | null;
  createdAt: string;
  usuario?: Pick<Usuario, 'id' | 'nome' | 'email'>;
}

export interface DashboardData {
  totalTitulos: number;
  porStatus: Record<TituloStatus, number>;
  titulosRecentes: Titulo[];
  totalCredores: number;
  totalDevedores: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginResponse {
  token: string;
  user: Usuario;
}

export interface ForgotPasswordResponse {
  message: string;
  token?: string;
}

export const TITULO_STATUS_LABELS: Record<TituloStatus, string> = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em Análise',
  PROTESTADO: 'Protestado',
  CANCELADO: 'Cancelado',
  RETIRADO: 'Retirado',
  PAGO: 'Pago',
};

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrador',
  FUNCIONARIO: 'Funcionário',
};

export const TIPO_TITULO_OPTIONS = [
  'Duplicata Mercantil',
  'Duplicata de Serviço',
  'Cheque',
  'Nota Promissória',
  'Letra de Câmbio',
  'Outros',
] as const;

export const TITULO_STATUS_OPTIONS: TituloStatus[] = [
  'PENDENTE',
  'EM_ANALISE',
  'PROTESTADO',
  'CANCELADO',
  'RETIRADO',
  'PAGO',
];
