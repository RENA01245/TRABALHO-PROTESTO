import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tituloService } from '@/services/tituloService';
import { credorService } from '@/services/credorService';
import { devedorService } from '@/services/devedorService';
import { tituloSchema, type TituloFormData } from '@/schemas/tituloSchemas';
import type { Credor, Devedor } from '@/types';
import { TIPO_TITULO_OPTIONS } from '@/types';
import { getApiErrorMessage, toInputDate } from '@/utils/formatters';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Loading } from '@/components/Loading';
import { FormGroup, Input, Select, Textarea } from '@/components/FormInputs';

export function TituloFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [credores, setCredores] = useState<Credor[]>([]);
  const [devedores, setDevedores] = useState<Devedor[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TituloFormData>({
    resolver: zodResolver(tituloSchema),
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [credoresRes, devedoresRes] = await Promise.all([
          credorService.list({ limit: 1000 }),
          devedorService.list({ limit: 1000 }),
        ]);
        setCredores(credoresRes.data);
        setDevedores(devedoresRes.data);
      } catch (err) {
        setError(getApiErrorMessage(err));
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const titulo = await tituloService.getById(id);
        reset({
          credorId: titulo.credorId,
          devedorId: titulo.devedorId,
          valor: Number(titulo.valor),
          dataVencimento: toInputDate(titulo.dataVencimento),
          tipoTitulo: titulo.tipoTitulo,
          observacoes: titulo.observacoes ?? '',
        });
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, reset]);

  const onSubmit = async (data: TituloFormData) => {
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        observacoes: data.observacoes || undefined,
      };
      if (isEdit && id) {
        await tituloService.update(id, payload);
        navigate(`/titulos/${id}`);
      } else {
        const created = await tituloService.create(payload);
        navigate(`/titulos/${created.id}`);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Carregando título..." />;

  const credorOptions = credores.map((c) => ({ value: c.id, label: `${c.nome} (${c.documento})` }));
  const devedorOptions = devedores.map((d) => ({ value: d.id, label: `${d.nome} (${d.documento})` }));
  const tipoOptions = TIPO_TITULO_OPTIONS.map((t) => ({ value: t, label: t }));

  return (
    <>
      <div className="page-header">
        <h1>{isEdit ? 'Editar Título' : 'Novo Título'}</h1>
        <p>{isEdit ? 'Atualize os dados do título' : 'Cadastre um novo título para protesto'}</p>
      </div>

      {error && <Alert variant="error" className="mb-md">{error}</Alert>}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-row">
            <FormGroup label="Credor" required error={errors.credorId?.message}>
              <Select
                options={credorOptions}
                placeholder="Selecione o credor"
                error={!!errors.credorId}
                {...register('credorId')}
              />
            </FormGroup>

            <FormGroup label="Devedor" required error={errors.devedorId?.message}>
              <Select
                options={devedorOptions}
                placeholder="Selecione o devedor"
                error={!!errors.devedorId}
                {...register('devedorId')}
              />
            </FormGroup>
          </div>

          <div className="form-row">
            <FormGroup label="Valor (R$)" required error={errors.valor?.message}>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                error={!!errors.valor}
                {...register('valor')}
              />
            </FormGroup>

            <FormGroup label="Data de Vencimento" required error={errors.dataVencimento?.message}>
              <Input
                type="date"
                error={!!errors.dataVencimento}
                {...register('dataVencimento')}
              />
            </FormGroup>

            <FormGroup label="Tipo de Título" required error={errors.tipoTitulo?.message}>
              <Select
                options={tipoOptions}
                placeholder="Selecione o tipo"
                error={!!errors.tipoTitulo}
                {...register('tipoTitulo')}
              />
            </FormGroup>
          </div>

          <FormGroup label="Observações" error={errors.observacoes?.message}>
            <Textarea
              placeholder="Informações adicionais (opcional)"
              error={!!errors.observacoes}
              {...register('observacoes')}
            />
          </FormGroup>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Cadastrar título'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
