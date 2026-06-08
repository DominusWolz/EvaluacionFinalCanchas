// client/src/pages/CanchasCrud.jsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import Header from '../components/Header';

export default function CanchasCrud() {
  const [canchas, setCanchas] = useState([]);
  const [form, setForm] = useState({ nombreCancha:'', deporte:'Futbol', descripcion:'', precioHora:0, Estado:'Disponible' });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  async function load() {
    try {
      const data = await apiFetch('/canchas', { method: 'GET' });
      setCanchas(data);
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Error');
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(e) {
    e.preventDefault();
    try {
      if (editing) {
        await apiFetch(`/canchas/${editing}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await apiFetch('/canchas', { method: 'POST', body: JSON.stringify(form) });
      }
      setForm({ nombreCancha:'', deporte:'Futbol', descripcion:'', precioHora:0, Estado:'Disponible' });
      setEditing(null);
      load();
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Error');
    }
  }

  async function handleEdit(c) {
    setEditing(c.idCancha);
    setForm({ nombreCancha:c.nombreCancha, deporte:c.deporte, descripcion:c.descripcion, precioHora:c.precioHora, Estado:c.Estado });
  }

  async function handleDelete(id) {
    if (!confirm('Eliminar cancha?')) return;
    try {
      await apiFetch(`/canchas/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Error');
    }
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-main">
        <h2>Canchas</h2>
        {error && <div style={{color:'crimson'}}>{error}</div>}
        <form onSubmit={handleSave} style={{maxWidth:520, marginBottom:20}}>
          <input placeholder="Nombre" value={form.nombreCancha} onChange={e=>setForm({...form,nombreCancha:e.target.value})} required />
          <input placeholder="Deporte" value={form.deporte} onChange={e=>setForm({...form,deporte:e.target.value})} />
          <input placeholder="Precio Hora" type="number" value={form.precioHora} onChange={e=>setForm({...form,precioHora:parseFloat(e.target.value)})} />
          <input placeholder="Estado" value={form.Estado} onChange={e=>setForm({...form,Estado:e.target.value})} />
          <textarea placeholder="Descripcion" value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} />
          <button type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
          {editing && <button type="button" onClick={()=>{setEditing(null); setForm({nombreCancha:'',deporte:'Futbol',descripcion:'',precioHora:0,Estado:'Disponible'})}}>Cancelar</button>}
        </form>

        <table className="table">
          <thead><tr><th>ID</th><th>Nombre</th><th>Deporte</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {canchas.map(c => (
              <tr key={c.idCancha}>
                <td>{c.idCancha}</td>
                <td>{c.nombreCancha}</td>
                <td>{c.deporte}</td>
                <td>{c.precioHora}</td>
                <td>{c.Estado}</td>
                <td>
                  <button onClick={()=>handleEdit(c)}>Editar</button>
                  <button onClick={()=>handleDelete(c.idCancha)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
