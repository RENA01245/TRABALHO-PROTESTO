import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/services/authService';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/authSchemas';
import { getApiErrorMessage } from '@/utils/formatters';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { FormGroup, Input } from '@/components/FormInputs';

export function ForgotPasswordPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError('');
    setSuccess('');
    setToken('');
    setLoading(true);
    try {
      const response = await authService.forgotPassword(data.email);
      setSuccess(response.message || 'Solicitação enviada com sucesso.');
      if (response.token) {
        setToken(response.token);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível processar a solicitação'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-layout__card">
        <div className="auth-layout__brand">
          <h1>Recuperar Senha</h1>
          <p>Informe seu e-mail para receber instruções</p>
        </div>

        <Card title="Esqueci minha senha">
          {error && <Alert variant="error" className="mb-md">{error}</Alert>}
          {success && (
            <Alert variant="success" className="mb-md">
              {success}
              {token && (
                <>
                  <p className="mt-sm">Use o token abaixo para redefinir sua senha:</p>
                  <div className="token-display">{token}</div>
                  <p className="mt-sm">
                    <Link to={`/reset-password?token=${encodeURIComponent(token)}`}>
                      Ir para redefinição de senha
                    </Link>
                  </p>
                </>
              )}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormGroup label="E-mail" required error={errors.email?.message}>
              <Input
                type="email"
                placeholder="seu@email.com"
                error={!!errors.email}
                {...register('email')}
              />
            </FormGroup>

            <Button type="submit" block disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar solicitação'}
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
