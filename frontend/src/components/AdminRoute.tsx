import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loading } from './Loading';
import { Alert } from './Alert';

export function AdminRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <Loading message="Verificando permissões..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert variant="error">
          Acesso negado. Esta área é restrita a administradores.
        </Alert>
      </div>
    );
  }

  return <Outlet />;
}
