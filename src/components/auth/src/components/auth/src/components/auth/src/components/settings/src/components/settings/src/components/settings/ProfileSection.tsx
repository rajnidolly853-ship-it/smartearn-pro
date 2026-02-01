import React from 'react';
import Avatar from '../common/Avatar';
import { UserProfile } from '../../types/user.types';
import { useNotification } from '../../context/NotificationContext';
import { copyToClipboard } from '../../utils/helpers';

interface ProfileSectionProps {
  profile: UserProfile | null;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile }) => {
  const { showNotification } = useNotification();

  const handleCopyUid = async () => {
    if (profile?.uid) {
      const success = await copyToClipboard(profile.uid);
      if (success) {
        showNotification('User ID copied to clipboard', 'success');
      }
    }
  };

  if (!profile) return null;

  return (
    <div className="flex flex-col items-center py-6">
      {/* Avatar */}
      <div className="relative mb-4">
        <Avatar 
          src={profile.photoURL} 
          name={profile.displayName} 
          size="xl" 
          bordered 
          className="ring-4 ring-dark-800"
        />
        {/* Status Dot */}
        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-dark-900 rounded-full" />
      </div>

      {/* Name */}
      <h2 className="text-xl font-display font-bold text-white mb-1">
        {profile.displayName || 'Guest User'}
      </h2>

      {/* Email */}
      <p className="text-sm text-gray-400 mb-3">
        {profile.email || 'No email linked'}
      </p>

      {/* UID Badge */}
      <button 
        onClick={handleCopyUid}
        className="px-3 py-1 rounded-full bg-dark-800 border border-white/10 flex items-center gap-2 hover:bg-dark-700 transition-colors"
      >
        <span className="text-[10px] text-gray-500 uppercase font-bold">UID</span>
        <span className="text-xs font-mono text-gray-300">
          {profile.uid.substring(0, 8)}...
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-500">
          <path d="M8 17.929c0 1.657 2.239 3 5 3s5-1.343 5-3" />
        </svg>
      </button>
    </div>
  );
};

export default ProfileSection;
