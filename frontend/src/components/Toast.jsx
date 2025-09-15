import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setIsVisible(true));

    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(), 200);
  };

  const iconMap = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const styleMap = {
    success: {
      container: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50',
      icon: 'text-emerald-600 dark:text-emerald-400',
      text: 'text-emerald-800 dark:text-emerald-200',
      progress: 'bg-emerald-500',
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800/50',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-800 dark:text-red-200',
      progress: 'bg-red-500',
    },
    warning: {
      container: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/50',
      icon: 'text-amber-600 dark:text-amber-400',
      text: 'text-amber-800 dark:text-amber-200',
      progress: 'bg-amber-500',
    },
    info: {
      container: 'bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800/50',
      icon: 'text-brand-600 dark:text-brand-400',
      text: 'text-brand-800 dark:text-brand-200',
      progress: 'bg-brand-500',
    },
  };

  const styles = styleMap[type] || styleMap.info;

  return (
    <div
      className={`fixed top-4 right-4 z-[100] max-w-sm w-full transition-all duration-300 ease-out ${
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100'
          : 'translate-x-8 opacity-0'
      }`}
    >
      <div className={`rounded-2xl border shadow-elevated backdrop-blur-sm overflow-hidden ${styles.container}`}>
        <div className="flex items-start gap-3 p-4">
          <div className={`flex-shrink-0 mt-0.5 ${styles.icon}`}>
            {iconMap[type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
          </div>
          <button
            onClick={handleClose}
            className={`flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${styles.icon}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Progress bar */}
        {duration > 0 && (
          <div className="h-0.5 w-full bg-black/5 dark:bg-white/5">
            <div
              className={`h-full ${styles.progress} opacity-60`}
              style={{
                animation: `progress ${duration}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;