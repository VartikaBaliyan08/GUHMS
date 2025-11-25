import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'DOCTOR' | 'PATIENT')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;

    if (!isAuthenticated) {
      console.log('🔒 Not authenticated, redirecting to login');
      setLocation('/login');
      return;
    }

    if (allowedRoles && user && user.role && !allowedRoles.includes(user.role)) {
      console.log('🔒 Wrong role, redirecting to appropriate dashboard');
      const dashboardMap = {
        ADMIN: '/admin',
        DOCTOR: '/doctor',
        PATIENT: '/patient',
      } as const;
      setLocation(dashboardMap[user.role] ?? '/');
      return;
    }
  }, [isAuthenticated, user, allowedRoles, setLocation, isLoading]);

  // Show loading while auth is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && user.role && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
