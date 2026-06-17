// client/src/pages/CanchasCrud.jsx
import React, { useEffect, useState, useRef } from 'react';
import apiFetch from '../api';
import Header from '../components/Header';

function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '';
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CanchasCrud() {
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = currentUser?.email === 'pikachu234@gmail.com';

  const [canchas, setCanchas] = useState([]);
  const [form, setForm] = useState({
    nombreCancha: '',
    deporte: 'Futbol',
    descripcion: '',
    precioHora: '',
    Estado: 'Disponible'
  });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const firstErrorRef = useRef(null);

  function parsePriceInput(val) {
    if (val === '' || val === null || val === undefined) return '';
    const normalized = String(val).replace(/\s/g, '').replace(',', '.');
    const n = parseFloat(normalized);
    return Number.isFinite(n) ? n : '';
  }

  async function load() {
    setError(null);
    setFieldErrors({});
    try {
      const data = await apiFetch('/canchas', { method: 'GET' });
      setCanchas(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Error';
      setError(msg);
      if (err?.data?.errors && typeof err.data.errors === 'object') {
        setFieldErrors(err.data.errors);
      }
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const keys = Object.keys(fieldErrors);
    if (keys.length === 0) return;
    setTimeout(() => {
      if (firstErrorRef.current) firstErrorRef.current.focus();
    }, 50);
  }, [fieldErrors]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(t);
  }, [success]);

  async function handleSave(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const clientErrors = {};
    if (!form.nombreCancha || String(form.nombreCancha).trim() === '') {
      clientErrors.nombreCancha = 'nombre de la cancha es obligatorio';
    }

    const parsedPrice = parsePriceInput(form.precioHora);
    if (form.precioHora === '' || form.precioHora === null || form.precioHora === undefined) {
      clientErrors.precioHora = 'precio por hora es obligatorio';
    } else if (parsedPrice === '') {
      clientErrors.precioHora = 'precio por hora debe ser numérico';
    } else if (parsedPrice < 0) {
      clientErrors.precioHora = 'precio por hora debe ser mayor o igual a 0';
    }

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setError('Corrige los errores en el formulario');
      if (clientErrors.nombreCancha && firstErrorRef?.current) firstErrorRef.current.focus();
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nombreCancha: form.nombreCancha,
        deporte: form.deporte,
        descripcion: form.descripcion,
        precioHora: parsedPrice,
        Estado: form.Estado || 'Disponible'
      };

      if (editing) {
        await apiFetch(`/canchas/${editing}`, { method: 'PUT', body: JSON.stringify(payload) });
        setSuccess('Cancha actualizada');
      } else {
        await apiFetch('/canchas', { method: 'POST', body: JSON.stringify(payload) });
        setSuccess('Cancha creada');
      }

      setForm({ nombreCancha: '', deporte: 'Futbol', descripcion: '', precioHora: '', Estado: 'Disponible' });
      setEditing(null);
      await load();
    } catch (err) {
      console.error('handleSave error', err);
      const status = err?.status || (err?.data && err.data.status) || 0;
      const data = err?.data || null;

      if (data && data.errors && typeof data.errors === 'object') {
        setFieldErrors(data.errors);
        setError('Corrige los errores en el formulario');
        if (data.errors.nombreCancha && firstErrorRef?.current) firstErrorRef.current.focus();
      } else if (status === 409) {
        const msg = data?.message || err?.message || 'Conflicto';
        setFieldErrors({ nombreCancha: msg });
        setError('Corrige los errores en el formulario');
        if (firstErrorRef?.current) firstErrorRef.current.focus();
      } else if (status === 422 || status === 400) {
        const msg = data?.message || err?.message || 'Validación falló';
        const m = String(msg).match(/^([a-zA-Z0-9_]+)\s*[:\-\s]\s*(.+)$/);
        if (m) {
          const field = m[1];
          const rest = m[2];
          setFieldErrors({ [field]: rest });
          if (field === 'nombreCancha' && firstErrorRef?.current) firstErrorRef.current.focus();
        } else {
          setError(msg);
        }
      } else {
        const msg = data?.message || err?.message || 'Error inesperado';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(c) {
    setEditing(c.idCancha);
    setForm({
      nombreCancha: c.nombreCancha || '',
      deporte: c.deporte || 'Futbol',
      descripcion: c.descripcion || '',
      precioHora: c.precioHora ? String(c.precioHora) : '',
      Estado: c.Estado || 'Disponible'
    });
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    firstErrorRef.current = null;
  }

  async function handleDelete(id) {
    if (!window.confirm('Eliminar cancha?')) return;
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    setLoading(true);
    try {
      await apiFetch(`/canchas/${id}`, { method: 'DELETE' });
      setSuccess('Cancha eliminada');
      await load();
    } catch (err) {
      console.error('DELETE error', err);
      const data = err?.data || null;
      const msg = data?.message || err?.message || 'Error';
      setError(msg);
      if (data?.errors && typeof data.errors === 'object') setFieldErrors(data.errors);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-main">
        <h2>Canchas</h2>

        {Object.keys(fieldErrors).length > 0 ? (
          <div className="msg error" role="alert">Corrige los errores en el formulario</div>
        ) : (
          error && <div className="msg error" role="alert">{error}</div>
        )}

        {success && <div className="msg success" role="status">{success}</div>}

        {isAdmin && (
          <form onSubmit={handleSave} className="cancha-form" noValidate>
            <div className="form-row">
              <div style={{ flex: 1 }}>
                <input
                  placeholder="Nombre"
                  value={form.nombreCancha}
                  onChange={e => setForm({ ...form, nombreCancha: e.target.value })}
                  required
                  className="input"
                  aria-invalid={!!fieldErrors.nombreCancha}
                  aria-describedby={fieldErrors.nombreCancha ? 'err-nombre' : undefined}
                  ref={el => { if (fieldErrors.nombreCancha && !firstErrorRef.current) firstErrorRef.current = el; }}
                />
                {fieldErrors.nombreCancha && <div id="err-nombre" className="field-error" role="alert">{fieldErrors.nombreCancha}</div>}
              </div>

              <div style={{ minWidth: 160 }}>
                <input
                  placeholder="Deporte"
                  value={form.deporte}
                  onChange={e => setForm({ ...form, deporte: e.target.value })}
                  className="input"
                  aria-invalid={!!fieldErrors.deporte}
                  aria-describedby={fieldErrors.deporte ? 'err-deporte' : undefined}
                />
                {fieldErrors.deporte && <div id="err-deporte" className="field-error" role="alert">{fieldErrors.deporte}</div>}
              </div>

              <div style={{ minWidth: 140 }}>
                <input
                  placeholder="Precio Hora"
                  value={form.precioHora}
                  onChange={e => setForm({ ...form, precioHora: e.target.value })}
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  className="input price-input"
                  aria-invalid={!!fieldErrors.precioHora}
                  aria-describedby={fieldErrors.precioHora ? 'err-precio' : undefined}
                />
                {fieldErrors.precioHora && <div id="err-precio" className="field-error" role="alert">{fieldErrors.precioHora}</div>}
              </div>

              <div style={{ minWidth: 140 }}>
                <input
                  placeholder="Estado"
                  value={form.Estado}
                  onChange={e => setForm({ ...form, Estado: e.target.value })}
                  className="input"
                  aria-invalid={!!fieldErrors.Estado}
                  aria-describedby={fieldErrors.Estado ? 'err-estado' : undefined}
                />
                {fieldErrors.Estado && <div id="err-estado" className="field-error" role="alert">{fieldErrors.Estado}</div>}
              </div>
            </div>

            <textarea
              placeholder="Descripcion"
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              className="textarea"
              aria-invalid={!!fieldErrors.descripcion}
              aria-describedby={fieldErrors.descripcion ? 'err-desc' : undefined}
            />
            {fieldErrors.descripcion && <div id="err-desc" className="field-error" role="alert">{fieldErrors.descripcion}</div>}

            <div className="form-actions" style={{ marginTop: 12 }}>
              <button type="submit" disabled={loading} className="btn primary">{editing ? 'Actualizar' : 'Crear'}</button>
              {editing && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setEditing(null);
                    setForm({ nombreCancha: '', deporte: 'Futbol', descripcion: '', precioHora: '', Estado: 'Disponible' });
                    setError(null);
                    setSuccess(null);
                    setFieldErrors({});
                    firstErrorRef.current = null;
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        )}

        <table className="table" aria-live="polite">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre / Descripción</th>
              <th>Deporte</th>
              <th>Precio</th>
              <th>Estado</th>
              {isAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {canchas
              .filter(c => isAdmin || c.Estado !== 'Inactivo')
              .map(c => (
              <tr key={c.idCancha}>
                <td>{c.idCancha}</td>
                <td className="name-col">
                  <div className="name">{c.nombreCancha}</div>
                  {c.descripcion && <div className="desc">{c.descripcion}</div>}
                </td>
                <td>{c.deporte}</td>
                <td>{formatPrice(c.precioHora)}</td>
                <td>{c.Estado}</td>
                {isAdmin && (
                  <td>
                    <button type="button" onClick={() => handleEdit(c)} className="btn small">Editar</button>
                    <button type="button" onClick={() => handleDelete(c.idCancha)} className="btn small danger">Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}