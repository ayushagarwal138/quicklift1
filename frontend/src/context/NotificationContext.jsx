import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import { notificationsAPI } from '../api/notifications';
import { getAuthenticatedWsUrl, getStompConnectHeaders } from '../api/ws';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const clientRef = useRef(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    setLoading(true);
    try {
      const [items, unread] = await Promise.all([
        notificationsAPI.list(),
        notificationsAPI.unreadCount(),
      ]);
      setNotifications(items);
      setUnreadCount(unread.count || 0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!user) return undefined;
    const client = new Client({
      webSocketFactory: () => new SockJS(getAuthenticatedWsUrl()),
      connectHeaders: getStompConnectHeaders(),
      reconnectDelay: 5000,
      debug: () => {},
    });
    client.onConnect = () => {
      client.subscribe(`/topic/user/${user.id}/notifications`, (message) => {
        try {
          const notification = JSON.parse(message.body);
          setNotifications((current) => [notification, ...current.filter((item) => item.id !== notification.id)]);
          setUnreadCount((count) => count + (notification.read ? 0 : 1));
        } catch {
          refresh();
        }
      });
    };
    client.activate();
    clientRef.current = client;
    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [user, refresh]);

  const markRead = useCallback(async (notification) => {
    if (!notification?.id) return notification;
    const updated = notification.read ? notification : await notificationsAPI.markRead(notification.id);
    setNotifications((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    if (!notification.read) {
      setUnreadCount((count) => Math.max(0, count - 1));
    }
    return updated;
  }, []);

  const markAllRead = useCallback(async () => {
    await notificationsAPI.markAllRead();
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
  }, []);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    loading,
    refresh,
    markRead,
    markAllRead,
  }), [notifications, unreadCount, loading, refresh, markRead, markAllRead]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
