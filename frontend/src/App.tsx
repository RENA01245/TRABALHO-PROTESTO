import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./services/auth";
import { AppLayout } from "./components/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ImportPage } from "./pages/ImportPage";
import { LoginPage } from "./pages/LoginPage";
import { PartiesPage } from "./pages/PartiesPage";
import { ProtestDetailPage } from "./pages/ProtestDetailPage";
import { ReportsPage } from "./pages/ReportsPage";
import { TitlesPage } from "./pages/TitlesPage";
import { UsersPage } from "./pages/UsersPage";

function Protected() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <AppLayout />;
}

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Protected />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/titulos" element={<Navigate to="/protestos" replace />} />
          <Route path="/protestos" element={<TitlesPage />} />
          <Route path="/protestos/:id" element={<ProtestDetailPage />} />
          <Route path="/importar" element={<ImportPage />} />
          <Route path="/credores" element={<PartiesPage type="creditors" title="Credores" />} />
          <Route path="/devedores" element={<PartiesPage type="debtors" title="Devedores" />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/relatorios" element={<ReportsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
