import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '../../context/NavigationContext';
import Loader from '../common/Loader';
import { isAdmin } from '../../services/admin.service';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [checking, setChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate('login');
        return;
      }

      const adminStatus = await isAdmin(user.uid);
      
      if (adminStatus) {
        setIsAuthorized(true);
      } else {
        alert("⛔ Access Denied: You are not an Admin!");
        navigate('home');
      }
      setChecking(false);
    };

    checkAdmin();
  }, [user, navigate]);

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader text="Verifying Admin Access..." />
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};

export default AdminRoute;
