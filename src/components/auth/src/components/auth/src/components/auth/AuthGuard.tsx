import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '../../context/NavigationContext';
import Loader from '../common/Loader';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // If true, guest mode is NOT allowed
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = false 
}) => {
  const { isAuthenticated, isGuest, isLoading } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isGuest) {
        // Not logged in at all
        navigate('login');
      } else if (requireAuth && isGuest) {
        // Logged in as guest, but route requires full auth
        navigate('login');
      }
    }
  }, [isLoading, isAuthenticated, isGuest, requireAuth, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-dark-950">
        <Loader fullScreen />
      </div>
    );
  }

  // If check passed, render children
  if ((isAuthenticated || isGuest) && !(requireAuth && isGuest)) {
    return <>{children}</>;
  }

  // Fallback (usually won't render due to navigation)
  return null;
};

export default AuthGuard;
