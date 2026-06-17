// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [canchas, setCanchas] = useState([]);
  const [misReservas, setMisReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboard() {
      try {
        const canchasData = await apiFetch('/canchas', { method: 'GET' });
        setCanchas(Array.isArray(canchasData) ? canchasData : []);

        const reservasData = await apiFetch('/reservaciones?mine=true', { method: 'GET' });
        setMisReservas(Array.isArray(reservasData) ? reservasData : []);
      } catch (err) {
        setError(err?.data?.message || err?.message || 'Error al cargar métricas');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  // Cálculos para las métricas del dashboard
  const totalCanchas = canchas.filter(c => c.Estado !== 'Inactivo').length;
  const reservasActivas = misReservas.length;
  const dineroInvertido = misReservas.reduce((acc, curr) => acc + Number(curr.precio_total || 0), 0);

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
            {/* Tarjetas de Métricas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              
              <div className="cancha-form" style={{ textAlign: 'center', margin: 0, borderTop: '4px solid var(--accent)' }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--muted)' }}>Canchas en el Sistema</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{totalCanchas}</div>
              </div>

              <div className="cancha-form" style={{ textAlign: 'center', margin: 0, borderTop: '4px solid var(--success)' }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--muted)' }}>Tus Reservas</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{reservasActivas}</div>
              </div>

              <div className="cancha-form" style={{ textAlign: 'center', margin: 0, borderTop: '4px solid #f59e0b' }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--muted)' }}>Total Invertido</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  ${dineroInvertido.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Accesos rápidos */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => navigate('/reservaciones')} className="btn primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
                Ir a Reservar Cancha
              </button>
              <button onClick={() => navigate('/canchas')} className="btn" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
                Ver Lista de Canchas
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}