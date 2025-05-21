
'use client';

import type { NotificationMessage } from '@/lib/types';
import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

const NOTIFICATIONS_STORAGE_KEY = 'taskflow-notifications';

interface NotificationContextState {
  notifications: NotificationMessage[];
  isLoading: boolean;
  addNotification: (message: string, type?: NotificationMessage['type']) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
}

const NotificationsContext = createContext<NotificationContextState | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    try {
      const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error("Failed to load notifications from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage when notifications change (and not loading)
    if (!isLoading) {
      try {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
      } catch (error) {
        console.error("Failed to save notifications to localStorage", error);
      }
    }
  }, [notifications, isLoading]);

  const addNotification = useCallback((message: string, type: NotificationMessage['type'] = 'info') => {
    const newNotification: NotificationMessage = {
      id: uuidv4(),
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep max 20 notifications
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAllNotifications,
    unreadCount,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

// Custom hook to use the context, ensuring it's used within a provider
export function useNotificationsContext() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  }
  return context;
}
