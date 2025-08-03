"use client";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { UserService } from '../lib/api/users';

interface User {
  userId: number | null;
  houseId: number | null;
  email: string | null;
  username: string | null;
  role: string | null;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isLoading: true,
  isInitialized: false
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(initialState);
  // Initialize auth state from localStorage
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (typeof window === 'undefined') {
        if (mounted) {
          setState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
        }
        return;
      }

      try {
        const storedToken = localStorage.getItem('jwt');
        const storedUser = localStorage.getItem('user');
        
        if (mounted) {
          setState(prev => ({
            ...prev,
            token: storedToken,
            user: storedUser ? JSON.parse(storedUser) : null,
            isLoading: false,
            isInitialized: true
          }));
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        if (mounted) {
          setState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Memoized handlers
  const login = useCallback((newToken: string, userData: User) => {
    localStorage.setItem('jwt', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setState(prev => ({
      ...prev,
      token: newToken,
      user: userData,
    }));
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await UserService.logout(token);
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setState(prev => ({
        ...prev,
        token: null,
        user: null,
      }));
      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setState(prev => ({
        ...prev,
        token: null,
        user: null,
      }));
      router.push('/signin');
    }
  }, [router]);

 
  const value = useMemo(() => ({
    token: state.token,
    user: state.user,
    login,
    logout,
    isAuthenticated: !!state.token,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized
  }), [state.token, state.user, state.isLoading, state.isInitialized, login, logout]);


  if (!state.isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};