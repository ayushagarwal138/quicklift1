import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChevronDown, User, Settings, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

const DriverHeader = () => {
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/driver/dashboard', label: 'Dashboard' },
    { to: '/driver/pending-requests', label: 'Requests' },
    { to: '/driver/history', label: 'History' },
    { to: '/driver/earnings', label: 'Earnings' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface-900/90 backdrop-blur-xl border-b border-surface-700/40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/driver/dashboard" className="flex items-center gap-2 group">
              <img
                src="/QuickLift_logo(1).png"
                alt="QuickLift"
                className="w-9 h-9 rounded-lg transition-transform duration-200 group-hover:scale-105"
              />
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-xl font-bold text-white">
                  Quick<span className="text-brand-400">Lift</span>
                </span>
                <span className="text-xs font-medium text-brand-400 bg-brand-900/40 px-2 py-0.5 rounded-full">
                  Driver
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {user && user.roles?.includes('DRIVER') && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(link.to)
                        ? 'text-brand-400 bg-brand-500/10'
                        : 'text-surface-400 hover:text-white hover:bg-surface-800'
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

              {user && (
                <>
                  <NotificationBell dark />

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-800 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-brand-900/40 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-brand-400" />
                      </div>
                      <span className="hidden md:block text-sm font-medium text-surface-300 max-w-[120px] truncate">
                        {user?.username || user?.name || 'Driver'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-surface-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-surface-800 rounded-2xl shadow-elevated border border-surface-700/50 py-2 z-50 animate-scale-in">
                        <div className="px-4 py-3 border-b border-surface-700/50">
                          <p className="text-sm font-semibold text-white">{user?.username || user?.name || 'Driver'}</p>
                          <p className="text-xs text-surface-400 mt-0.5">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:bg-surface-700/50 transition-colors duration-150"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <User className="w-4 h-4" /> Profile
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:bg-surface-700/50 transition-colors duration-150"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <Settings className="w-4 h-4" /> Settings
                          </Link>
                        </div>
                        <div className="border-t border-surface-700/50 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-colors duration-150"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    className="md:hidden btn-icon text-surface-400 hover:text-white hover:bg-surface-800"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {user && isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fade-in" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 z-50 md:hidden bg-surface-900 border-b border-surface-700 shadow-elevated animate-fade-in-down">
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    isActive(link.to)
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-surface-300 hover:bg-surface-800'
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

export default DriverHeader;
