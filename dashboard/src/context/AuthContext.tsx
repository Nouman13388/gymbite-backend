import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { auth } from '../utils/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { AuthContext, type AuthContextType, type User } from './AuthContext';

// Re-export for convenience
export { AuthContext, type AuthContextType, type User };

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    console.log("🏗️ AuthProvider initializing...");
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = !!user;

    useEffect(() => {
        console.log("🔧 Setting up Firebase auth state listener...");
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log("🔄 Firebase auth state changed:", firebaseUser ? "User logged in" : "User logged out");
            console.log("👤 Firebase user:", firebaseUser ? { uid: firebaseUser.uid, email: firebaseUser.email } : null);

            setIsLoading(true);
            if (firebaseUser) {
                try {
                    console.log("📡 Fetching user data from backend API...");
                    const response = await fetch(`/api/users/firebase/${firebaseUser.uid}`);
                    console.log("📊 API Response status:", response.status);

                    if (response.ok) {
                        const userData = await response.json();
                        console.log("📦 User data received:", userData);

                        if (userData.role === 'ADMIN') {
                            console.log("✅ User is ADMIN, setting user state");
                            setUser({
                                id: userData.id,
                                email: userData.email,
                                role: userData.role,
                                displayName: userData.name,
                                firebaseUid: userData.firebaseUid
                            });
                        } else {
                            console.log("❌ User is not ADMIN, role:", userData.role);
                            setUser(null);
                        }
                    } else {
                        console.log("❌ Failed to fetch user data, status:", response.status);
                        setUser(null);
                    }
                } catch (error) {
                    console.error('💥 Failed to fetch user data:', error);
                    setUser(null);
                }
            } else {
                console.log("🚪 No Firebase user, setting user state to null");
                setUser(null);
            }
            setIsLoading(false);
            console.log("✅ Auth state update complete");
        });

        return () => {
            console.log("🧹 Cleaning up Firebase auth listener");
            unsubscribe();
        };
    }, []);

    const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
        console.log("🔐 Login function called with:", {
            username: credentials.username,
            password: credentials.password ? "[PASSWORD PROVIDED]" : "[NO PASSWORD]"
        });

        try {
            console.log("🔥 Attempting Firebase signInWithEmailAndPassword...");
            const userCredential = await signInWithEmailAndPassword(auth, credentials.username, credentials.password);
            console.log("✅ Firebase login successful!", {
                uid: userCredential.user.uid,
                email: userCredential.user.email
            });
            return true;
        } catch (error: unknown) {
            const firebaseError = error as { code?: string; message?: string };
            console.error('❌ Firebase login failed:', {
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

