import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <strong>Protesto</strong>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/protestos">Protestos</NavLink>
          <NavLink to="/importar">Importar Arquivo</NavLink>
          {user?.role === "ADMIN" && <NavLink to="/usuarios">Usuarios</NavLink>}
          <NavLink to="/relatorios">Relatorios</NavLink>
          <button className="navButton" onClick={handleLogout}>Sair</button>
        </nav>
      </aside>
      <main>
        <header className="topbar">
          <div>
            <span>{user?.name}</span>
            <small>{user?.role === "ADMIN" ? "Administrador" : "Funcionario"}</small>
          </div>
          <button className="ghost" onClick={handleLogout}>Sair</button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
