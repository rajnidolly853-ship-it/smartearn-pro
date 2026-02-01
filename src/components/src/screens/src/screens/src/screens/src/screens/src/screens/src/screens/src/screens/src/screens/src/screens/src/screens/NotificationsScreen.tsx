import React, { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { formatDate } from '../utils/helpers';

const NotificationsScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const { notifications, isLoading, refresh, markAllRead, clearAll } = useNotifications(userProfile?.uid);

  useEffect(() => {
    refresh();
    // Auto mark as read on open
    return () => {
      markAllRead();
    };
  }, []);

  return (
    <MainLayout headerTitle="Notifications" showBackButton>
      <div className="p-4 pb-24">
        
        {/* Header Actions */}
        {notifications.length > 0 && (
          <div className="flex justify-end mb-4">
            <Button size="sm" variant="ghost" onClick={clearAll}>
              Clear All
            </Button>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                className={`
                  p-4 rounded-2xl border
                  ${notif.isRead ? 'bg-dark-800/50 border-white/5' : 'bg-dark-800 border-neon-500/30'}
                `}
              >
                <div className="flex gap-3">
                  <div className="mt-1 flex-shrink-0">
                    {notif.type === 'reward' && '💰'}
                    {notif.type === 'withdrawal' && '🏦'}
                    {notif.type === 'system' && '🔔'}
                    {notif.type === 'promo' && '🎁'}
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>
                      {notif.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-2">
                      {formatDate(notif.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20">
            <EmptyState 
              icon={<span className="text-4xl">🔕</span>}
              title="No Notifications" 
              description="You're all caught up!"
            />
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default NotificationsScreen;
