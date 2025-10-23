import React, { useEffect } from 'react';
import { useNotifications } from '../../hooks/useGlobalNotifications';
import { apiWithNotifications } from '../../services/apiWithNotifications';

/**
 * Component to initialize the API notification system with the global notification context
 * This ensures all API calls with notifications can access the notification functions
 */
export const NotificationInitializer: React.FC = () => {
    const { success, error, info, warning } = useNotifications();

    useEffect(() => {
        // Initialize the API service with notification callbacks
        apiWithNotifications.setNotifications({
            success,
            error,
            info,
            warning,
        });
    }, [success, error, info, warning]);

    return null; // This component doesn't render anything
};