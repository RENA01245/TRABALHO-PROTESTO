import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/types';
import { Button } from './Button';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊', adminOnly: true },
  { to: '/titulos', label: 'Títulos', icon: '📄' },
  { to: '/credores', label: 'Credores', icon: '🏢' },
  { to: '/devedores', label: 'Devedores', icon: '👤' },
  { to: '/usuarios', label: 'Usuários', icon: '👥', adminOnly: true },
];

export function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = navItems.filter((item) => !item.adminOnly || isAdmin);

  const mainNav = filteredNav.filter((item) => !item.adminOnly || item.to === '/dashboard');
  const adminNav = filteredNav.filter((item) => item.adminOnly && item.to !== '/dashboard');

  return (
    <div className="layout">
      <div
        className={`layout__overlay ${sidebarOpen ? 'layout__overlay--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside className={`layout__sidebar ${sidebarOpen ? 'layout__sidebar--open' : ''}`}>
        <div className="layout__sidebar-header">
          <NavLink to="/titulos" className="layout__logo" onClick={() => setSidebarOpen(false)}>
            <span className="layout__logo-icon">⚖</span>
            <span className="layout__logo-text">
              Protesto
              <small>Gestão de Títulos</small>
            </span>
          </NavLink>
        </div>

        <nav className="layout__nav">
          <div className="layout__nav-section">
            <p className="layout__nav-label">Menu</p>
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `layout__nav-link ${isActive ? 'layout__nav-link--active' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <span className="layout__nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>

          {adminNav.length > 0 && (
            <div className="layout__nav-section">
              <p className="layout__nav-label">Administração</p>
              {adminNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `layout__nav-link ${isActive ? 'layout__nav-link--active' : ''}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="layout__nav-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>
      </aside>

      <div className="layout__main">
        <header className="layout__header">
          <div className="layout__header-left">
            <button
              className="layout__menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              ☰
            </button>
            <span className="layout__header-title">Sistema de Protesto de Títulos</span>
          </div>

          <div className="layout__header-right">
            {user && (
              <div className="layout__user-info">
                <div className="layout__user-name">{user.nome}</div>
                <div className="layout__user-role">{ROLE_LABELS[user.role]}</div>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </header>

        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
