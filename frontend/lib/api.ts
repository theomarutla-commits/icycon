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

export async function fetchProfile(authHeader: string) {
  const res = await fetch(`${API_BASE}/api/profile/dashboard`, {
    method: 'GET',
    headers: jsonHeaders(authHeader),
  });
  if (!res.ok) {
    throw new Error('Unable to load profile');
  }
  return res.json();
}

export async function updateProfile(authHeader: string, data: FormData | Record<string, any>) {
  const isFormData = data instanceof FormData;
  const res = await fetch(`${API_BASE}/api/profile/dashboard`, {
    method: 'PATCH',
    headers: isFormData ? (authHeader ? { Authorization: authHeader } : undefined) : jsonHeaders(authHeader),
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || 'Unable to update profile');
  }
  return res.json();
}

export async function createKeywordCluster(authHeader: string, payload: { intent: string; terms?: string; locale?: string }) {
  const res = await fetch(`${API_BASE}/api/seo/keywords/`, {
    method: 'POST',
    headers: jsonHeaders(authHeader),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Unable to create keyword cluster');
  }
  return res.json();
}

export async function createDirectory(authHeader: string, payload: { name: string; url: string; status?: string }) {
  const res = await fetch(`${API_BASE}/api/seo/directories/`, {
    method: 'POST',
    headers: jsonHeaders(authHeader),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Unable to create directory');
  }
  return res.json();
}

export async function translateTextApi(authHeader: string, payload: { text: string; target_lang?: string }) {
  const res = await fetch(`${API_BASE}/api/translate/`, {
    method: 'POST',
    headers: jsonHeaders(authHeader),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Unable to translate text');
  }
  return res.json();
}

export async function createSeoSite(authHeader: string, payload: { domain: string; default_locale?: string }) {
  const res = await fetch(`${API_BASE}/api/analytics/sites/`, {
    method: 'POST',
    headers: jsonHeaders(authHeader),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Unable to create site');
  }
  return res.json();
}

export async function createContentItem(authHeader: string, payload: { url: string; type?: string; locale?: string }) {
  const res = await fetch(`${API_BASE}/api/seo/content/`, {
    method: 'POST',
    headers: jsonHeaders(authHeader),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Unable to create content item');
  }
  return res.json();
}

export async function createFaq(authHeader: string, payload: { question: string; answer: string }) {
  const res = await fetch(`${API_BASE}/api/seo/faqs/`, {
    method: 'POST',
    headers: jsonHeaders(authHeader),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Unable to create FAQ');
  }
  return res.json();
}

export async function createBacklink(authHeader: string, payload: { domain?: string; source_url?: string; target_url?: string }) {
  const res = await fetch(`${API_BASE}/api/seo/backlinks/`, {
    method: 'POST',
    headers: jsonHeaders(authHeader),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Unable to create backlink');
  }
  return res.json();
}

export async function createSocialPost(authHeader: string, payload: { content: string; platform?: string }) {
  const res = await fetch(`${API_BASE}/api/social/posts/`, {
    method: 'POST',
    headers: jsonHeaders(authHeader),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Unable to create social post');
  }
  return res.json();
}

export async function createEmailList(authHeader: string, payload: { name: string; lawful_basis?: string }) {
  const res = await fetch(`${API_BASE}/api/email/lists/`, {
    method: 'POST',
    headers: jsonHeaders(authHeader),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Unable to create email list');
  }
  return res.json();
}

export async function createEmailTemplate(authHeader: string, payload: { name: string; subject: string }) {
  const res = await fetch(`${API_BASE}/api/email/templates/`, {
    method: 'POST',
    headers: jsonHeaders(authHeader),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Unable to create email template');
  }
  return res.json();
}

export async function createEmailFlow(authHeader: string, payload: { name: string; description?: string }) {
  const res = await fetch(`${API_BASE}/api/email/flows/`, {
    method: 'POST',
    headers: jsonHeaders(authHeader),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Unable to create email flow');
  }
  return res.json();
}

export async function createEmailContact(authHeader: string, payload: { email: string; name?: string }) {
  const res = await fetch(`${API_BASE}/api/email/contacts/`, {
    method: 'POST',
    headers: jsonHeaders(authHeader),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Unable to create contact');
  }
  return res.json();
}

export async function createAsoApp(authHeader: string, payload: { name: string; platform?: string }) {
  const res = await fetch(`${API_BASE}/api/aso/apps/`, {
    method: 'POST',
    headers: jsonHeaders(authHeader),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Unable to create ASO app');
  }
  return res.json();
}

export async function createMarketplaceProduct(authHeader: string, payload: { title: string; price?: number; category?: string }) {
  const res = await fetch(`${API_BASE}/api/marketplace/products/`, {
    method: 'POST',
    headers: jsonHeaders(authHeader),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Unable to create product');
  }
  return res.json();
}

export { API_BASE };
