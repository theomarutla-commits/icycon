
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import PricingPage from './pages/PricingPage';
import AuthPage from './pages/AuthPage';
import SEOPage from './pages/SEOPage';
import EmailPage from './pages/EmailPage';
import SocialPage from './pages/SocialPage';
import Dashboard from './pages/Dashboard';
import DataLab from './pages/DataLab';
import Footer from './components/Footer';
import { UserProfile, getStoredAuth, clearStoredAuth, fetchDashboard, pingApi, API_BASE } from './lib/api';

// Component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [apiStatus, setApiStatus] = useState<{ ok: boolean; message?: string } | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Validate stored credentials against the backend; fallback to logged out on failure.
  useEffect(() => {
    const saved = getStoredAuth();
    if (!saved) return;
    fetchDashboard()
      .then((res) => {
        setIsAuthenticated(true);
        setUser(res.user);
      })
      .catch(() => {
        clearStoredAuth();
        setIsAuthenticated(false);
        setUser(null);
      });
  }, []);

  // Probe the backend to confirm connectivity for this frontend build
  useEffect(() => {
    pingApi()
      .then((res) => setApiStatus({ ok: true, message: res.message }))
      .catch((err) => setApiStatus({ ok: false, message: err?.message || 'Unreachable' }));
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = (profile: UserProfile) => {
    setIsAuthenticated(true);
    setUser(profile);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    clearStoredAuth();
  };

  return (
    <Router>
      <ScrollToTop />
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-icy-dark text-white' : 'bg-slate-50 text-icy-dark'}`}>
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
          {/* Abstract Background Noise/Gradient */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-icy-main rounded-full blur-[120px] opacity-20 dark:opacity-10 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-icy-deep rounded-full blur-[120px] opacity-20 dark:opacity-10" />
        </div>

        <Navbar 
          darkMode={darkMode} 
          toggleTheme={toggleTheme} 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout}
        />
        {apiStatus && (
          <div className={`mx-auto mt-2 w-[95%] lg:w-[90%] text-xs px-3 py-2 rounded-xl ${apiStatus.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} border border-black/5`}>
            API: {apiStatus.ok ? 'reachable' : 'unreachable'} ({API_BASE || window.location.origin}) {apiStatus.message ? `– ${apiStatus.message}` : ''}
          </div>
        )}
        
        <main className="relative z-10 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/seo" element={<SEOPage />} />
            <Route path="/email" element={<EmailPage />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" replace />} 
            />
            <Route path="/data" element={isAuthenticated ? <DataLab /> : <Navigate to="/auth" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
