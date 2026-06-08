import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', contrasena: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Credenciales inválidas');
        setLoading(false);
        return;
      }
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user || {}));
      navigate('/dashboard');
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-card" role="main">
      <h2>Iniciar sesión</h2>
      <p style={{ color: 'var(--muted)', marginTop: 6, marginBottom: 12 }}>Accede con tu correo y contraseña</p>
      {error && <div style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="form-row">
          <label>Contraseña</label>
          <input type="password" value={form.contrasena} onChange={e => setForm({ ...form, contrasena: e.target.value })} required />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          <button type="button" className="btn ghost" onClick={() => { setForm({ email: '', contrasena: '' }); setError(null); }}>Limpiar</button>
        </div>
      </form>
    </div>
  );
}