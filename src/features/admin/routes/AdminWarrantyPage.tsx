import React, { useEffect, useState } from "react";
import { warrantyApi, WarrantyClaimResponse } from "@/features/warranty/api/warranty-api";
import { notificationApi } from "@/features/notifications/api/notification-api";
import { useToast } from "@/providers/ToastProvider";
import { useAuth } from "@/providers/AuthProvider";

const AdminWarrantyPage: React.FC = () => {
  const [claims, setClaims] = useState<WarrantyClaimResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { user } = useAuth();
  
  // Modal state
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaimResponse | null>(null);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    resolutionNotes: '',
    repairCost: 0
  });

  const fetchClaims = async () => {
    setLoading(true);
    try {
      // Fetch all claims without customerId filter
      const result = await warrantyApi.getClaims({ pageNumber: 1, pageSize: 100 });
      if (result.statusCode === 200 && result.data?.dataList) {
        setClaims(result.data.dataList);
      }
    } catch (err) {
      console.error("Error fetching warranty claims", err);
      showToast("Failed to load warranty claims.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const openProcessModal = (claim: WarrantyClaimResponse) => {
    setSelectedClaim(claim);
    setUpdateForm({
      status: claim.claimStatus || 'Pending',
      resolutionNotes: claim.resolutionNotes || '',
      repairCost: claim.repairCost || 0
    });
    setIsProcessing(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim) return;

    try {
        await warrantyApi.updateClaim(selectedClaim.claimId, {
          claimStatus: updateForm.status,
          resolutionNotes: updateForm.resolutionNotes,
          repairCost: updateForm.repairCost,
          processedByStaffId: user?.id
        });

        showToast("Warranty claim updated successfully!");
        setIsProcessing(false);
        fetchClaims(); // refresh list
    } catch (err) {
      console.error(err);
      showToast("Failed to update claim.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      case 'approved': return 'text-blue-500 bg-blue-500/10';
      case 'completed': return 'text-green-500 bg-green-500/10';
      case 'rejected': return 'text-red-500 bg-red-500/10';
      default: return 'text-white/70 bg-white/10';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Warranty Claims</h1>
        <button onClick={fetchClaims} className="w-10 h-10 rounded-lg bg-surface-dark border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-lg">refresh</span>
        </button>
      </div>

      <div className="bg-surface-dark border border-surface-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/50">Loading claims...</div>
        ) : claims.length === 0 ? (
          <div className="p-12 text-center text-white/50">No warranty claims found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-black/20 text-xs uppercase text-white/50 border-b border-surface-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Claim #</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Customer ID</th>
                  <th className="px-6 py-4 font-semibold">Issue</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {claims.map((claim) => (
                  <tr key={claim.claimId} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{claim.claimNumber}</td>
                    <td className="px-6 py-4">{new Date(claim.claimDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-mono text-xs">{claim.customerId.substring(0, 8)}...</td>
                    <td className="px-6 py-4 max-w-[200px] truncate" title={claim.issueDescription}>{claim.issueDescription}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(claim.claimStatus)}`}>
                        {claim.claimStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openProcessModal(claim)}
                        className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-black rounded-lg transition-colors font-medium text-xs"
                      >
                        Process
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Processing Modal */}
      {isProcessing && selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-dark border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-lg font-bold text-white">Process Claim #{selectedClaim.claimNumber}</h2>
              <button onClick={() => setIsProcessing(false)} className="text-white/50 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-1">Customer Issue</label>
                <p className="text-sm bg-black/20 p-3 rounded-lg border border-white/5 text-white/90">
                  {selectedClaim.issueDescription}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Update Status</label>
                <select
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary/50"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Resolution Notes</label>
                <textarea
                  value={updateForm.resolutionNotes}
                  onChange={(e) => setUpdateForm({ ...updateForm, resolutionNotes: e.target.value })}
                  placeholder="Notes for the customer..."
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary/50 h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Repair Cost (if applicable)</label>
                <input
                  type="number"
                  value={updateForm.repairCost}
                  onChange={(e) => setUpdateForm({ ...updateForm, repairCost: Number(e.target.value) })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary/50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setIsProcessing(false)} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-black font-bold hover:bg-primary/90">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWarrantyPage;

