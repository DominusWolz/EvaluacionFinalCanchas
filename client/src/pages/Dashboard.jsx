// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = currentUser?.email === 'pikachu234@gmail.com';

  const [canchas, setCanchas] = useState([]);
  const [misReservas, setMisReservas] = useState([]);
  
  // Estados exclusivos para el Administrador
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [todasLasReservas, setTodasLasReservas] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboard() {
      try {
        // 1. Cargar canchas
        const canchasData = await apiFetch('/canchas', { method: 'GET' });
        setCanchas(Array.isArray(canchasData) ? canchasData : []);

        // 2. Cargar reservas personales (para usuarios normales o para saber cuántas reservó el admin)
        const reservasData = await apiFetch('/reservaciones?mine=true', { method: 'GET' });
        setMisReservas(Array.isArray(reservasData) ? reservasData : []);

        // 3. NUEVO: Si es Admin, cargar datos globales del sistema
        if (isAdmin) {
          try {
            // Usuarios totales
            const usersData = await apiFetch('/usuarios', { method: 'GET' });
            setTotalUsuarios(Array.isArray(usersData) ? usersData.length : 0);

            // Todas las reservas del sistema (sin el filtro ?mine=true)
            const allReservas = await apiFetch('/reservaciones', { method: 'GET' });
            setTodasLasReservas(Array.isArray(allReservas) ? allReservas : []);
          } catch (errAdmin) {
            console.warn("No se pudieron cargar métricas de admin", errAdmin);
          }
        }

      } catch (err) {
        setError(err?.data?.message || err?.message || 'Error al cargar métricas');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [isAdmin]);

  // Cálculos para usuarios normales
  const totalCanchas = canchas.filter(c => c.Estado !== 'Inactivo').length;
  const reservasActivas = misReservas.length;
  const dineroInvertido = misReservas.reduce((acc, curr) => acc + Number(curr.precio_total || 0), 0);

  // Cálculos para el Administrador
  const totalReservasSistema = todasLasReservas.length;
  const dineroTotalRecaudado = todasLasReservas.reduce((acc, curr) => acc + Number(curr.precio_total || 0), 0);

  return (
    <div className="app-container">
      <Header />
      <div className="app-main">
        <h2>Hola, bienvenido a tu Panel</h2>
        <p style={{ color: 'var(--muted)', marginTop: '-10px', marginBottom: '24px' }}>
          Resumen general de tu actividad en el sistema.
        </p>

        {error && <div className="msg error" role="alert">{error}</div>}
        {loading && <div className="empty">Cargando métricas...</div>}

        {!loading && !error && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              
              <div className="cancha-form" style={{ textAlign: 'center', margin: 0, borderTop: '4px solid var(--accent)' }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--muted)' }}>Canchas Activas</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{totalCanchas}</div>
              </div>

              {/* Tarjeta dinámica de Reservas: Muestra todas si es Admin, o solo las personales si es cliente */}
              <div className="cancha-form" style={{ textAlign: 'center', margin: 0, borderTop: '4px solid var(--success)' }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--muted)' }}>
                  {isAdmin ? 'Reservas en el Sistema' : 'Tus Reservas'}
                </h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  {isAdmin ? totalReservasSistema : reservasActivas}
                </div>
              </div>

              {/* Tarjeta dinámica de Dinero: Muestra la recaudación total si es Admin, o lo gastado si es cliente */}
              <div className="cancha-form" style={{ textAlign: 'center', margin: 0, borderTop: '4px solid #f59e0b' }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--muted)' }}>
                  {isAdmin ? 'Total Recaudado' : 'Total Invertido'}
                </h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  ${isAdmin ? dineroTotalRecaudado.toLocaleString() : dineroInvertido.toLocaleString()}
                </div>
              </div>

              {/* Tarjeta de Usuarios: Solo visible para el Admin */}
              {isAdmin && (
                <div className="cancha-form" style={{ textAlign: 'center', margin: 0, borderTop: '4px solid #8b5cf6' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--muted)' }}>Usuarios Registrados</h4>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{totalUsuarios}</div>
                </div>
              )}

            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              {/* Ocultamos el botón de reservar para el admin (no lo necesita) */}
              {!isAdmin && (
                <button onClick={() => navigate('/reservaciones')} className="btn primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
                  Ir a Reservar Cancha
                </button>
              )}
              <button onClick={() => navigate('/canchas')} className="btn" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
                {isAdmin ? 'Gestionar Canchas' : 'Ver Lista de Canchas'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}