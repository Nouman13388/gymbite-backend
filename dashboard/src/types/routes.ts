export const ROUTES = {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    USERS: '/users',
    SETTINGS: '/settings',
    PROFILE: '/profile',
    MEALPLANS: '/meal-plans',
    WORKOUTS: '/workouts',

};

export interface RouteMetaData {
    path: string;
    name: string;
    requiresAuth: boolean;
}

export const ROUTE_METADATA: Record<string, RouteMetaData> = {
    [ROUTES.LOGIN]: {
        path: ROUTES.LOGIN,
        name: 'Login',
        requiresAuth: false,
    },
    [ROUTES.DASHBOARD]: {
        path: ROUTES.DASHBOARD,
        name: 'Dashboard',
        requiresAuth: true,
    },
    [ROUTES.USERS]: {
        path: ROUTES.USERS,
        name: 'Users',
        requiresAuth: true,
    },
    [ROUTES.SETTINGS]: {
        path: ROUTES.SETTINGS,
        name: 'Settings',
        requiresAuth: true,
    },
    [ROUTES.PROFILE]: {
        path: ROUTES.PROFILE,
        name: 'Profile',
        requiresAuth: true,
    },
    [ROUTES.MEALPLANS]: {
        path: ROUTES.MEALPLANS,
        name: 'Meal Plans',
        requiresAuth: true,
    },
    [ROUTES.WORKOUTS]: {
        path: ROUTES.WORKOUTS,
        name: 'Workouts',
        requiresAuth: true,
    },
};
