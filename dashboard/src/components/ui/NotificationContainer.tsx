import React from 'react';
import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

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

interface NotificationContainerProps {
    notifications: Notification[];
    onRemove: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
    notifications,
    onRemove
}) => {
    if (notifications.length === 0) return null;

    const getNotificationIcon = (type: 'success' | 'error' | 'info' | 'warning') => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-400" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-400" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            default:
                return null;
        }
    };

    const getNotificationStyles = (type: 'success' | 'error' | 'info' | 'warning') => {
        switch (type) {
            case 'success':
                return 'bg-green-900/90 border-green-700 text-green-100';
            case 'error':
                return 'bg-red-900/90 border-red-700 text-red-100';
            case 'info':
                return 'bg-blue-900/90 border-blue-700 text-blue-100';
            case 'warning':
                return 'bg-yellow-900/90 border-yellow-700 text-yellow-100';
            default:
                return 'bg-gray-900/90 border-gray-700 text-gray-100';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`
            flex items-center gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg
            transition-all duration-300 ease-in-out transform
            ${getNotificationStyles(notification.type)}
          `}
                >
                    {getNotificationIcon(notification.type)}
                    <span className="flex-1 text-sm font-medium">
                        {notification.message}
                    </span>
                    {notification.action && (
                        <button
                            onClick={() => {
                                notification.action?.onClick();
                                onRemove(notification.id);
                            }}
                            className="ml-2 px-3 py-1 rounded bg-white/10 text-xs font-semibold hover:bg-white/20 transition-colors"
                        >
                            {notification.action.label}
                        </button>
                    )}
                    <button
                        onClick={() => onRemove(notification.id)}
                        className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Dismiss notification"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};