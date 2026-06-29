import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { credorService } from '@/services/credorService';
import type { Credor } from '@/types';
import { formatDocument, getApiErrorMessage } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/Loading';
import { Alert } from '@/components/Alert';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Table, Pagination } from '@/components/Table';
import { ConfirmModal } from '@/components/Modal';
import { FormGroup, Input } from '@/components/FormInputs';

export function CredoresListPage() {
  const { isAdmin } = useAuth();
  const [credores, setCredores] = useState<Credor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async (currentPage = page, searchTerm = search) => {
    setLoading(true);
    setError('');
    try {
      const result = await credorService.list({ page: currentPage, limit: 10, search: searchTerm || undefined });
      setCredores(result.data);
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
    load(1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(1, search);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await credorService.remove(deleteId);
      setDeleteId(null);
      load(page);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="page-header flex-between">
        <div>
          <h1>Credores</h1>
          <p>Gerencie os credores cadastrados</p>
        </div>
        <Link to="/credores/novo">
          <Button>Novo Credor</Button>
        </Link>
      </div>

      {error && <Alert variant="error" className="mb-md">{error}</Alert>}

      <Card className="mb-lg">
        <form onSubmit={handleSearch} className="filters-bar">
          <FormGroup label="Buscar">
            <Input
              placeholder="Nome ou documento"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FormGroup>
          <div className="filters-bar__actions">
            <Button type="submit">Buscar</Button>
          </div>
        </form>
      </Card>

      <Card>
        {loading ? (
          <Loading />
        ) : credores.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum credor encontrado.</p>
            <Link to="/credores/novo"><Button>Cadastrar Credor</Button></Link>
          </div>
        ) : (
          <>
            <Table
              columns={[
                { key: 'nome', label: 'Nome' },
                { key: 'documento', label: 'Documento' },
                { key: 'email', label: 'E-mail' },
                { key: 'telefone', label: 'Telefone' },
                { key: 'actions', label: 'Ações' },
              ]}
            >
              {credores.map((credor) => (
                <tr key={credor.id}>
                  <td>{credor.nome}</td>
                  <td>{formatDocument(credor.documento, credor.tipoDocumento)}</td>
                  <td>{credor.email || '—'}</td>
                  <td>{credor.telefone || '—'}</td>
                  <td>
                    <div className="table__actions">
                      <Link to={`/credores/${credor.id}/editar`}>
                        <Button variant="secondary" size="sm">Editar</Button>
                      </Link>
                      {isAdmin && (
                        <Button variant="danger" size="sm" onClick={() => setDeleteId(credor.id)}>
                          Excluir
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
            <Pagination page={page} totalPages={totalPages} total={total} onPageChange={(p) => load(p)} />
          </>
        )}
      </Card>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir credor"
        message="Tem certeza que deseja excluir este credor?"
        confirmLabel="Excluir"
        loading={deleting}
      />
    </>
  );
}
