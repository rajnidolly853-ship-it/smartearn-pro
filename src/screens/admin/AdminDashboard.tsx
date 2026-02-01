import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { getAdminStats } from '../../services/admin.service';
import { AdminStats } from '../../types/admin.types';
import Loader from '../../components/common/Loader';
import { useNavigation } from '../../context/NavigationContext';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { navigate } = useNavigation();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getAdminStats();
    setStats(data);
    setLoading(false);
  };

  if (loading) return <Loader fullScreen text="Loading Admin Data..." />;

  return (
    <MainLayout headerTitle="👑 Admin Control" showBackButton>
      <div className="p-4 pb-24 space-y-6">
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('admin-withdrawals' as any)} 
            className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 p-4 rounded-2xl flex flex-col items-center text-center"
          >
            <span className="text-3xl mb-2">💸</span>
            <h3 className="font-bold text-white">Withdrawals</h3>
            <span className="text-xs text-yellow-400 font-bold mt-1">
              {stats?.pendingWithdrawals || 0} Pending
            </span>
          </button>

          <button 
            onClick={() => navigate('admin-users' as any)}
            className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 p-4 rounded-2xl flex flex-col items-center text-center"
          >
            <span className="text-3xl mb-2">👥</span>
            <h3 className="font-bold text-white">Users</h3>
            <span className="text-xs text-blue-400 font-bold mt-1">
              Manage All
            </span>
          </button>
        </div>

        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Live Statistics</h3>
          <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <span className="text-sm text-gray-300">Active Today</span>
              <span className="font-mono font-bold text-white">{stats?.activeUsersToday}</span>
            </div>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <span className="text-sm text-gray-300">Total Users</span>
              <span className="font-mono font-bold text-white">{stats?.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-gray-300">Total Payouts</span>
              <span className="font-mono font-bold text-white">₹{stats?.totalPayouts}</span>
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
