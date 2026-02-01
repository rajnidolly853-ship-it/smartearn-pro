import React from 'react';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

interface GoogleLoginButtonProps {
  referralCode?: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ referralCode }) => {
  const { loginWithGoogle, isLoading } = useAuth();

  const handleLogin = async () => {
    await loginWithGoogle(referralCode);
  };

  return (
    <Button
      variant="secondary"
      fullWidth
      size="lg"
      onClick={handleLogin}
      isLoading={isLoading}
      className="bg-white text-gray-900 hover:bg-gray-100 border-none font-medium"
      leftIcon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.81H12V14.47H18.47C18.18 15.96 17.34 17.26 16.08 18.1V21.09H19.93C22.19 19.01 23.52 15.95 23.52 12.29Z" fill="#4285F4"/>
          <path d="M12 24C15.24 24 17.96 22.92 19.93 21.09L16.08 18.1C15 18.82 13.62 19.25 12 19.25C8.87 19.25 6.22 17.13 5.27 14.28H1.29V17.37C3.26 21.3 7.31 24 12 24Z" fill="#34A853"/>
          <path d="M5.27 14.28C5.03 13.56 4.9 12.79 4.9 12C4.9 11.21 5.03 10.44 5.27 9.72V6.63H1.29C0.47 8.26 0 10.08 0 12C0 13.92 0.47 15.74 1.29 17.37L5.27 14.28Z" fill="#FBBC05"/>
          <path d="M12 4.75C13.76 4.75 15.34 5.36 16.58 6.54L19.99 3.13C17.96 1.22 15.24 0 12 0C7.31 0 3.26 2.7 1.29 6.63L5.27 9.72C6.22 6.87 8.87 4.75 12 4.75Z" fill="#EA4335"/>
        </svg>
      }
    >
      Continue with Google
    </Button>
  );
};

export default GoogleLoginButton;
