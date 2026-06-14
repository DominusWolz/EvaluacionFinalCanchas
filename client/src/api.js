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

  // Only set Content-Type when there is a body and it's not FormData
  if (opts.body !== undefined && !(opts.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const fetchOpts = { ...opts, headers };
  // ensure we don't pass undefined body to fetch
  if (fetchOpts.body === undefined) delete fetchOpts.body;

  try {
    const res = await fetch(url, fetchOpts);
    if (res.status === 401) {
  // limpiar token/usuario pero NO forzar redirección global
  setToken(null);
  localStorage.removeItem('user');
  // devolver rechazo para que el componente decida qué hacer
  return Promise.reject({ status: 401, message: 'Credenciales incorrectas' });
}
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        console.error('apiFetch error response', { url, status: res.status, data });
        return Promise.reject({ status: res.status, data });
      }
      return data;
    }
    if (!res.ok) {
      console.error('apiFetch non-json error', { url, status: res.status });
      return Promise.reject({ status: res.status, data: null });
    }
    return res;
  } catch (err) {
    console.error('apiFetch network error', { url, err });
    return Promise.reject({ status: 0, message: err.message || 'Network error' });
  }
}

export { apiFetch, setToken, getToken };
