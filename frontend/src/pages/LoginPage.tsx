import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { loginSchema, type LoginFormData } from '@/schemas/authSchemas';
import { getApiErrorMessage } from '@/utils/formatters';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { FormGroup, Input } from '@/components/FormInputs';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setLoading(true);
    try {
      await login(data.email, data.senha);
      navigate('/titulos');
    } catch (err) {
      setError(getApiErrorMessage(err, 'E-mail ou senha inválidos'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-layout__card">
        <div className="auth-layout__brand">
          <h1>Sistema de Protesto de Títulos</h1>
          <p>Acesse sua conta para continuar</p>
        </div>

        <Card title="Entrar">
          {error && <Alert variant="error" className="mb-md">{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormGroup label="E-mail" required error={errors.email?.message}>
              <Input
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                error={!!errors.email}
                {...register('email')}
              />
            </FormGroup>

            <FormGroup label="Senha" required error={errors.senha?.message}>
              <Input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                error={!!errors.senha}
                {...register('senha')}
              />
            </FormGroup>

            <Button type="submit" block disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="login-page__footer">
            <Link to="/forgot-password">Esqueci minha senha</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
