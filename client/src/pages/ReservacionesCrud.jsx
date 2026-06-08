// client/src/pages/ReservacionesCrud.jsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import Header from '../components/Header';
import dayjs from 'dayjs';

export default function ReservacionesCrud() {
  const [canchas, setCanchas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [form, setForm] = useState({ idCancha:'', inicio:'', fin:'', precio_total:0 });
  const [error, setError] = useState(null);

  async function loadCanchas() {
    const data = await apiFetch('/canchas', { method: 'GET' });
    setCanchas(data);
  }
  async function loadReservas() {
    const data = await apiFetch('/reservaciones', { method: 'GET' });
    setReservas(data);
  }

  useEffect(()=>{ loadCanchas(); loadReservas(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await apiFetch('/reservaciones', { method: 'POST', body: JSON.stringify(form) });
      setForm({ idCancha:'', inicio:'', fin:'', precio_total:0 });
      loadReservas();
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Error');
    }
  }

  async function handleCancel(id) {
    if (!confirm('Cancelar reserva?')) return;
    try {
      await apiFetch(`/reservaciones/${id}`, { method: 'DELETE' });
      loadReservas();
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Error');
    }
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-main">
        <h2>Reservaciones</h2>
        {error && <div style={{color:'crimson'}}>{error}</div>}
        <form onSubmit={handleCreate} style={{maxWidth:520, marginBottom:20}}>
          <select value={form.idCancha} onChange={e=>setForm({...form,idCancha:e.target.value})} required>
            <option value="">Selecciona cancha</option>
            {canchas.map(c=> <option key={c.idCancha} value={c.idCancha}>{c.nombreCancha}</option>)}
          </select>
          <input type="datetime-local" value={form.inicio} onChange={e=>setForm({...form,inicio:e.target.value})} required />
          <input type="datetime-local" value={form.fin} onChange={e=>setForm({...form,fin:e.target.value})} required />
          <input type="number" value={form.precio_total} onChange={e=>setForm({...form,precio_total:parseFloat(e.target.value)})} />
          <button type="submit">Reservar</button>
        </form>

        <h3>Mis Reservas</h3>
        <table className="table">
          <thead><tr><th>ID</th><th>Cancha</th><th>Inicio</th><th>Fin</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {reservas.map(r=>(
              <tr key={r.idReserva}>
                <td>{r.idReserva}</td>
                <td>{r.idCancha}</td>
                <td>{dayjs(r.inicio).format('YYYY-MM-DD HH:mm')}</td>
                <td>{dayjs(r.fin).format('YYYY-MM-DD HH:mm')}</td>
                <td>{r.estado}</td>
                <td><button onClick={()=>handleCancel(r.idReserva)}>Cancelar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
