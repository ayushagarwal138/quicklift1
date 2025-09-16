import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const formatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
};

const NotificationBell = ({ dark = false }) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    const updated = await markRead(notification);
    setOpen(false);
    if (updated?.targetUrl) {
      navigate(updated.targetUrl);
    }
  };

  const buttonClass = dark
    ? 'btn-icon relative text-surface-400 hover:text-white hover:bg-surface-800'
    : 'btn-icon relative text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800';

  return (
    <div className="relative" ref={ref}>
      <button className={buttonClass} onClick={() => setOpen((value) => !value)} aria-label="Notifications">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-[18px] text-center ring-2 ring-white dark:ring-surface-900">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 w-[calc(100vw-1rem)] max-w-[26rem] max-h-[70vh] rounded-2xl border shadow-elevated z-[70] animate-scale-in overflow-hidden sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:translate-x-0 sm:w-[min(22rem,calc(100vw-2rem))] sm:max-h-none ${
          dark
            ? 'bg-surface-800 border-surface-700/50'
            : 'bg-white dark:bg-surface-800 border-surface-200/60 dark:border-surface-700/50'
        }`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100 dark:border-surface-700/50">
            <div>
              <p className="text-sm font-semibold text-surface-900 dark:text-white">Notifications</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">{unreadCount} unread</p>
            </div>
            <button
              className="btn-ghost btn-sm text-xs"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Read all</span>
            </button>
          </div>

          <div className="max-h-[calc(70vh-4rem)] sm:max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-4 space-y-2">
                <div className="skeleton h-12 rounded-xl" />
                <div className="skeleton h-12 rounded-xl" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 mx-auto text-surface-300 dark:text-surface-600 mb-2" />
                <p className="text-sm text-surface-500 dark:text-surface-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left px-4 py-3 border-b border-surface-100 dark:border-surface-700/50 last:border-0 transition-colors ${
                    notification.read
                      ? 'hover:bg-surface-50 dark:hover:bg-surface-700/50'
                      : 'bg-brand-50/70 dark:bg-brand-900/20 hover:bg-brand-50 dark:hover:bg-brand-900/30'
                  }`}
                >
                  <div className="flex gap-3">
                    <span className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${notification.read ? 'bg-surface-300 dark:bg-surface-600' : 'bg-brand-500'}`} />
                    <span className="min-w-0">
                      <span className="block text-sm sm:text-sm font-semibold text-surface-900 dark:text-white truncate">
                        {notification.title}
                      </span>
                      <span className="block text-[13px] sm:text-xs text-surface-600 dark:text-surface-300 line-clamp-2 mt-0.5">
                        {notification.message}
                      </span>
                      <span className="block text-[11px] text-surface-400 dark:text-surface-500 mt-1">
                        {formatTime(notification.createdAt)}
                      </span>
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
