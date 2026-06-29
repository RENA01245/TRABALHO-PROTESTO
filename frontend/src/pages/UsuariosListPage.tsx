import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usuarioService } from '@/services/usuarioService';
import type { Usuario } from '@/types';
import { ROLE_LABELS } from '@/types';
import { getApiErrorMessage } from '@/utils/formatters';
import { Loading } from '@/components/Loading';
import { Alert } from '@/components/Alert';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Table, Pagination } from '@/components/Table';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmModal } from '@/components/Modal';
import { FormGroup, Input } from '@/components/FormInputs';

export function UsuariosListPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
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
      const result = await usuarioService.list({ page: currentPage, limit: 10, search: searchTerm || undefined });
      setUsuarios(result.data);
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
      await usuarioService.remove(deleteId);
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
          <h1>Usuários</h1>
          <p>Gerencie os usuários do sistema</p>
        </div>
        <Link to="/usuarios/novo">
          <Button>Novo Usuário</Button>
        </Link>
      </div>

      {error && <Alert variant="error" className="mb-md">{error}</Alert>}

      <Card className="mb-lg">
        <form onSubmit={handleSearch} className="filters-bar">
          <FormGroup label="Buscar">
            <Input
              placeholder="Nome ou e-mail"
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
        ) : usuarios.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum usuário encontrado.</p>
            <Link to="/usuarios/novo"><Button>Cadastrar Usuário</Button></Link>
          </div>
        ) : (
          <>
            <Table
              columns={[
                { key: 'nome', label: 'Nome' },
                { key: 'email', label: 'E-mail' },
                { key: 'role', label: 'Perfil' },
                { key: 'ativo', label: 'Status' },
                { key: 'actions', label: 'Ações' },
              ]}
            >
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>{ROLE_LABELS[usuario.role]}</td>
                  <td><StatusBadge status={usuario.ativo ? 'ativo' : 'inativo'} /></td>
                  <td>
                    <div className="table__actions">
                      <Link to={`/usuarios/${usuario.id}/editar`}>
                        <Button variant="secondary" size="sm">Editar</Button>
                      </Link>
                      <Button variant="danger" size="sm" onClick={() => setDeleteId(usuario.id)}>
                        Excluir
                      </Button>
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
        title="Excluir usuário"
        message="Tem certeza que deseja excluir este usuário?"
        confirmLabel="Excluir"
        loading={deleting}
      />
    </>
  );
}
