import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { auth } from '../utils/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { AuthContext, type AuthContextType, type User } from './AuthContext';
import { getCurrentUser, clearTokenCache } from '../services/api';

// Re-export for convenience
export { AuthContext, type AuthContextType, type User };

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    console.log("AuthProvider initializing...");
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = !!user;

    // Check API health periodically
    const checkHealth = useCallback(async () => {
        try {
            // Temporarily disabled to focus on auth issue
            // const healthy = await checkApiHealth();
            // if (!healthy) {
            //     console.warn('Backend API is not responding');
            // }
            console.log("Health check temporarily disabled");
        } catch (error) {
            console.error('Health check failed:', error);
        }
    }, []);

    // Enhanced user data fetching with better error handling
    const fetchUserData = useCallback(async (): Promise<User | null> => {
        try {
            console.log("Fetching user data from backend API...");

            // Add a small delay to ensure Firebase token is ready
            await new Promise(resolve => setTimeout(resolve, 100));

            const userData = await getCurrentUser();
            console.log("User data received:", userData);

            if (userData && userData.role === 'ADMIN') {
                console.log("User is ADMIN, setting user state");
                const user = {
                    id: userData.id,
                    email: userData.email,
                    role: userData.role,
                    displayName: userData.name,
                    firebaseUid: userData.firebaseUid
                };
                console.log("Created user object:", user);
                return user;
            } else {
                console.log("User is not ADMIN, role:", userData?.role || 'undefined');
                console.log("Full user data:", userData);
                return null;
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            console.error('Error details:', {
                name: error instanceof Error ? error.name : 'Unknown',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
            return null;
        }
    }, []);

    useEffect(() => {
        console.log("Setting up Firebase auth state listener...");

        // Initial health check
        checkHealth();

        // Set up periodic health checks (every 5 minutes)
        const healthInterval = setInterval(checkHealth, 5 * 60 * 1000);

        // Check if user is already authenticated on mount
        const checkCurrentUser = async () => {
            const currentFirebaseUser = auth.currentUser;
            if (currentFirebaseUser) {
                console.log("🔥 Found existing Firebase user on mount:", {
                    uid: currentFirebaseUser.uid,
                    email: currentFirebaseUser.email
                });
                setIsLoading(true);
                try {
                    const userData = await fetchUserData();
                    console.log("🔥 Initial user data fetch result:", userData);
                    setUser(userData);
                } catch (error) {
                    console.error("🔥 Error during initial user data fetch:", error);
                    setUser(null);
                }
                setIsLoading(false);
            }
        };

        // Check for existing user immediately
        checkCurrentUser();

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log("🔥 Firebase auth state changed:", firebaseUser ? "User logged in" : "User logged out");
            console.log("🔥 Firebase user:", firebaseUser ? { uid: firebaseUser.uid, email: firebaseUser.email } : null);
            console.log("🔥 Current timestamp:", new Date().toISOString());

            setIsLoading(true);

            if (firebaseUser) {
                console.log("🔥 Firebase user logged in, fetching backend user data...");
                try {
                    const userData = await fetchUserData();
                    console.log("🔥 Backend user data result:", userData);
                    setUser(userData);
                    console.log("🔥 User state updated:", userData ? "User set" : "User cleared (not admin)");
                } catch (error) {
                    console.error("🔥 Error during user data fetch:", error);
                    setUser(null);
                }
            } else {
                console.log("🔥 No Firebase user, clearing user state and token cache");
                setUser(null);
                clearTokenCache();
            }

            setIsLoading(false);
            console.log("🔥 Auth state update complete, isLoading set to false");
        });

        return () => {
            console.log("Cleaning up Firebase auth listener and health check interval");
            unsubscribe();
            clearInterval(healthInterval);
        };
    }, [fetchUserData, checkHealth]);

    const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
        console.log("Login function called with:", {
            username: credentials.username,
            password: credentials.password ? "[PASSWORD PROVIDED]" : "[NO PASSWORD]"
        });

        try {
            console.log("Attempting Firebase signInWithEmailAndPassword...");
            const userCredential = await signInWithEmailAndPassword(auth, credentials.username, credentials.password);
            console.log("Firebase login successful!", {
                uid: userCredential.user.uid,
                email: userCredential.user.email
            });

            // Clear any cached tokens to ensure fresh ones are fetched
            clearTokenCache();

            console.log("🔥 Login successful, waiting for auth state change to trigger...");

            // Manual fallback: If auth state change doesn't trigger, manually fetch user data
            setTimeout(async () => {
                console.log("🔥 Manual fallback check - current state:", {
                    firebaseUser: auth.currentUser ? auth.currentUser.uid : null,
                    contextUser: user,
                    isAuthenticated,
                    isLoading
                });

                // If we have a Firebase user but no context user, manually trigger fetch
                if (auth.currentUser && !user && !isLoading) {
                    console.log("🔥 Auth state change missed, manually fetching user data...");
                    setIsLoading(true);
                    try {
                        const userData = await fetchUserData();
                        console.log("🔥 Manual user data fetch result:", userData);
                        setUser(userData);
                    } catch (error) {
                        console.error("🔥 Error during manual user data fetch:", error);
                        setUser(null);
                    }
                    setIsLoading(false);
                }
            }, 2000); // Wait 2 seconds for auth state change to fire naturally

            return true;
        } catch (error: unknown) {
            const firebaseError = error as { code?: string; message?: string };
            console.error('Firebase login failed:', {
                code: firebaseError?.code,
                message: firebaseError?.message,
                error: error
            });
            return false;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
