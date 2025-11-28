export type UserProfile = {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar?: string | null;
};

export type AuthState = {
  email: string;
  username: string;
  password: string;
  user: UserProfile;
};

export type FeatureIndexItem = {
  key: string;
  name: string;
  description: string;
  endpoint: string;
};

export type DashboardResponse = {
  user: UserProfile;
  aso_apps_count: number;
  marketplace_products_count: number;
  recent_activities: any[];
};

const STORAGE_KEY = "icy_auth_state";
const defaultBase = typeof window !== "undefined" ? window.location.origin : "";
// Resolve API base: prefer VITE_API_BASE, otherwise fall back to localhost:8000
const envBase = (import.meta.env.VITE_API_BASE as string | undefined) || "";
const sanitizedEnv = envBase.replace(/\/$/, "");
export const API_BASE = sanitizedEnv || "http://127.0.0.1:8000";

const buildBasicToken = (identifier: string, password: string) => {
  const encoded = btoa(`${identifier}:${password}`);
  return `Basic ${encoded}`;
};

export const getStoredAuth = (): AuthState | null => {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthState) : null;
  } catch (err) {
    console.error("Unable to parse stored auth", err);
    return null;
  }
};

const persistAuth = (state: AuthState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const clearStoredAuth = () => {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
};

const getAuthHeader = () => {
  const auth = getStoredAuth();
  if (!auth) return null;
  const identifier = auth.username || auth.email;
  return buildBasicToken(identifier, auth.password);
};

type RequestOptions = {
  skipAuth?: boolean;
};

const normalizePath = (path: string) => {
  if (!path.startsWith("http")) {
    return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  }
  return path;
};

async function request<T>(path: string, init?: RequestInit, opts?: RequestOptions): Promise<T> {
  const headers = new Headers(init?.headers || {});
  headers.set("Accept", "application/json");

  if (init?.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!opts?.skipAuth) {
    const token = getAuthHeader();
    if (token) headers.set("Authorization", token);
  }

  const target = normalizePath(path);
  const res = await fetch(target, {
    credentials: "include",
    ...init,
    headers,
  });

  // Read the body once to avoid "Body has already been consumed" errors.
  const rawText = await res.text();
  const parsed = rawText ? safeParseJson(rawText) : null;

  if (!res.ok) {
    const detail =
      (parsed && (parsed.detail || parsed.error || JSON.stringify(parsed))) ||
      rawText ||
      `Request failed (${res.status})`;
    throw new Error(detail);
  }

  if (res.status === 204) {
    return null as unknown as T;
  }

  return (parsed as T) ?? (rawText as unknown as T);
}

function safeParseJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<AuthState> {
  const data = await request<{ user: UserProfile }>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    { skipAuth: true }
  );

  const authState: AuthState = {
    email,
    username: data.user?.username || email,
    password,
    user: data.user,
  };
  persistAuth(authState);
  return authState;
}

export async function signup({
  email,
  username,
  password,
  password_confirm,
}: {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
}) {
  const res = await request<{ user: UserProfile }>(
    "/api/auth/signup",
    {
      method: "POST",
      body: JSON.stringify({ email, username, password, password_confirm }),
    },
    { skipAuth: true }
  );
  // After signup, auto-login with the supplied credentials
  const authState: AuthState = {
    email,
    username: username || email,
    password,
    user: res.user,
  };
  persistAuth(authState);
  return res;
}

export async function fetchDashboard(): Promise<DashboardResponse> {
  return request("/api/dashboard/");
}

export async function fetchFeatureIndex(): Promise<FeatureIndexItem[]> {
  const res = await request<{ features: FeatureIndexItem[] }>("/api/features/");
  return res.features;
}

export async function postFeatureData(path: string, payload: Record<string, any>) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function pingApi() {
  // Hitting the API root is unauthenticated and confirms connectivity.
  return request<{ message: string }>("/", undefined, { skipAuth: true });
}

// Convenience helpers for common feature posts
export const apiActions = {
  createAsoApp: (payload: Record<string, any>) => postFeatureData("/api/aso/apps/", payload),
  createMarketplaceProduct: (payload: Record<string, any>) =>
    postFeatureData("/api/marketplace/products/", payload),
  createSeoDirectory: (payload: Record<string, any>) => postFeatureData("/api/seo/directories/", payload),
  createSeoBacklink: (payload: Record<string, any>) => postFeatureData("/api/seo/backlinks/", payload),
  createSeoKeywordCluster: (payload: Record<string, any>) => postFeatureData("/api/seo/keywords/", payload),
  createSeoContentItem: (payload: Record<string, any>) => postFeatureData("/api/seo/content/", payload),
  createSeoFaq: (payload: Record<string, any>) => postFeatureData("/api/seo/faqs/", payload),
  createSocialPost: (payload: Record<string, any>) => postFeatureData("/api/social/posts/", payload),
  createEmailList: (payload: Record<string, any>) => postFeatureData("/api/email/lists/", payload),
  createEmailTemplate: (payload: Record<string, any>) => postFeatureData("/api/email/templates/", payload),
  createEmailFlow: (payload: Record<string, any>) => postFeatureData("/api/email/flows/", payload),
  createEmailContact: (payload: Record<string, any>) => postFeatureData("/api/email/contacts/", payload),
};
