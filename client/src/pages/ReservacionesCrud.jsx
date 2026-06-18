// client/src/pages/ReservacionesCrud.jsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import Header from '../components/Header';

export default function ReservacionesCrud() {
  // Verificamos si es el administrador
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = currentUser?.email === 'pikachu234@gmail.com';

  const [canchas, setCanchas] = useState([]);
  const [misReservas, setMisReservas] = useState([]);
  
  const today = new Date().toISOString().split('T')[0];
  const [filtroFecha, setFiltroFecha] = useState(today);

  const [formReserva, setFormReserva] = useState({
    idCancha: '',
    horaInicio: '10:00',
    horaFin: '11:00'
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const canchasData = await apiFetch('/canchas', { method: 'GET' });
      setCanchas(Array.isArray(canchasData) ? canchasData : []);

      // AQUÍ ESTÁ LA MAGIA: Si es admin trae todas, si no, trae solo las suyas
      const endpoint = isAdmin ? '/reservaciones' : '/reservaciones?mine=true';
      const reservasData = await apiFetch(endpoint, { method: 'GET' });
      
      setMisReservas(Array.isArray(reservasData) ? reservasData : []);
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 3500);
    return () => clearTimeout(t);
  }, [success]);

  // CREAR RESERVA
  async function handleReservar(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formReserva.idCancha) return setError('Debes seleccionar una cancha');

    const inicioISO = `${filtroFecha}T${formReserva.horaInicio}:00`;
    const finISO = `${filtroFecha}T${formReserva.horaFin}:00`;
    const canchaSeleccionada = canchas.find(c => String(c.idCancha) === String(formReserva.idCancha));
    const precio = canchaSeleccionada ? canchaSeleccionada.precioHora : 0;

    try {
      await apiFetch('/reservaciones', {
        method: 'POST',
        body: JSON.stringify({
          idCancha: formReserva.idCancha,
          inicio: inicioISO,
          fin: finISO,
          precio_total: precio,
          estado: 'Confirmada'
        })
      });
      setSuccess('¡Reserva confirmada con éxito!');
      setFormReserva({ idCancha: '', horaInicio: '10:00', horaFin: '11:00' });
      loadData();
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Error al reservar');
    }
  }

  // CANCELAR / ELIMINAR RESERVA
  async function handleCancelar(id) {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
    setError(null);
    try {
      await apiFetch(`/reservaciones/${id}`, { method: 'DELETE' });
      setSuccess('Reserva cancelada correctamente');
      loadData();
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Error al cancelar la reserva');
    }
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-main">
        <h2>Gestión de Reservas</h2>
        {error && <div className="msg error" role="alert">{error}</div>}
        {success && <div className="msg success" role="status">{success}</div>}

        <div className="cancha-form" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* Formulario de Reserva */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3 style={{ marginTop: 0, color: 'var(--success)' }}>Nueva Reserva</h3>
            <form onSubmit={handleReservar}>
              <div className="form-row">
                <div style={{ flex: 1 }}>
                  <label>Fecha</label>
                  <input type="date" className="input" value={filtroFecha} min={today} onChange={(e) => setFiltroFecha(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Cancha</label>
                  <select className="input" required value={formReserva.idCancha} onChange={(e) => setFormReserva({...formReserva, idCancha: e.target.value})}>
                    <option value="" disabled>Seleccione...</option>
                    {canchas
                      .filter(c => c.Estado !== 'Inactivo')
                      .map(c => (
                      <option key={c.idCancha} value={c.idCancha}>
                        {c.nombreCancha} (${Number(c.precioHora).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div style={{ flex: 1 }}>
                  <label>Hora Inicio</label>
                  <input type="time" className="input" required value={formReserva.horaInicio} onChange={(e) => setFormReserva({...formReserva, horaInicio: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Hora Fin</label>
                  <input type="time" className="input" required value={formReserva.horaFin} onChange={(e) => setFormReserva({...formReserva, horaFin: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn primary" style={{ width: '100%', marginTop: '10px' }}>Agendar Reserva</button>
            </form>
          </div>
        </div>

        {/* Tabla de Reservas */}
        <h3 style={{ marginTop: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          {isAdmin ? 'Todas las Reservas del Sistema' : 'Mi Historial de Reservas'}
        </h3>
        
        {loading ? <div className="empty">Cargando...</div> : misReservas.length === 0 ? (
          <div className="empty">No hay reservaciones registradas.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>N° Reserva</th>
                {isAdmin && <th>ID Usuario</th>}
                <th>Cancha</th>
                <th>Fecha y Hora</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {misReservas.map(r => {
                const cancha = canchas.find(c => c.idCancha === r.idCancha);
                const nombreCancha = cancha ? cancha.nombreCancha : `Cancha ${r.idCancha}`;
                const fechaFormat = new Date(r.inicio).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });
                const finFormat = new Date(r.fin).toLocaleTimeString('es-CL', { timeStyle: 'short' });

                return (
                  <tr key={r.idReserva || r.id}>
                    <td>#{r.idReserva || r.id}</td>
                    {isAdmin && <td>{r.idUsuario || '-'}</td>}
                    <td className="name-col"><div className="name">{nombreCancha}</div></td>
                    <td>{fechaFormat} a {finFormat}</td>
                    <td>${Number(r.precio_total || 0).toLocaleString()}</td>
                    <td>
                      <button type="button" onClick={() => handleCancelar(r.idReserva || r.id)} className="btn small danger">Cancelar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
