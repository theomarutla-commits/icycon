import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchFeatures } from './api';

type AuthState = {
  authHeader: string | null;
  features: any[] | null;
  setAuthHeader: (header: string | null) => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authHeader, setAuthHeaderState] = useState<string | null>(null);
  const [features, setFeatures] = useState<any[] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('authHeader');
    if (saved) {
      setAuthHeaderState(saved);
      fetchFeatures(saved).then((data) => setFeatures(data.features || [])).catch(() => undefined);
    }
  }, []);

  const setAuthHeader = (header: string | null) => {
    setAuthHeaderState(header);
    if (header) {
      localStorage.setItem('authHeader', header);
      fetchFeatures(header).then((data) => setFeatures(data.features || [])).catch(() => undefined);
    } else {
      localStorage.removeItem('authHeader');
      setFeatures(null);
    }
  };

  return (
    <AuthContext.Provider value={{ authHeader, features, setAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
