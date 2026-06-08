// client/src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="app-header">
      <div className="brand">
        <div className="logo">AC</div>
        <div>
          <div className="title">App Canchas</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Gestión de reservas</div>
        </div>
      </div>

      <nav className="header-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Link to="/dashboard"><button>Dashboard</button></Link>
        <Link to="/canchas"><button>Cancha</button></Link>
        <Link to="/reservaciones"><button>Reservas</button></Link>
        <span style={{ marginLeft: 8, fontSize: 13, color: 'var(--muted)' }}>{user.nombre || ''}</span>
        <button className="primary" onClick={logout}>Cerrar sesión</button>
      </nav>
    </header>
  );
}