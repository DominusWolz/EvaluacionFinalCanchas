// client/src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
      <div className="header-actions">
        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button className="primary" onClick={logout}>Cerrar sesión</button>
      </div>
    </header>
  );
}