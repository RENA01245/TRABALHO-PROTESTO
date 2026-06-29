import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '@/services/dashboardService';
import type { DashboardData } from '@/types';
import { TITULO_STATUS_LABELS, TITULO_STATUS_OPTIONS } from '@/types';
import { formatCurrency, formatDate, getApiErrorMessage } from '@/utils/formatters';
import { Loading } from '@/components/Loading';
import { Alert } from '@/components/Alert';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/Button';

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const result = await dashboardService.get();
        setData(result);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loading message="Carregando dashboard..." />;
  if (error) return <Alert variant="error">{error}</Alert>;
  if (!data) return null;

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Visão geral do sistema de protesto de títulos</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__label">Total de Títulos</div>
          <div className="stat-card__value">{data.totalTitulos}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Credores</div>
          <div className="stat-card__value stat-card__value--accent">{data.totalCredores}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Devedores</div>
          <div className="stat-card__value stat-card__value--accent">{data.totalDevedores}</div>
        </div>
        {TITULO_STATUS_OPTIONS.map((status) => (
          <div className="stat-card" key={status}>
            <div className="stat-card__label">{TITULO_STATUS_LABELS[status]}</div>
            <div className="stat-card__value">{data.porStatus[status] ?? 0}</div>
          </div>
        ))}
      </div>

      <Card title="Títulos Recentes" className="dashboard-recent">
        {data.titulosRecentes.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum título cadastrado ainda.</p>
            <Link to="/titulos/novo">
              <Button>Cadastrar Título</Button>
            </Link>
          </div>
        ) : (
          <Table
            columns={[
              { key: 'protocolo', label: 'Protocolo' },
              { key: 'credor', label: 'Credor' },
              { key: 'devedor', label: 'Devedor' },
              { key: 'valor', label: 'Valor' },
              { key: 'status', label: 'Status' },
              { key: 'data', label: 'Vencimento' },
              { key: 'actions', label: '' },
            ]}
          >
            {data.titulosRecentes.map((titulo) => (
              <tr key={titulo.id}>
                <td>{titulo.protocolo}</td>
                <td>{titulo.credor?.nome ?? '—'}</td>
                <td>{titulo.devedor?.nome ?? '—'}</td>
                <td>{formatCurrency(Number(titulo.valor))}</td>
                <td><StatusBadge status={titulo.status} /></td>
                <td>{formatDate(titulo.dataVencimento)}</td>
                <td>
                  <Link to={`/titulos/${titulo.id}`}>
                    <Button variant="ghost" size="sm">Ver</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </>
  );
}
