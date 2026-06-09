import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Settings, Bell, ChevronDown, LogIn, UserPlus, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const UserHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = user ? [
    { to: '/user/dashboard', label: 'Home' },
    { to: '/book', label: 'Book Ride' },
    { to: '/history', label: 'Trip History' },
  ] : [];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200/60 dark:border-surface-700/40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={user ? '/user/dashboard' : '/'} className="flex items-center gap-2 group">
              <img
                src="/QuickLift_logo(1).png"
                alt="QuickLift"
                className="w-9 h-9 rounded-lg transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-xl font-bold text-surface-900 dark:text-white hidden sm:block">
                Quick<span className="text-brand-600 dark:text-brand-400">Lift</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            {user && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(link.to)
                        ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20'
                        : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {user ? (
                <>
                  {/* Notifications */}
                  <button className="btn-icon relative text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-surface-900"></span>
                  </button>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/40 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      <span className="hidden md:block text-sm font-medium text-surface-700 dark:text-surface-300 max-w-[120px] truncate">
                        {user?.username || user?.name || 'User'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 glass-card py-2 z-50 animate-scale-in border border-surface-200/60 dark:border-surface-700/40 shadow-elevated">
                        <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-700/50">
                          <p className="text-sm font-semibold text-surface-900 dark:text-white">{user?.username || user?.name || 'User'}</p>
                          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors duration-150"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <User className="w-4 h-4" /> Profile
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors duration-150"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <Settings className="w-4 h-4" /> Settings
                          </Link>
                        </div>
                        <div className="border-t border-surface-100 dark:border-surface-700/50 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    className="md:hidden btn-icon text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn-ghost text-sm">
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                  <Link to="/register" className="btn-primary btn-sm">
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {user && isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 md:hidden animate-fade-in" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 z-50 md:hidden bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 shadow-elevated animate-fade-in-down">
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    isActive(link.to)
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20'
                      : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default UserHeader;