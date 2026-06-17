// client/src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  // leer user desde localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch (e) {
    user = null;
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    background: 'linear-gradient(90deg, #0f172a 0%, #0b3d91 40%, #0b6fb3 100%)',
    color: '#fff',
    boxShadow: '0 6px 18px rgba(11, 47, 91, 0.18)',
    position: 'sticky',
    top: 0,
    zIndex: 50
  };

  const brandStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: '#fff',
    textDecoration: 'none'
  };

  const navLinkStyle = {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    padding: '6px 8px',
    borderRadius: 6,
    fontSize: 14
  };

  const rightStyle = { display: 'flex', gap: 8, alignItems: 'center' };

  const btnStyle = {
    padding: '6px 12px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600
  };

  const primaryBtn = {
    ...btnStyle,
    background: 'linear-gradient(180deg,#ffd54a,#ffb300)',
    color: '#0b2a4a',
    boxShadow: '0 6px 12px rgba(255,179,0,0.18)'
  };

  return (
    <header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/dashboard" style={brandStyle}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: 'radial-gradient(circle at 30% 30%, #fff6d6, #ffd54a 40%, #ffb300 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0b2a4a',
            fontWeight: 800,
            boxShadow: '0 6px 14px rgba(11,47,91,0.25)'
          }}>
            {/* AQUÍ ESTÁ EL LOGO SVG DE LA POKÉBALL */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="30" 
              height="30" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
              <line x1="2" y1="12" x2="9" y2="12"></line>
              <line x1="15" y1="12" x2="22" y2="12"></line>
            </svg>
          </div>
          <div style={{ marginLeft: 6 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>App Canchas</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>Gestión de reservas</div>
          </div>
        </Link>

        <nav style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
          <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
          <Link to="/canchas" style={navLinkStyle}>Cancha</Link>
          <Link to="/reservaciones" style={navLinkStyle}>Reservas</Link>
        </nav>
      </div>

      <div style={rightStyle}>
        {user && user.email ? (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ textAlign: 'right', marginRight: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{user.nombre || user.email}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{user.email}</div>
            </div>
            <button onClick={handleLogout} style={primaryBtn}>Cerrar sesión</button>
          </div>
        ) : (
          null
        )}
      </div>
    </header>
  );
}