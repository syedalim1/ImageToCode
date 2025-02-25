import { User } from "firebase/auth";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface AuthContextType {
  user: User | null;
  credits: number;
  setUser: (user: User | null) => void;
  addCredits: (amount: number) => void;
  deductCredits: (amount: number) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState(0);

  const addCredits = useCallback((amount: number) => {
    setCredits((prev) => prev + amount);
  }, []);

  const deductCredits = useCallback((amount: number) => {
    setCredits((prev) => Math.max(0, prev - amount));
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser, 
        credits,
        addCredits,
        deductCredits
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
