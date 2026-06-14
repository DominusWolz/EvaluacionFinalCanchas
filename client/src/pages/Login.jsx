// client/src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import Header from '../components/Header';

export default function Login() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  // Limpia token viejo para pruebas (quita en producción si no quieres esto)
  useEffect(() => {
    // comentar la siguiente línea si quieres mantener sesión entre recargas
    localStorage.removeItem('token');
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, contrasena })
      });

      // DEBUG: ver qué devuelve exactamente la API
      console.log('login response:', res);

      // Solo navegar si recibimos un token no vacío
      if (res && typeof res === 'object' && res.token) {
        localStorage.setItem('token', res.token);
        navigate('/dashboard');
        return;
      }

      // Si la API devolvió un objeto con mensaje, mostrarlo
      const message = res?.message || 'Credenciales incorrectas';
      setMsg(message);
    } catch (err) {
      console.error('login error:', err);
      // Si apiFetch lanza un objeto con .data o .message, usarlo
      const message = err?.data?.message || err?.message || 'Error al iniciar sesión';
      setMsg(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-main" style={{ maxWidth: 420, margin: '40px auto' }}>
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 8 }}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>

            <button type="button" onClick={() => navigate('/')} style={{ marginLeft: 8 }}>
              Volver
            </button>
          </div>

          <div style={{ marginTop: 10 }}>
            <Link to="/forgot-password" style={{ color: '#007bff', textDecoration: 'underline' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>

        {msg && <div style={{ marginTop: 12, color: 'crimson' }}>{msg}</div>}
      </div>
    </div>
  );
}