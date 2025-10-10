import React, { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { NotificationContainer } from '../components/ui/NotificationContainer';

interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (type: Notification['type'], message: string, duration?: number, action?: Notification['action']) => string;
    removeNotification: (id: string) => void;
    success: (message: string, duration?: number, action?: Notification['action']) => string;
    error: (message: string, duration?: number, action?: Notification['action']) => string;
    info: (message: string, duration?: number, action?: Notification['action']) => string;
    warning: (message: string, duration?: number, action?: Notification['action']) => string;
    clearAll: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export type { NotificationContextType };

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback(
        (type: Notification['type'], message: string, duration = 5000, action?: Notification['action']) => {
            const id = Math.random().toString(36).substr(2, 9);
            const notification: Notification = { id, type, message, duration, action };

            setNotifications((prev) => [...prev, notification]);

            if (duration > 0) {
                setTimeout(() => {
                    setNotifications((prev) => prev.filter((n) => n.id !== id));
                }, duration);
            }

            return id;
        },
        []
    );

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const success = useCallback(
        (message: string, duration?: number, action?: Notification['action']) =>
            addNotification('success', message, duration, action),
        [addNotification]
    );

    const error = useCallback(
        (message: string, duration?: number, action?: Notification['action']) =>
            addNotification('error', message, duration, action),
        [addNotification]
    );

    const info = useCallback(
        (message: string, duration?: number, action?: Notification['action']) =>
            addNotification('info', message, duration, action),
        [addNotification]
    );

    const warning = useCallback(
        (message: string, duration?: number, action?: Notification['action']) =>
            addNotification('warning', message, duration, action),
        [addNotification]
    );

    const value: NotificationContextType = {
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        info,
        warning,
        clearAll,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer
                notifications={notifications}
                onRemove={removeNotification}
            />
        </NotificationContext.Provider>
    );
};