// client/src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { apiFetch } from '../api';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);
  const [devToken, setDevToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setDevToken(null);
    setLoading(true);
    try {
      const res = await apiFetch('/auth/forgot', { method: 'POST', body: JSON.stringify({ email }) });
      setMsg(res.message || 'Si existe una cuenta, recibirás instrucciones.');
      if (res.devToken) setDevToken(res.devToken);
      // opcional: redirigir al formulario de reset con token en query (solo en dev)
      if (res.devToken && process.env.NODE_ENV !== 'production') {
        // mostrar enlace para facilitar pruebas
        // no redirigimos automáticamente para que el usuario copie el token si lo desea
      }
    } catch (err) {
      setMsg(err?.data?.message || err?.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-main" style={{ maxWidth: 520 }}>
        <h2>Solicitar restablecimiento</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <div style={{ marginTop: 8 }}>
            <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Solicitar'}</button>
            <button type="button" onClick={() => navigate('/login')} style={{ marginLeft: 8 }}>Volver</button>
          </div>
        </form>

        {msg && <div style={{ marginTop: 12, color: 'var(--muted)' }}>{msg}</div>}

        {devToken && (
          <div style={{ marginTop: 12 }}>
            <div style={{ color: 'crimson', wordBreak: 'break-all' }}>Token (dev): {devToken}</div>
            <div style={{ marginTop: 8 }}>
              <a href={`/reset-password?token=${encodeURIComponent(devToken)}`}>Ir a restablecer contraseña</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}