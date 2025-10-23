import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../types/routes';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiresAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiresAuth = true
}) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    if (requiresAuth && (!isAuthenticated || !user || user.role !== 'ADMIN')) {
        // Redirect to login page with return url
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    if (!requiresAuth && isAuthenticated && user && user.role === 'ADMIN') {
        // Redirect authenticated ADMIN users away from login page
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
