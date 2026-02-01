import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { getPendingWithdrawals, approveWithdrawal, rejectWithdrawal } from '../../services/admin.service';
import { WithdrawalRequest } from '../../types/wallet.types';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers';

const AdminWithdrawals: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getPendingWithdrawals(50); // Get top 50 pending
    setRequests(data);
    setLoading(false);
  };

  // Handle Approve
  const handleApprove = async (req: WithdrawalRequest) => {
    // Real life mein yahan aap manually UPI se payment karoge, fir yahan confirm karoge
    const txnId = prompt(`Enter Transaction ID for payment to ${req.details.upiId || req.details.phone}:`);
    
    if (!txnId) return; // Cancelled

    setProcessingId(req.id);
    const result = await approveWithdrawal(req.id, user!.uid, txnId);
    
    if (result.success) {
      alert("✅ Payment Approved!");
      loadData(); // Refresh list
    } else {
      alert("❌ Error: " + result.error);
    }
    setProcessingId(null);
  };

  // Handle Reject
  const handleReject = async (req: WithdrawalRequest) => {
    const reason = prompt("Enter rejection reason (User will see this):", "Invalid Activity detected");
    
    if (!reason) return;

    setProcessingId(req.id);
    const result = await rejectWithdrawal(req.id, user!.uid, reason);
    
    if (result.success) {
      alert("🚫 Request Rejected & Coins Refunded");
      loadData();
    } else {
      alert("❌ Error: " + result.error);
    }
    setProcessingId(null);
  };

  return (
    <MainLayout headerTitle="Manage Payments" showBackButton>
      <div className="p-4 pb-24">
        
        {loading ? (
          <Loader text="Fetching Requests..." />
        ) : requests.length === 0 ? (
          <EmptyState 
            title="No Pending Requests" 
            description="All clean! Good job." 
            icon={<span className="text-4xl">🧹</span>}
          />
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-dark-800 border border-white/10 rounded-2xl p-4 shadow-lg">
                
                {/* Header: User & Amount */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-white font-bold text-lg">₹{req.currencyAmount}</h4>
                    <p className="text-xs text-neon-400">{req.amount} Coins</p>
                  </div>
                  <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-2 py-1 rounded-full uppercase font-bold">
                    Pending
                  </span>
                </div>

                {/* Details */}
                <div className="bg-black/30 rounded-lg p-3 text-xs text-gray-300 space-y-1 mb-4 font-mono">
                  <p>USER: {req.userId.substring(0, 10)}...</p>
                  <p>DATE: {formatDate(req.createdAt)}</p>
                  <p>METHOD: <span className="text-white font-bold">{req.methodId.toUpperCase()}</span></p>
                  <p className="text-white bg-white/5 p-1 mt-1 block select-all">
                    {/* Show UPI or Phone */}
                    ID: {req.details.upiId || req.details.phone || req.details.email}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button 
                    variant="danger" 
                    size="sm" 
                    fullWidth 
                    onClick={() => handleReject(req)}
                    isLoading={processingId === req.id}
                    disabled={!!processingId}
                  >
                    Reject
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    fullWidth
                    onClick={() => handleApprove(req)}
                    isLoading={processingId === req.id}
                    disabled={!!processingId}
                  >
                    Approve & Pay
                  </Button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default AdminWithdrawals;
