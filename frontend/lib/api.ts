const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const jsonHeaders = (authHeader?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authHeader) headers['Authorization'] = authHeader;
  return headers;
};

export function buildBasicAuth(email: string, password: string) {
  return `Basic ${btoa(`${email}:${password}`)}`;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.error || 'Login failed');
  }
  const data = await res.json();
  const authHeader = buildBasicAuth(email, password);
  return { ...data, authHeader };
}

export async function signup(email: string, password: string, username: string) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({
      email,
      username,
      password,
      password_confirm: password,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.error || 'Signup failed');
  }
  const data = await res.json();
  const authHeader = buildBasicAuth(email, password);
  return { ...data, authHeader };
}

export async function fetchFeatures(authHeader: string) {
  const res = await fetch(`${API_BASE}/api/features/`, {
    method: 'GET',
    headers: jsonHeaders(authHeader),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.error || 'Unable to fetch features');
  }
  return res.json();
}

export { API_BASE };
