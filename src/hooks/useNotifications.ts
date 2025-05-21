
"use client";

import { useNotificationsContext } from '@/context/NotificationsContext';

/**
 * Hook to access notification state and actions.
 * Must be used within a component tree wrapped by NotificationsProvider.
 */
export function useNotifications() {
  // All the logic is now in NotificationsProvider and accessed via context.
  // This hook simply returns the context value.
  return useNotificationsContext();
}
