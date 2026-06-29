import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { devedorService } from '@/services/devedorService';
import type { Devedor } from '@/types';
import { formatDocument, getApiErrorMessage } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/Loading';
import { Alert } from '@/components/Alert';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Table, Pagination } from '@/components/Table';
import { ConfirmModal } from '@/components/Modal';
import { FormGroup, Input } from '@/components/FormInputs';

export function DevedoresListPage() {
  const { isAdmin } = useAuth();
  const [devedores, setDevedores] = useState<Devedor[]>([]);
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
      const result = await devedorService.list({ page: currentPage, limit: 10, search: searchTerm || undefined });
      setDevedores(result.data);
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
      await devedorService.remove(deleteId);
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
          <h1>Devedores</h1>
          <p>Gerencie os devedores cadastrados</p>
        </div>
        <Link to="/devedores/novo">
          <Button>Novo Devedor</Button>
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
        ) : devedores.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum devedor encontrado.</p>
            <Link to="/devedores/novo"><Button>Cadastrar Devedor</Button></Link>
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
              {devedores.map((devedor) => (
                <tr key={devedor.id}>
                  <td>{devedor.nome}</td>
                  <td>{formatDocument(devedor.documento, devedor.tipoDocumento)}</td>
                  <td>{devedor.email || '—'}</td>
                  <td>{devedor.telefone || '—'}</td>
                  <td>
                    <div className="table__actions">
                      <Link to={`/devedores/${devedor.id}/editar`}>
                        <Button variant="secondary" size="sm">Editar</Button>
                      </Link>
                      {isAdmin && (
                        <Button variant="danger" size="sm" onClick={() => setDeleteId(devedor.id)}>
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
        title="Excluir devedor"
        message="Tem certeza que deseja excluir este devedor?"
        confirmLabel="Excluir"
        loading={deleting}
      />
    </>
  );
}
