import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchFeatures, fetchProfile } from './api';

type AuthState = {
  authHeader: string | null;
  user: {
    id?: number;
    email?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string | null;
  } | null;
  features: any[] | null;
  setAuthHeader: (header: string | null, user?: AuthState['user']) => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authHeader, setAuthHeaderState] = useState<string | null>(null);
  const [user, setUser] = useState<AuthState['user']>(null);
  const [features, setFeatures] = useState<any[] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('authHeader');
    const savedUser = localStorage.getItem('user');
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    if (saved) {
      setAuthHeaderState(saved);
      setUser(parsedUser);
      fetchFeatures(saved).then((data) => setFeatures(data.features || [])).catch(() => undefined);
      fetchProfile(saved)
        .then((data) => {
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        })
        .catch(() => undefined);
    }
  }, []);

  const setAuthHeader = (header: string | null, nextUser?: AuthState['user']) => {
    setAuthHeaderState(header);
    if (header) {
      localStorage.setItem('authHeader', header);
      if (nextUser) {
        setUser(nextUser);
        localStorage.setItem('user', JSON.stringify(nextUser));
      }
      fetchFeatures(header).then((data) => setFeatures(data.features || [])).catch(() => undefined);
    } else {
      localStorage.removeItem('authHeader');
      localStorage.removeItem('user');
      setFeatures(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ authHeader, user, features, setAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
