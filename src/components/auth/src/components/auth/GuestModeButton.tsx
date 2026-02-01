import React from 'react';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

const GuestModeButton: React.FC = () => {
  const { loginAsGuest, isLoading } = useAuth();

  return (
    <Button
      variant="ghost"
      fullWidth
      size="md"
      onClick={loginAsGuest}
      disabled={isLoading}
      className="text-gray-500 hover:text-white mt-4 font-normal text-sm"
    >
      Continue as Guest (Limited)
    </Button>
  );
};

export default GuestModeButton;
