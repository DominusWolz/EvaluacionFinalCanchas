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

  if (opts.body !== undefined && !(opts.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const fetchOpts = { ...opts, headers };
  if (fetchOpts.body === undefined) delete fetchOpts.body;

  // helper: parse JSON safely
  async function parseJsonSafe(res) {
    const text = await res.text();
    try { return text ? JSON.parse(text) : null; } catch { return text; }
  }

  try {
    const res = await fetch(url, fetchOpts);

    // 401: limpiar sesión y devolver error consistente
    if (res.status === 401) {
      setToken(null);
      localStorage.removeItem('user');
      const data = await parseJsonSafe(res);
      const err = new Error(data?.message || 'Credenciales incorrectas');
      err.status = 401;
      err.data = data;
      return Promise.reject(err);
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await parseJsonSafe(res);
      if (!res.ok) {
        console.error('apiFetch error response', { url, status: res.status, data });
        const err = new Error(data?.message || res.statusText || 'Error en la petición');
        err.status = res.status;
        err.data = data;
        return Promise.reject(err);
      }
      return data;
    }

    if (!res.ok) {
      console.error('apiFetch non-json error', { url, status: res.status });
      const err = new Error(res.statusText || 'Error en la petición');
      err.status = res.status;
      err.data = null;
      return Promise.reject(err);
    }

    return res;
  } catch (err) {
    console.error('apiFetch network error', { url, err });
    const e = new Error(err.message || 'Network error');
    e.status = 0;
    e.data = null;
    return Promise.reject(e);
  }
}

export { apiFetch, setToken, getToken };
export default apiFetch;
