import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PricingPage from './pages/PricingPage';
import AuthPage from './pages/AuthPage';
import OptimisationPage from './pages/OptimisationPage';
import ReachPage from './pages/ReachPage';
import GrowthPage from './pages/GrowthPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import FeatureInputPage from './pages/FeatureInputPage';
import SEODataPage from './pages/SEODataPage';
import AeoDataPage from './pages/AeoDataPage';
import LeadCapturePage from './pages/LeadCapturePage';
import Footer from './components/Footer';
import { getStoredAuth, clearStoredAuth, fetchProfile } from './lib/api';

// Component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  // Hardcoded dark mode behavior
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    // Enforce dark mode class
    document.documentElement.classList.add('dark');
  }, []);

  // Validate stored auth on mount; if it fails, clear it so /auth stays accessible
  useEffect(() => {
    let mounted = true;
    const stored = getStoredAuth();
    if (!stored) {
      setAuthChecked(true);
      return () => {};
    }
    fetchProfile()
      .then(() => {
        if (!mounted) return;
        setIsAuthenticated(true);
        setAuthChecked(true);
      })
      .catch(() => {
        if (!mounted) return;
        clearStoredAuth();
        setIsAuthenticated(false);
        setAuthChecked(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    clearStoredAuth();
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col transition-colors duration-300 bg-icy-dark text-white">
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
          {/* Abstract Background Noise/Gradient */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-icy-main rounded-full blur-[120px] opacity-10 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-icy-deep rounded-full blur-[120px] opacity-10" />
        </div>

        <Navbar 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout}
        />
        
        <main className="relative z-10 flex-grow">
          {!authChecked ? (
            <div className="flex items-center justify-center py-24 text-gray-300 text-sm">Checking session…</div>
          ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/optimisation" element={<OptimisationPage />} />
            <Route path="/reach" element={<ReachPage />} />
            <Route path="/growth" element={<GrowthPage />} />
            <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <AuthPage onLogin={handleLogin} />} />
            <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <AuthPage onLogin={handleLogin} />} />
            <Route path="/leads" element={<LeadCapturePage />} />
            <Route path="/data-entry" element={isAuthenticated ? <FeatureInputPage /> : <AuthPage onLogin={handleLogin} />} />
            <Route path="/seo/data" element={isAuthenticated ? <SEODataPage /> : <AuthPage onLogin={handleLogin} />} />
            <Route path="/aeo/data" element={isAuthenticated ? <AeoDataPage /> : <AuthPage onLogin={handleLogin} />} />
          </Routes>
          )}
        </main>

        <Footer />
      </div>
    </Router>
  );
}
