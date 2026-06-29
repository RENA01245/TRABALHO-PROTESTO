import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tituloService } from '@/services/tituloService';
import { statusChangeSchema, type StatusChangeFormData } from '@/schemas/tituloSchemas';
import type { HistoricoTitulo, Titulo } from '@/types';
import { TITULO_STATUS_LABELS, TITULO_STATUS_OPTIONS } from '@/types';
import { formatCurrency, formatDate, formatDateTime, formatDocument, getApiErrorMessage } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/Loading';
import { Alert } from '@/components/Alert';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmModal } from '@/components/Modal';
import { FormGroup, Select } from '@/components/FormInputs';

export function TituloDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [titulo, setTitulo] = useState<Titulo | null>(null);
  const [historico, setHistorico] = useState<HistoricoTitulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [changingStatus, setChangingStatus] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StatusChangeFormData>({
    resolver: zodResolver(statusChangeSchema),
  });

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const [tituloData, historicoData] = await Promise.all([
        tituloService.getById(id),
        tituloService.getHistorico(id),
      ]);
      setTitulo(tituloData);
      setHistorico(historicoData);
      reset({ status: tituloData.status });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const onStatusChange = async (data: StatusChangeFormData) => {
    if (!id) return;
    setStatusError('');
    setChangingStatus(true);
    try {
      const updated = await tituloService.updateStatus(id, data.status);
      setTitulo(updated);
      const historicoData = await tituloService.getHistorico(id);
      setHistorico(historicoData);
    } catch (err) {
      setStatusError(getApiErrorMessage(err));
    } finally {
      setChangingStatus(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!id) return;
    setDownloadingPdf(true);
    try {
      await tituloService.downloadPdf(id);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao baixar PDF'));
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await tituloService.remove(id);
      navigate('/titulos');
    } catch (err) {
      setError(getApiErrorMessage(err));
      setDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading message="Carregando título..." />;
  if (error && !titulo) return <Alert variant="error">{error}</Alert>;
  if (!titulo) return null;

  const statusOptions = TITULO_STATUS_OPTIONS.map((s) => ({
    value: s,
    label: TITULO_STATUS_LABELS[s],
  }));

  return (
    <>
      <div className="page-header flex-between">
        <div>
          <h1>Título {titulo.protocolo}</h1>
          <p>Detalhes e histórico do título</p>
        </div>
        <div className="page-actions">
          <Link to={`/titulos/${id}/editar`}>
            <Button variant="secondary">Editar</Button>
          </Link>
          {isAdmin && (
            <>
              <Button onClick={handleDownloadPdf} disabled={downloadingPdf}>
                {downloadingPdf ? 'Gerando...' : 'Baixar PDF'}
              </Button>
              <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                Excluir
              </Button>
            </>
          )}
          <Link to="/titulos">
            <Button variant="ghost">Voltar</Button>
          </Link>
        </div>
      </div>

      {error && <Alert variant="error" className="mb-md">{error}</Alert>}

      <div className="titulo-detail__section">
        <Card title="Informações do Título">
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-item__label">Protocolo</div>
              <div className="detail-item__value">{titulo.protocolo}</div>
            </div>
            <div className="detail-item">
              <div className="detail-item__label">Status</div>
              <div className="detail-item__value"><StatusBadge status={titulo.status} /></div>
            </div>
            <div className="detail-item">
              <div className="detail-item__label">Valor</div>
              <div className="detail-item__value">{formatCurrency(Number(titulo.valor))}</div>
            </div>
            <div className="detail-item">
              <div className="detail-item__label">Tipo</div>
              <div className="detail-item__value">{titulo.tipoTitulo}</div>
            </div>
            <div className="detail-item">
              <div className="detail-item__label">Vencimento</div>
              <div className="detail-item__value">{formatDate(titulo.dataVencimento)}</div>
            </div>
            {titulo.dataProtesto && (
              <div className="detail-item">
                <div className="detail-item__label">Data Protesto</div>
                <div className="detail-item__value">{formatDate(titulo.dataProtesto)}</div>
              </div>
            )}
            <div className="detail-item">
              <div className="detail-item__label">Cadastrado em</div>
              <div className="detail-item__value">{formatDateTime(titulo.createdAt)}</div>
            </div>
          </div>
          {titulo.observacoes && (
            <div className="mt-md">
              <div className="detail-item__label">Observações</div>
              <p>{titulo.observacoes}</p>
            </div>
          )}
        </Card>
      </div>

      <div className="titulo-detail__section">
        <Card title="Credor e Devedor">
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-item__label">Credor</div>
              <div className="detail-item__value">{titulo.credor?.nome ?? '—'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-item__label">Documento Credor</div>
              <div className="detail-item__value">
                {titulo.credor
                  ? formatDocument(titulo.credor.documento, titulo.credor.tipoDocumento)
                  : '—'}
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-item__label">Devedor</div>
              <div className="detail-item__value">{titulo.devedor?.nome ?? '—'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-item__label">Documento Devedor</div>
              <div className="detail-item__value">
                {titulo.devedor
                  ? formatDocument(titulo.devedor.documento, titulo.devedor.tipoDocumento)
                  : '—'}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {isAdmin && (
        <div className="titulo-detail__section">
          <Card title="Alterar Status">
            {statusError && <Alert variant="error" className="mb-md">{statusError}</Alert>}
            <form onSubmit={handleSubmit(onStatusChange)} className="status-change-form">
              <FormGroup label="Novo Status" required error={errors.status?.message}>
                <Select
                  options={statusOptions}
                  error={!!errors.status}
                  {...register('status')}
                />
              </FormGroup>
              <Button type="submit" disabled={changingStatus}>
                {changingStatus ? 'Atualizando...' : 'Atualizar Status'}
              </Button>
            </form>
          </Card>
        </div>
      )}

      <div className="titulo-detail__section">
        <Card title="Histórico de Alterações">
          {historico.length === 0 ? (
            <p className="text-muted">Nenhum registro de histórico.</p>
          ) : (
            <ul className="historico-list">
              {historico.map((item) => (
                <li key={item.id} className="historico-item">
                  <div className="historico-item__header">
                    <span className="historico-item__acao">{item.acao.replace(/_/g, ' ')}</span>
                    <span className="historico-item__date">{formatDateTime(item.createdAt)}</span>
                  </div>
                  <div className="historico-item__detail">
                    {item.usuario?.nome && <span>Por: {item.usuario.nome} · </span>}
                    {item.campo && (
                      <span>
                        {item.campo}: {item.valorAnterior ?? '—'} → {item.valorNovo ?? '—'}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Excluir título"
        message="Tem certeza que deseja excluir este título?"
        confirmLabel="Excluir"
        loading={deleting}
      />
    </>
  );
}
