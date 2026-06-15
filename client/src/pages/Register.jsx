import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiFetch from '../api';
import Header from '../components/Header';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmContrasena, setConfirmContrasena] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  function validate() {
    const errors = {};
    if (!nombre || String(nombre).trim().length < 2) {
      errors.nombre = 'Nombre debe tener al menos 2 caracteres';
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email inválido';
    }
    if (!contrasena || contrasena.length < 8) {
      errors.contrasena = 'La contraseña debe tener al menos 8 caracteres';
    }
    if (contrasena !== confirmContrasena) {
      errors.confirmContrasena = 'Las contraseñas no coinciden';
    }
    if (telefono && String(telefono).length > 30) {
      errors.telefono = 'Teléfono demasiado largo';
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setFieldErrors({});
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setMsg('Corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        contrasena,
        telefono: telefono ? telefono.trim() : null
      };

      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Si la API devuelve éxito, redirigir a login y mostrar mensaje
      setMsg(null);
      navigate('/login', { replace: true, state: { info: 'Registro exitoso. Inicia sesión.' } });
    } catch (err) {
      console.error('register error', err);
      const status = err?.status || 0;
      const data = err?.data || null;

      if (data && data.errors && typeof data.errors === 'object') {
        setFieldErrors(data.errors);
        setMsg('Corrige los errores en el formulario');
      } else if (status === 409) {
        // conflicto (email duplicado)
        setFieldErrors({ email: data?.errors?.email || data?.message || 'Email ya registrado' });
        setMsg('Corrige los errores en el formulario');
      } else if (status === 422 || status === 400) {
        setMsg(data?.message || 'Validación falló');
      } else {
        setMsg(data?.message || err?.message || 'Error al registrar');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-main" style={{ maxWidth: 520, margin: '40px auto' }}>
        <h2>Registrar cuenta</h2>

        {msg && <div style={{ marginBottom: 12, color: fieldErrors && Object.keys(fieldErrors).length ? 'crimson' : 'green' }}>{msg}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Tu nombre"
              required
              style={{ width: '100%', padding: 8 }}
              aria-invalid={!!fieldErrors.nombre}
              aria-describedby={fieldErrors.nombre ? 'err-nombre' : undefined}
            />
            {fieldErrors.nombre && <div id="err-nombre" style={{ color: 'crimson', marginTop: 6 }}>{fieldErrors.nombre}</div>}
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              style={{ width: '100%', padding: 8 }}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'err-email' : undefined}
            />
            {fieldErrors.email && <div id="err-email" style={{ color: 'crimson', marginTop: 6 }}>{fieldErrors.email}</div>}
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Contraseña</label>
              <input
                type="password"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                style={{ width: '100%', padding: 8 }}
                aria-invalid={!!fieldErrors.contrasena}
                aria-describedby={fieldErrors.contrasena ? 'err-pass' : undefined}
              />
              {fieldErrors.contrasena && <div id="err-pass" style={{ color: 'crimson', marginTop: 6 }}>{fieldErrors.contrasena}</div>}
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Confirmar contraseña</label>
              <input
                type="password"
                value={confirmContrasena}
                onChange={e => setConfirmContrasena(e.target.value)}
                placeholder="Repite la contraseña"
                required
                style={{ width: '100%', padding: 8 }}
                aria-invalid={!!fieldErrors.confirmContrasena}
                aria-describedby={fieldErrors.confirmContrasena ? 'err-pass2' : undefined}
              />
              {fieldErrors.confirmContrasena && <div id="err-pass2" style={{ color: 'crimson', marginTop: 6 }}>{fieldErrors.confirmContrasena}</div>}
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Teléfono (opcional)</label>
            <input
              type="tel"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              placeholder="+56912345678"
              style={{ width: '100%', padding: 8 }}
              aria-invalid={!!fieldErrors.telefono}
              aria-describedby={fieldErrors.telefono ? 'err-tel' : undefined}
            />
            {fieldErrors.telefono && <div id="err-tel" style={{ color: 'crimson', marginTop: 6 }}>{fieldErrors.telefono}</div>}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar'}
            </button>

            <Link to="/login" style={{ marginLeft: 8, textDecoration: 'none' }}>
              <button type="button">Ir a Iniciar sesión</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}