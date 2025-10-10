import React from 'react';
import { X, CheckCircle, XCircle, Info } from 'lucide-react';

interface NotificationProps {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    onClose: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationProps> = ({ id, type, message, onClose }) => {
    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    const getColorClasses = () => {
        switch (type) {
            case 'success': return 'bg-green-900 border-green-700 text-green-100';
            case 'error': return 'bg-red-900 border-red-700 text-red-100';
            default: return 'bg-blue-900 border-blue-700 text-blue-100';
        }
    };

    return (
        <div className={`flex items-center p-4 mb-3 rounded-lg border ${getColorClasses()}`}>
            {getIcon()}
            <span className="ml-3 flex-1">{message}</span>
            <button
                onClick={() => onClose(id)}
                className="ml-3 text-gray-400 hover:text-white"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

interface NotificationContainerProps {
    notifications: Array<{
        id: string;
        type: 'success' | 'error' | 'info';
        message: string;
    }>;
    onClose: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
    notifications,
    onClose
}) => {
    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 w-96">
            {notifications.map(notification => (
                <NotificationItem
                    key={notification.id}
                    {...notification}
                    onClose={onClose}
                />
            ))}
        </div>
    );
};