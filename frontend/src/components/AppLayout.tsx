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
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/titulos">Titulos</NavLink>
          <NavLink to="/credores">Credores</NavLink>
          <NavLink to="/devedores">Devedores</NavLink>
          {user?.role === "ADMIN" && <NavLink to="/usuarios">Usuarios</NavLink>}
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
