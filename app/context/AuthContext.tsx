"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

// AuthContext Provider Component
export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Async function to fetch user (if needed)
 
  // You can call fetchUser when needed, perhaps in a useEffect in the component

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
}
