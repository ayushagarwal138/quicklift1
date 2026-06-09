import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ variant = 'button', className = '' }) => {
  const { theme, toggleTheme, systemTheme, isDark } = useTheme();

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`relative p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ${className}`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    );
  }

  if (variant === 'select') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={() => toggleTheme()}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors duration-200"
        >
          {theme === 'light' && <Sun className="w-4 h-4" />}
          {theme === 'dark' && <Moon className="w-4 h-4" />}
          {theme === 'system' && <Monitor className="w-4 h-4" />}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {theme === 'light' && 'Light'}
            {theme === 'dark' && 'Dark'}
            {theme === 'system' && `System (${systemTheme})`}
          </span>
        </button>
      </div>
    );
  }

  return null;
};

export default ThemeToggle; 