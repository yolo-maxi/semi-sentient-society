"use client";

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { MOCK_NOTIFICATIONS, type AppNotification } from "@/data/mock-notifications";

const STORAGE_KEY = "sss-notifications-read-state";

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

function sortNotifications(notifications: AppNotification[]) {
  return [...notifications].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

function mergeStoredReadState(notifications: AppNotification[]) {
  if (typeof window === "undefined") {
    return sortNotifications(notifications);
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return sortNotifications(notifications);
    }

    const parsed = JSON.parse(storedValue) as Record<string, boolean>;

    return sortNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: parsed[notification.id] ?? notification.read,
      }))
    );
  } catch {
    return sortNotifications(notifications);
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => sortNotifications(MOCK_NOTIFICATIONS));

  useEffect(() => {
    setNotifications(mergeStoredReadState(MOCK_NOTIFICATIONS));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const readState = Object.fromEntries(
      notifications.map((notification) => [notification.id, notification.read])
    );

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(readState));
  }, [notifications]);

  const value = useMemo<NotificationContextValue>(() => {
    const unreadCount = notifications.filter((notification) => !notification.read).length;

    return {
      notifications,
      unreadCount,
      markRead: (id: string) => {
        setNotifications((current) =>
          current.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      },
      markAllRead: () => {
        setNotifications((current) =>
          current.map((notification) => (notification.read ? notification : { ...notification, read: true }))
        );
      },
    };
  }, [notifications]);

  return createElement(NotificationContext.Provider, { value }, children);
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }

  return context;
}
