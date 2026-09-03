import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface UserProfile {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  clearanceLevel: string;
  permissions: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkSession = async () => {
    setLoading(true);
    try {
      const response = await api.get('/auth/me');
      if (response.data && response.data.authenticated) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (identifier: string, password: string) => {
    setError(null);
    try {
      const response = await api.post('/auth/login', { identifier, password });
      if (response.data && response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setError(null);
      } else {
        const msg = response.data?.message || 'Invalid credentials. Please check your details and try again.';
        setError(msg);
        throw new Error(msg);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Invalid credentials. Please check your details and try again.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout notice:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
