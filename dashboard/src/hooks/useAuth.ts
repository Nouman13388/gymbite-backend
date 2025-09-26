import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../context/AuthContext";

export const useAuth = (): AuthContextType => {
  console.log("🪝 useAuth hook called");
  const context = useContext(AuthContext);
  if (!context) {
    console.error("❌ useAuth called outside of AuthProvider!");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  console.log("✅ useAuth context found:", {
    hasUser: !!context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
  });
  return context;
};
