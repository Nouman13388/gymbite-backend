// import React, { createContext, useContext, useState, useEffect } from 'react';
// import type { ReactNode } from 'react';

// interface User {
//     id: string;
//     email: string;
//     role: string;
//     displayName: string;
// }

// interface AuthContextType {
//     user: User | null;
//     isAuthenticated: boolean;
//     isLoading: boolean;
//     login: (credentials: { username: string; password: string }) => Promise<boolean>;
//     logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//     children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//     const [user, setUser] = useState<User | null>(null);
//     const [isLoading, setIsLoading] = useState(true);

//     const isAuthenticated = !!user;

//     useEffect(() => {
//         // Check for existing auth token on mount
//         const checkAuth = async () => {
//             try {
//                 const token = localStorage.getItem('authToken');
//                 if (token) {
//                     // In a real app, you'd verify the token with your API
//                     // For now, we'll simulate a successful auth check
//                     const userData = localStorage.getItem('userData');
//                     if (userData) {
//                         setUser(JSON.parse(userData));
//                     }
//                 }
//             } catch (error) {
//                 console.error('Auth check failed:', error);
//                 localStorage.removeItem('authToken');
//                 localStorage.removeItem('userData');
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         checkAuth();
//     }, []);

//     const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
//         setIsLoading(true);
//         try {
//             // Simulate API call - replace with real authentication
//             await new Promise(resolve => setTimeout(resolve, 1000));

//             // For demo purposes, accept any credentials
//             const mockUser: User = {
//                 id: '1',
//                 email: credentials.username,
//                 role: 'ADMIN',
//                 displayName: 'Admin User'
//             };

//             setUser(mockUser);
//             localStorage.setItem('authToken', 'mock-token');
//             localStorage.setItem('userData', JSON.stringify(mockUser));

//             return true;
//         } catch (error) {
//             console.error('Login failed:', error);
//             return false;
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userData');
//     };

//     const contextValue: AuthContextType = {
//         user,
//         isAuthenticated,
//         isLoading,
//         login,
//         logout
//     };

//     return (
//         <AuthContext.Provider value={contextValue}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = (): AuthContextType => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };
