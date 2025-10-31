
import React, { createContext, useState, useContext, useMemo } from 'react';
import { User, Plan } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USER: User = {
  id: '1',
  email: 'user@example.com',
  plan: Plan.Basic,
  coursesCreated: 2,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string) => {
    // In a real app, this would be an API call
    console.log(`Logging in ${email}`);
    setUser({ ...MOCK_USER, email });
  };

  const logout = () => {
    setUser(null);
  };
  
  const value = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
