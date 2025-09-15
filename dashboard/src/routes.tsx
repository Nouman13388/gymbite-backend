import type { RouteObject } from 'react-router-dom';
import AdminLogin from "./pages/auth/AdminLogin.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Layout from "./components/layout/Layout.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROUTES } from "./types/routes";

// Route configuration with proper typing
export const routes: RouteObject[] = [
    {
        path: ROUTES.LOGIN,
        element: (
            <ProtectedRoute requiresAuth={false}>
                <AdminLogin />
            </ProtectedRoute>
        ),
    },
    {
        path: "/",
        element: (
            <ProtectedRoute requiresAuth={true}>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: ROUTES.DASHBOARD.substring(1), // Remove leading slash for nested routes
                element: <Dashboard />,
            },
            // Future routes can be added here
            // {
            //   path: ROUTES.USERS.substring(1),
            //   element: <Users />,
            // },
            // {
            //   path: ROUTES.WORKOUTS.substring(1),
            //   element: <Workouts />,
            // },
            // {
            //   path: ROUTES.MEALPLANS.substring(1),
            //   element: <MealPlans />,
            // },
        ],
    },
    {
        path: "*",
        element: (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="text-white text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-gray-300">Page not found</p>
                </div>
            </div>
        ),
    },
];