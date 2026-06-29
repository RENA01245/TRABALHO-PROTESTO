import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { devedorService } from '@/services/devedorService';
import { devedorSchema, type DevedorFormData } from '@/schemas/devedorSchemas';
import { getApiErrorMessage } from '@/utils/formatters';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Loading } from '@/components/Loading';
import { FormGroup, Input, Select, Textarea } from '@/components/FormInputs';

export function DevedorFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DevedorFormData>({
    resolver: zodResolver(devedorSchema),
    defaultValues: { tipoDocumento: 'CPF' },
  });

  const tipoDocumento = watch('tipoDocumento');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const devedor = await devedorService.getById(id);
        reset({
          nome: devedor.nome,
          documento: devedor.documento,
          tipoDocumento: devedor.tipoDocumento,
          email: devedor.email ?? '',
          telefone: devedor.telefone ?? '',
          endereco: devedor.endereco ?? '',
        });
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, reset]);

  const onSubmit = async (data: DevedorFormData) => {
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        email: data.email || undefined,
        telefone: data.telefone || undefined,
        endereco: data.endereco || undefined,
      };
      if (isEdit && id) {
        await devedorService.update(id, payload);
      } else {
        await devedorService.create(payload);
      }
      navigate('/devedores');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Carregando devedor..." />;

  return (
    <>
      <div className="page-header">
        <h1>{isEdit ? 'Editar Devedor' : 'Novo Devedor'}</h1>
        <p>{isEdit ? 'Atualize os dados do devedor' : 'Cadastre um novo devedor'}</p>
      </div>

      {error && <Alert variant="error" className="mb-md">{error}</Alert>}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormGroup label="Nome / Razão Social" required error={errors.nome?.message}>
            <Input placeholder="Nome completo ou razão social" error={!!errors.nome} {...register('nome')} />
          </FormGroup>

          <div className="form-row">
            <FormGroup label="Tipo de Documento" required error={errors.tipoDocumento?.message}>
              <Select
                options={[
                  { value: 'CPF', label: 'CPF' },
                  { value: 'CNPJ', label: 'CNPJ' },
                ]}
                error={!!errors.tipoDocumento}
                {...register('tipoDocumento')}
              />
            </FormGroup>

            <FormGroup label={tipoDocumento === 'CPF' ? 'CPF' : 'CNPJ'} required error={errors.documento?.message}>
              <Input
                placeholder={tipoDocumento === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                error={!!errors.documento}
                {...register('documento')}
              />
            </FormGroup>
          </div>

          <div className="form-row">
            <FormGroup label="E-mail" error={errors.email?.message}>
              <Input type="email" placeholder="contato@email.com" error={!!errors.email} {...register('email')} />
            </FormGroup>
            <FormGroup label="Telefone" error={errors.telefone?.message}>
              <Input placeholder="(00) 00000-0000" error={!!errors.telefone} {...register('telefone')} />
            </FormGroup>
          </div>

          <FormGroup label="Endereço" error={errors.endereco?.message}>
            <Textarea placeholder="Endereço completo (opcional)" error={!!errors.endereco} {...register('endereco')} />
          </FormGroup>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/devedores')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Cadastrar devedor'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
