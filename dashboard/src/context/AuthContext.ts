import { createContext } from "react";

export interface User {
  id: string;
  email: string;
  role: string;
  displayName: string;
  firebaseUid: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: {
    username: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
