import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import { banUser, unbanUser } from '../../services/admin.service';
import { UserProfile } from '../../types/user.types';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';

const AdminUsers: React.FC = () => {
  const { user: adminUser } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Search User
  const handleSearch = async () => {
    if (!searchId) return;
    setLoading(true);
    setFoundUser(null);

    try {
      // Direct ID search (Fastest)
      const userRef = doc(db, 'users', searchId);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setFoundUser(snap.data() as UserProfile);
      } else {
        alert("User not found!");
      }
    } catch (err) {
      alert("Error searching");
    } finally {
      setLoading(false);
    }
  };

  // Ban Logic
  const handleBan = async () => {
    if (!foundUser) return;
    const reason = prompt("Enter Ban Reason (User will see this):", "Violation of Terms");
    if (!reason) return;

    setActionLoading(true);
    await banUser(foundUser.uid, adminUser!.uid, reason);
    alert("⛔ User Banned Successfully");
    setFoundUser({ ...foundUser, isBanned: true, banReason: reason });
    setActionLoading(false);
  };

  // Unban Logic
  const handleUnban = async () => {
    if (!foundUser) return;
    if (!confirm("Are you sure you want to Unban this user?")) return;

    setActionLoading(true);
    await unbanUser(foundUser.uid);
    alert("✅ User Unbanned");
    setFoundUser({ ...foundUser, isBanned: false, banReason: undefined });
    setActionLoading(false);
  };

  return (
    <MainLayout headerTitle="Manage Users" showBackButton>
      <div className="p-4 pb-24">
        
        {/* Search Box */}
        <div className="bg-dark-800 p-4 rounded-2xl border border-white/5 mb-6">
          <Input 
            placeholder="Paste User UID here..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="font-mono text-sm"
          />
          <Button 
            fullWidth 
            className="mt-3" 
            onClick={handleSearch}
            isLoading={loading}
          >
            Search User
          </Button>
        </div>

        {/* User Result Card */}
        {foundUser && (
          <div className="bg-dark-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
            
            {/* Header */}
            <div className="p-6 flex flex-col items-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
              <Avatar 
                src={foundUser.photoURL} 
                name={foundUser.displayName} 
                size="lg" 
                className="mb-3 ring-4 ring-dark-800"
              />
              <h2 className="text-xl font-bold text-white">{foundUser.displayName}</h2>
              <p className="text-gray-400 text-xs font-mono bg-black/30 px-2 py-1 rounded mt-1">
                {foundUser.uid}
              </p>
              
              <div className="mt-4">
                {foundUser.isBanned ? (
                  <Badge variant="error">🚫 BANNED</Badge>
                ) : (
                  <Badge variant="success">✅ ACTIVE</Badge>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 divide-x divide-white/5 border-b border-white/5">
              <div className="p-4 text-center">
                <span className="block text-xs text-gray-500">Joined</span>
                <span className="text-white text-sm font-medium">
                  {new Date(foundUser.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="p-4 text-center">
                <span className="block text-xs text-gray-500">Warnings</span>
                <span className="text-white text-sm font-medium">
                  {foundUser.warningCount}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4">
              {foundUser.isBanned ? (
                <div>
                  <p className="text-red-400 text-xs text-center mb-3 bg-red-500/10 p-2 rounded">
                    Reason: {foundUser.banReason}
                  </p>
                  <Button 
                    variant="primary" 
                    fullWidth 
                    onClick={handleUnban}
                    isLoading={actionLoading}
                  >
                    Unban User
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="danger" 
                  fullWidth 
                  onClick={handleBan}
                  isLoading={actionLoading}
                >
                  BAN USER
                </Button>
              )}
            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default AdminUsers;
