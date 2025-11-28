
import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { fetchProfile } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Optimisation', href: '/optimisation' },
  { name: 'Growth', href: '/growth' },
  { name: 'Reach', href: '/reach' },
];

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [initials, setInitials] = useState('JD');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    let mounted = true;
    fetchProfile()
      .then((data: any) => {
        if (!mounted) return;
        const f = data.first_name || data.username || data.email || '';
        const l = data.last_name || '';
        setInitials(`${(f || '?')[0] || ''}${(l || '')[0] || ''}`.toUpperCase() || 'U');
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <motion.nav 
          {...({
            initial: { y: -100, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            transition: { duration: 0.5 }
          } as any)}
          className={`
            relative w-[95%] lg:w-[90%] rounded-full px-6 py-3
            flex items-center justify-between
            transition-all duration-300
            border border-icy-main/10
            ${isScrolled || isMobileMenuOpen 
              ? 'shadow-lg backdrop-blur-xl bg-[#002466]/60' 
              : 'backdrop-blur-md bg-[#002466]/30'
            }
          `}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo className="h-8 w-10" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                className={`text-sm font-medium hover:text-icy-main transition-colors duration-200 ${location.pathname === link.href ? 'text-icy-main' : ''}`}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
               <Link 
                to="/dashboard"
                className={`text-sm font-medium hover:text-icy-main transition-colors duration-200 flex items-center gap-1 ${location.pathname === '/dashboard' ? 'text-icy-main' : ''}`}
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
               <div className="flex items-center gap-3">
                  <Link to="/profile" className="w-8 h-8 rounded-full bg-icy-main text-white flex items-center justify-center font-bold text-xs cursor-pointer">
                    {initials}
                  </Link>
                  <button 
                    onClick={handleLogoutClick}
                    className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
                    title="Log Out"
                  >
                    <LogOut size={18} />
                  </button>
               </div>
            ) : (
              <>
                <Link 
                  to="/auth" 
                  className="px-5 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-sm font-semibold transition-all backdrop-blur-sm shadow-sm"
                >
                  Log In
                </Link>
                <Link to="/auth?mode=signup" className="bg-white text-icy-dark px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-100 hover:scale-105 transition-all shadow-md shadow-white/10">
                  Start Growth
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            {...({
                initial: { opacity: 0, x: '100%' },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: '100%' },
                transition: { type: "spring", stiffness: 300, damping: 30 }
            } as any)}
            className="fixed inset-0 z-[60] bg-icy-dark p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <Logo className="h-8 w-10" />
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-6 text-xl font-medium text-white">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="border-b border-white/10 pb-4"
                >
                  {link.name}
                </Link>
              ))}
               {isAuthenticated && (
                  <Link 
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="border-b border-white/10 pb-4 flex items-center gap-2 text-icy-main"
                  >
                    <LayoutDashboard size={20} /> Dashboard
                  </Link>
              )}

              {isAuthenticated ? (
                 <button 
                    onClick={handleLogoutClick}
                    className="text-left border-b border-white/10 pb-4 text-red-500 flex items-center gap-2"
                  >
                    <LogOut size={20} /> Log Out
                  </button>
              ) : (
                <>
                  {/* DISTINCTIVE MOBILE LOGIN BUTTON */}
                  <Link 
                    to="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="border border-white/20 bg-white/5 rounded-xl px-4 py-3 mt-4 text-center font-semibold hover:bg-white/10 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link to="/auth?mode=signup" onClick={() => setIsMobileMenuOpen(false)} className="bg-icy-main text-white py-4 rounded-xl font-bold shadow-lg shadow-icy-main/30 text-center">
                    Start Growth
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
