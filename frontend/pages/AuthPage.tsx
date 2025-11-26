import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../components/Logo';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login, signup, fetchFeatures } from '../lib/api';
import { useAuth } from '../lib/AuthContext';

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAuthHeader } = useAuth();

  const toggleMode = () => setIsLogin(!isLogin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (isLogin) {
        const res = await login(email, password);
        setAuthHeader(res.authHeader, res.user || { email, username: res?.user?.username });
        setSuccess('Logged in! Loading your features...');
        // warm up features
        await fetchFeatures(res.authHeader).catch(() => undefined);
      } else {
        const derivedUsername = username || email.split('@')[0];
        const res = await signup(email, password, derivedUsername);
        setAuthHeader(res.authHeader, { email, username: derivedUsername });
        setSuccess('Account created! You are logged in.');
      }
      setTimeout(() => navigate('/'), 600);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-slate-50 dark:bg-icy-dark relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-icy-main/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-icy-deep/20 rounded-full blur-[100px]" />
        </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-[#001c4d] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
                <Logo className="h-10 w-12" />
            </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            {isLogin ? 'Enter your details to access your dashboard.' : 'Start your 14-day free trial today.'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                    <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main transition-colors"
                        placeholder="John"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                    <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main transition-colors"
                        placeholder="Doe"
                    />
                </div>
            </div>
          )}
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main transition-colors"
                placeholder="your-username"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main transition-colors"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-icy-main transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-emerald-500">{success}</p>}

          <button 
            className="w-full bg-icy-main text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-icy-main/25 mt-6 disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Working...' : isLogin ? 'Sign In' : 'Get Started'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleMode} className="text-icy-main font-semibold hover:underline">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
