import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/services/authService';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas/authSchemas';
import { getApiErrorMessage } from '@/utils/formatters';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { FormGroup, Input } from '@/components/FormInputs';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: searchParams.get('token') || '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await authService.resetPassword(data.token, data.senha);
      setSuccess(response.message || 'Senha redefinida com sucesso!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível redefinir a senha'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-layout__card">
        <div className="auth-layout__brand">
          <h1>Redefinir Senha</h1>
          <p>Informe o token e sua nova senha</p>
        </div>

        <Card title="Nova senha">
          {error && <Alert variant="error" className="mb-md">{error}</Alert>}
          {success && <Alert variant="success" className="mb-md">{success}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormGroup label="Token" required error={errors.token?.message}>
              <Input
                placeholder="Token de recuperação"
                error={!!errors.token}
                {...register('token')}
              />
            </FormGroup>

            <FormGroup label="Nova senha" required error={errors.senha?.message}>
              <Input
                type="password"
                placeholder="••••••••"
                error={!!errors.senha}
                {...register('senha')}
              />
            </FormGroup>

            <FormGroup label="Confirmar senha" required error={errors.confirmarSenha?.message}>
              <Input
                type="password"
                placeholder="••••••••"
                error={!!errors.confirmarSenha}
                {...register('confirmarSenha')}
              />
            </FormGroup>

            <Button type="submit" block disabled={loading}>
              {loading ? 'Salvando...' : 'Redefinir senha'}
            </Button>
          </form>

          <div className="login-page__footer">
            <Link to="/login">Voltar ao login</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
