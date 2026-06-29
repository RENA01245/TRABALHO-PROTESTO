import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tituloService } from '@/services/tituloService';
import type { Titulo, TituloStatus } from '@/types';
import { TITULO_STATUS_LABELS, TITULO_STATUS_OPTIONS } from '@/types';
import { formatCurrency, formatDate, getApiErrorMessage } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/Loading';
import { Alert } from '@/components/Alert';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Table, Pagination } from '@/components/Table';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmModal } from '@/components/Modal';
import { FormGroup, Input, Select } from '@/components/FormInputs';

export function TitulosListPage() {
  const { isAdmin } = useAuth();
  const [titulos, setTitulos] = useState<Titulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [filters, setFilters] = useState({
    protocolo: '',
    documento: '',
    nome: '',
    status: '' as TituloStatus | '',
    dataInicio: '',
    dataFim: '',
  });

  const loadTitulos = async (currentPage = page) => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string | number> = { page: currentPage, limit: 10 };
      if (filters.protocolo) params.protocolo = filters.protocolo;
      if (filters.documento) params.documento = filters.documento;
      if (filters.nome) params.nome = filters.nome;
      if (filters.status) params.status = filters.status;
      if (filters.dataInicio) params.dataInicio = filters.dataInicio;
      if (filters.dataFim) params.dataFim = filters.dataFim;

      const result = await tituloService.list(params);
      setTitulos(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
      setPage(result.page);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTitulos(1);
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    loadTitulos(1);
  };

  const handleClear = () => {
    setFilters({ protocolo: '', documento: '', nome: '', status: '', dataInicio: '', dataFim: '' });
    setTimeout(() => loadTitulos(1), 0);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await tituloService.remove(deleteId);
      setDeleteId(null);
      loadTitulos(page);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const statusOptions = TITULO_STATUS_OPTIONS.map((s) => ({
    value: s,
    label: TITULO_STATUS_LABELS[s],
  }));

  return (
    <>
      <div className="page-header flex-between">
        <div>
          <h1>Títulos</h1>
          <p>Consulte e gerencie títulos de protesto</p>
        </div>
        <Link to="/titulos/novo">
          <Button>Novo Título</Button>
        </Link>
      </div>

      {error && <Alert variant="error" className="mb-md">{error}</Alert>}

      <Card className="mb-lg">
        <form onSubmit={handleFilter}>
          <div className="filters-bar">
            <FormGroup label="Protocolo">
              <Input
                placeholder="PROT-..."
                value={filters.protocolo}
                onChange={(e) => setFilters({ ...filters, protocolo: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="CPF/CNPJ">
              <Input
                placeholder="Documento"
                value={filters.documento}
                onChange={(e) => setFilters({ ...filters, documento: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Nome">
              <Input
                placeholder="Credor ou devedor"
                value={filters.nome}
                onChange={(e) => setFilters({ ...filters, nome: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Status">
              <Select
                options={statusOptions}
                placeholder="Todos"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as TituloStatus | '' })}
              />
            </FormGroup>
            <FormGroup label="Data início">
              <Input
                type="date"
                value={filters.dataInicio}
                onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Data fim">
              <Input
                type="date"
                value={filters.dataFim}
                onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
              />
            </FormGroup>
            <div className="filters-bar__actions">
              <Button type="submit">Filtrar</Button>
              <Button type="button" variant="secondary" onClick={handleClear}>
                Limpar
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <Card>
        {loading ? (
          <Loading />
        ) : titulos.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum título encontrado.</p>
            <Link to="/titulos/novo">
              <Button>Cadastrar Título</Button>
            </Link>
          </div>
        ) : (
          <>
            <Table
              columns={[
                { key: 'protocolo', label: 'Protocolo' },
                { key: 'credor', label: 'Credor' },
                { key: 'devedor', label: 'Devedor' },
                { key: 'valor', label: 'Valor' },
                { key: 'status', label: 'Status' },
                { key: 'vencimento', label: 'Vencimento' },
                { key: 'actions', label: 'Ações' },
              ]}
            >
              {titulos.map((titulo) => (
                <tr key={titulo.id}>
                  <td>{titulo.protocolo}</td>
                  <td>{titulo.credor?.nome ?? '—'}</td>
                  <td>{titulo.devedor?.nome ?? '—'}</td>
                  <td>{formatCurrency(Number(titulo.valor))}</td>
                  <td><StatusBadge status={titulo.status} /></td>
                  <td>{formatDate(titulo.dataVencimento)}</td>
                  <td>
                    <div className="table__actions">
                      <Link to={`/titulos/${titulo.id}`}>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </Link>
                      <Link to={`/titulos/${titulo.id}/editar`}>
                        <Button variant="secondary" size="sm">Editar</Button>
                      </Link>
                      {isAdmin && (
                        <Button variant="danger" size="sm" onClick={() => setDeleteId(titulo.id)}>
                          Excluir
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              onPageChange={(p) => loadTitulos(p)}
            />
          </>
        )}
      </Card>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir título"
        message="Tem certeza que deseja excluir este título? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        loading={deleting}
      />
    </>
  );
}
