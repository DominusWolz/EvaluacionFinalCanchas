// client/src/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

async function apiFetch(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const headers = opts.headers ? { ...opts.headers } : {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!headers['Content-Type'] && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, { ...opts, headers });
  if (res.status === 401) {
    // sesión inválida: limpiar y redirigir a login
    setToken(null);
    localStorage.removeItem('user');
    // pequeña demora para que el caller pueda manejar la respuesta si lo desea
    window.location.href = '/login';
    return Promise.reject({ status: 401, message: 'No autorizado' });
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) return Promise.reject({ status: res.status, data });
    return data;
  }
  // si no es JSON, devolver el response crudo
  if (!res.ok) return Promise.reject({ status: res.status, data: null });
  return res;
}

export { apiFetch, setToken, getToken };