// client/src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { apiFetch } from '../api';
import Header from '../components/Header';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const tokenFromQuery = searchParams.get('token') || '';
  const [token, setToken] = useState(tokenFromQuery);
  const [password, setPassword] = useState('');
  const [confirmP, setConfirmP] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    if (password.length < 8) return setMsg('La contraseña debe tener al menos 8 caracteres');
    if (password !== confirmP) return setMsg('Las contraseñas no coinciden');
    setLoading(true);
    try {
      await apiFetch('/auth/reset', { method: 'POST', body: JSON.stringify({ token, password }) });
      setMsg('Contraseña restablecida. Redirigiendo a login...');
      setTimeout(() => navigate('/login'), 1400);
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
        <h2>Restablecer contraseña</h2>
        <form onSubmit={handleSubmit}>
          {!tokenFromQuery && (
            <div style={{ marginBottom: 8 }}>
              <input placeholder="Token" value={token} onChange={e => setToken(e.target.value)} required />
            </div>
          )}
          <div style={{ marginBottom: 8 }}>
            <input type="password" placeholder="Nueva contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 8 }}>
            <input type="password" placeholder="Confirmar contraseña" value={confirmP} onChange={e => setConfirmP(e.target.value)} required />
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit" disabled={loading}>{loading ? 'Procesando...' : 'Restablecer'}</button>
            <button type="button" onClick={() => navigate('/login')} style={{ marginLeft: 8 }}>Cancelar</button>
          </div>
        </form>
        {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
      </div>
    </div>
  );
}