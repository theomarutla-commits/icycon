import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { login, signup } from '../lib/api';

type Props = {
  onLogin: () => void;
};

type Mode = 'login' | 'signup';

const AuthPage: React.FC<Props> = ({ onLogin }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<Mode>(searchParams.get('mode') === 'signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isSignup = searchParams.get('mode') === 'signup';
    setMode(isSignup ? 'signup' : 'login');
  }, [searchParams]);

  const toggleMode = (nextMode: Mode) => {
    setMode(nextMode);
    setSearchParams(nextMode === 'signup' ? { mode: 'signup' } : {});
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup({
          email,
          username: username || email.split('@')[0],
          password,
          password_confirm: password,
          phone_number: phone,
        });
      }
      onLogin();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-icy-dark text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-icy-main/10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => toggleMode('login')}
              className={`px-3 py-1 rounded-lg ${mode === 'login' ? 'bg-icy-main text-white' : 'bg-white/10 text-gray-200'}`}
            >
              Login
            </button>
            <button
              onClick={() => toggleMode('signup')}
              className={`px-3 py-1 rounded-lg ${mode === 'signup' ? 'bg-icy-main text-white' : 'bg-white/10 text-gray-200'}`}
            >
              Signup
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none focus:border-icy-main"
              placeholder="you@example.com"
            />
          </div>
          {mode === 'signup' && (
            <div>
              <label className="text-sm text-gray-300">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none focus:border-icy-main"
                placeholder="Optional (defaults to email prefix)"
              />
            </div>
          )}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none focus:border-icy-main"
              placeholder="••••••••"
            />
          </div>
          {mode === 'signup' && (
            <div>
              <label className="text-sm text-gray-300">Phone (optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none focus:border-icy-main"
                placeholder="+15551234567"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-icy-main text-white font-semibold hover:bg-blue-600 transition disabled:opacity-70"
          >
            {loading ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
          <p className="text-xs text-gray-400 text-center">
            Auth is Basic-auth based; we keep credentials locally to call the API.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
