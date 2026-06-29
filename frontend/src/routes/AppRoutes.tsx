import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminRoute } from '@/components/AdminRoute';
import { LoginPage } from '@/pages/LoginPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { TitulosListPage } from '@/pages/TitulosListPage';
import { TituloFormPage } from '@/pages/TituloFormPage';
import { TituloDetailPage } from '@/pages/TituloDetailPage';
import { CredoresListPage } from '@/pages/CredoresListPage';
import { CredorFormPage } from '@/pages/CredorFormPage';
import { DevedoresListPage } from '@/pages/DevedoresListPage';
import { DevedorFormPage } from '@/pages/DevedorFormPage';
import { UsuariosListPage } from '@/pages/UsuariosListPage';
import { UsuarioFormPage } from '@/pages/UsuarioFormPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/titulos" replace />} />

          <Route path="titulos" element={<TitulosListPage />} />
          <Route path="titulos/novo" element={<TituloFormPage />} />
          <Route path="titulos/:id" element={<TituloDetailPage />} />
          <Route path="titulos/:id/editar" element={<TituloFormPage />} />

          <Route path="credores" element={<CredoresListPage />} />
          <Route path="credores/novo" element={<CredorFormPage />} />
          <Route path="credores/:id/editar" element={<CredorFormPage />} />

          <Route path="devedores" element={<DevedoresListPage />} />
          <Route path="devedores/novo" element={<DevedorFormPage />} />
          <Route path="devedores/:id/editar" element={<DevedorFormPage />} />

          <Route element={<AdminRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="usuarios" element={<UsuariosListPage />} />
            <Route path="usuarios/novo" element={<UsuarioFormPage />} />
            <Route path="usuarios/:id/editar" element={<UsuarioFormPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/titulos" replace />} />
    </Routes>
  );
}
