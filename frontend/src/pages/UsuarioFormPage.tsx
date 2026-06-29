import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usuarioService } from '@/services/usuarioService';
import { usuarioCreateSchema, usuarioSchema, type UsuarioCreateFormData, type UsuarioFormData } from '@/schemas/usuarioSchemas';
import { ROLE_LABELS } from '@/types';
import { getApiErrorMessage } from '@/utils/formatters';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { Loading } from '@/components/Loading';
import { FormGroup, Input, Select, Checkbox } from '@/components/FormInputs';

export function UsuarioFormPage() {
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
    formState: { errors },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(isEdit ? usuarioSchema : usuarioCreateSchema),
    defaultValues: { role: 'FUNCIONARIO', ativo: true },
  });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const usuario = await usuarioService.getById(id);
        reset({
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
          ativo: usuario.ativo,
          senha: '',
        });
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, reset]);

  const onSubmit = async (data: UsuarioFormData) => {
    setError('');
    setSubmitting(true);
    try {
      if (isEdit && id) {
        const payload: Record<string, unknown> = {
          nome: data.nome,
          email: data.email,
          role: data.role,
          ativo: data.ativo,
        };
        if (data.senha) payload.senha = data.senha;
        await usuarioService.update(id, payload);
      } else {
        await usuarioService.create(data as UsuarioCreateFormData);
      }
      navigate('/usuarios');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Carregando usuário..." />;

  const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));

  return (
    <>
      <div className="page-header">
        <h1>{isEdit ? 'Editar Usuário' : 'Novo Usuário'}</h1>
        <p>{isEdit ? 'Atualize os dados do usuário' : 'Cadastre um novo usuário'}</p>
      </div>

      {error && <Alert variant="error" className="mb-md">{error}</Alert>}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormGroup label="Nome" required error={errors.nome?.message}>
            <Input placeholder="Nome completo" error={!!errors.nome} {...register('nome')} />
          </FormGroup>

          <FormGroup label="E-mail" required error={errors.email?.message}>
            <Input type="email" placeholder="usuario@email.com" error={!!errors.email} {...register('email')} />
          </FormGroup>

          <FormGroup
            label={isEdit ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
            required={!isEdit}
            error={errors.senha?.message}
          >
            <Input
              type="password"
              placeholder="••••••••"
              error={!!errors.senha}
              {...register('senha')}
            />
          </FormGroup>

          <div className="form-row">
            <FormGroup label="Perfil" required error={errors.role?.message}>
              <Select options={roleOptions} error={!!errors.role} {...register('role')} />
            </FormGroup>

            <FormGroup label="Status">
              <Checkbox label="Usuário ativo" {...register('ativo')} />
            </FormGroup>
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/usuarios')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Cadastrar usuário'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
