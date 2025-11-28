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
export const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") || defaultBase;

const buildBasicToken = (email: string, password: string) => {
  const encoded = btoa(`${email}:${password}`);
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
  return buildBasicToken(auth.email, auth.password);
};

type RequestOptions = {
  skipAuth?: boolean;
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

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...init,
    headers,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const errorData = await res.json();
      detail =
        (errorData && (errorData.detail || errorData.error || JSON.stringify(errorData))) || detail;
    } catch {
      const text = await res.text();
      if (text) detail = text;
    }
    throw new Error(detail);
  }

  if (res.status === 204) {
    return null as unknown as T;
  }

  return (await res.json()) as T;
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
  return request(
    "/api/auth/signup",
    {
      method: "POST",
      body: JSON.stringify({ email, username, password, password_confirm }),
    },
    { skipAuth: true }
  );
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
