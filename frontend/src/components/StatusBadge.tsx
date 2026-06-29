import type { TituloStatus } from '@/types';
import { TITULO_STATUS_LABELS } from '@/types';

interface StatusBadgeProps {
  status: TituloStatus | 'ativo' | 'inativo';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label =
    status === 'ativo'
      ? 'Ativo'
      : status === 'inativo'
        ? 'Inativo'
        : TITULO_STATUS_LABELS[status as TituloStatus];

  const variant = status.toLowerCase();

  return <span className={`badge badge--${variant}`}>{label}</span>;
}
