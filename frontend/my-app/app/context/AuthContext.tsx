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
        
        // Validate token if it exists
        if (storedToken) {
          try {
            // Decode and check if token is expired
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            const isExpired = payload.exp * 1000 < Date.now();
            
            if (isExpired) {
              // Token is expired, clear storage
              localStorage.removeItem('jwt');
              localStorage.removeItem('user');
              if (mounted) {
                setState(prev => ({
                  ...prev,
                  token: null,
                  user: null,
                  isLoading: false,
                  isInitialized: true
                }));
              }
              return;
            }
          } catch (tokenError) {
            // Invalid token format, clear storage
            console.error('Invalid token format:', tokenError);
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');
            if (mounted) {
              setState(prev => ({
                ...prev,
                token: null,
                user: null,
                isLoading: false,
                isInitialized: true
              }));
            }
            return;
          }
        }
        
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
        // Clear potentially corrupted data
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        if (mounted) {
          setState(prev => ({ 
            ...prev, 
            token: null,
            user: null,
            isLoading: false, 
            isInitialized: true 
          }));
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
      const token = localStorage.getItem('jwt'); // Use 'jwt' key consistently
      if (token) {
        await UserService.logout(token);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with cleanup even if API call fails
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('jwt');
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