// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import Header from '../components/Header';

export default function Dashboard() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    apiFetch('/reservaciones', { method: 'GET' })
      .then(data => {
        if (mounted) setReservas(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        setError(err?.data?.message || err?.message || 'Error al cargar');
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="app-container">
      <Header />
      <div className="app-main">
        <h2>Dashboard</h2>
        {loading && <div className="empty">Cargando reservaciones…</div>}
        {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
        {!loading && !error && (
          <>
            <h3 style={{ marginTop: 8 }}>Reservaciones</h3>
            {reservas.length === 0 ? (
              <div className="empty">No hay reservaciones</div>
            ) : (
              <table className="table" role="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cancha</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map(r => (
                    <tr key={r.idReserva || r.id}>
                      <td>{r.idReserva || r.id}</td>
                      <td>{r.idCancha || r.cancha || '-'}</td>
                      <td>{r.inicio}</td>
                      <td>{r.fin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}