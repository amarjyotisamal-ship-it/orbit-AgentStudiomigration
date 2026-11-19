const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5101/api";
const token = () => localStorage.getItem("poc_token");

export async function request(path, options = {}) {
  const headers = { "content-type": "application/json", ...(options.headers || {}) };
  if (token()) headers.authorization = `Bearer ${token()}`;

  const timeoutMs = options.timeoutMs || 35000;
  const signal = options.signal || (typeof AbortSignal?.timeout === 'function' ? AbortSignal.timeout(timeoutMs) : undefined);

  let res;
  try {
    res = await fetch(API + path, { ...options, headers, signal });
  } catch (err) {
    if (err.name === 'TimeoutError') throw new Error("Request timed out. Please check your connection.");
    throw new Error(err.message || "Network error. Please try again.");
  }

  if (res.status === 204) return null;
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && path !== '/auth/login' && path !== '/auth/register') {
      window.dispatchEvent(new CustomEvent('orbit:auth_expired'));
    }
    throw new Error((typeof body.error === "string" ? body.error : body.error?.message) || body.message || `Request failed with HTTP ${res.status}`);
  }
  return body;
}

export const apiGet = (path, options = {}) => request(path, { ...options, method: 'GET' });
export const apiPost = (path, body, options = {}) => request(path, { ...options, method: 'POST', body: JSON.stringify(body) });
export const apiDelete = (path, options = {}) => request(path, { ...options, method: 'DELETE' });
