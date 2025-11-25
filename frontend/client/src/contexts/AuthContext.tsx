import { createContext, useContext, useState, useEffect } from 'react';
import type { AuthResponse, User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔍 Initializing auth from localStorage...');
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        console.log('🔍 Stored user:', storedUser ? 'Found' : 'Not found');
        console.log('🔍 Stored token:', storedToken ? 'Found' : 'Not found');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setToken(storedToken);
          console.log('✅ Auth restored:', userData.name, userData.role);
        } else {
          console.log('❌ No stored auth found');
        }
      } catch (error) {
        console.error('❌ Failed to load auth from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
        console.log('✅ Auth initialization complete');
      }
    };

    initializeAuth();
  }, []);

  const login = (authData: AuthResponse) => {
    const userData: User = {
      id: authData.id,
      name: authData.name,
      email: '', // Will be set from profile if needed
      role: authData.role,
    };
    
    setUser(userData);
    setToken(authData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
