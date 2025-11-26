import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, Sun, Moon, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

interface NavbarProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Pricing', href: '/pricing' },
];

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { authHeader, user, setAuthHeader } = useAuth();

  const initials = React.useMemo(() => {
    const name = user?.username || user?.email || '';
    if (!name) return '';
    const parts = name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(Boolean);
    if (parts.length === 0) return name.slice(0, 2).toUpperCase();
    const first = parts[0]?.[0] || '';
    const second = parts[1]?.[0] || '';
    return (first + second).toUpperCase();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`
            relative w-[95%] lg:w-[80%] rounded-full px-6 py-3
            flex items-center justify-between
            transition-all duration-300
            ${isScrolled || isMobileMenuOpen ? 'shadow-lg glass-nav' : 'bg-transparent'}
            border border-transparent
            ${isScrolled && 'border-white/10'}
          `}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo className="h-8 w-10" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                className={`text-sm font-medium hover:text-icy-main transition-colors duration-200 ${location.pathname === link.href ? 'text-icy-main' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {authHeader ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 group">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-icy-main/15 text-icy-dark dark:text-white dark:bg-white/10 flex items-center justify-center text-xs font-bold">
                      {initials || <UserIcon size={18} />}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-icy-main transition-colors">
                    Profile
                  </span>
                </Link>
                <button
                  onClick={() => setAuthHeader(null)}
                  className="text-sm font-semibold hover:text-icy-main transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <Link to="/auth" className="text-sm font-semibold hover:text-icy-main transition-colors">
                  Log In
                </Link>
                <Link to="/auth?mode=signup" className="bg-icy-dark text-white dark:bg-white dark:text-icy-dark px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform">
                  Start Growth
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-4">
             <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
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
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-icy-dark p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <Logo className="h-8 w-10" />
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-6 text-xl font-medium">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="border-b border-gray-100 dark:border-white/10 pb-4"
                >
                  {link.name}
                </Link>
              ))}
              {authHeader ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-icy-main/15 text-icy-dark dark:text-white dark:bg-white/10 flex items-center justify-center text-sm font-bold">
                        {initials || <UserIcon size={18} />}
                      </div>
                    )}
                    <span className="text-base font-semibold">Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setAuthHeader(null);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-base font-semibold hover:text-icy-main transition-colors text-left"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="border-b border-gray-100 dark:border-white/10 pb-4"
                  >
                    Log In
                  </Link>
                  <Link to="/auth?mode=signup" onClick={() => setIsMobileMenuOpen(false)} className="bg-icy-main text-white py-4 rounded-xl mt-4 font-bold shadow-lg shadow-icy-main/30 text-center">
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
