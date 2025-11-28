
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
import Footer from './components/Footer';
import { UserProfile, getStoredAuth, clearStoredAuth } from './lib/api';

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

  useEffect(() => {
    const saved = getStoredAuth();
    if (saved) {
      setIsAuthenticated(true);
      setUser(saved.user);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
          user={user}
          onLogout={handleLogout}
        />
        
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
              element={
                isAuthenticated 
                  ? <Dashboard user={user} /> 
                  : <Navigate to="/auth" replace />
              } 
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
