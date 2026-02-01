import React from 'react';
import Button from '../common/Button';

interface InviteButtonProps {
  onInvite: () => void;
  fixed?: boolean;
}

const InviteButton: React.FC<InviteButtonProps> = ({ onInvite, fixed = false }) => {
  if (fixed) {
    return (
      <div className="fixed bottom-24 right-4 z-40">
        <Button
          variant="primary"
          onClick={onInvite}
          className="rounded-full shadow-neon w-14 h-14 !p-0 flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      fullWidth
      size="lg"
      onClick={onInvite}
      leftIcon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      }
    >
      Invite Friends via WhatsApp
    </Button>
  );
};

export default InviteButton;
