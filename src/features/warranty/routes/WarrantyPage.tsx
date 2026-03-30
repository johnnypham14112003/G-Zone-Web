import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { warrantyApi, WarrantyClaimResponse } from "@/features/warranty/api/warranty-api";
import { WarrantyRequestModal } from "../components/WarrantyRequestModal";    
import { useToast } from "@/providers/ToastProvider";

const WarrantyPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState<WarrantyClaimResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const fetchClaims = async () => {
    try {
      const result = await warrantyApi.getClaims({ pageNumber: 1, pageSize: 50, customerId: user?.id });
      if (result.statusCode === 200 && result.data?.dataList) {
        setClaims(result.data.dataList);
      }
    } catch (error) {
      console.error("Error fetching warranty claims", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchClaims();
    }
  }, [user]);

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
    <div className="mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tight text-white">
            My Warranty Claims
          </h1>
          <p className="mt-2 text-white/60">
            Track the status of your product repairs and exchanges.
          </p>
        </div>
        <div>
          <button onClick={() => setIsModalOpen(true)}
            className="bg-primary text-black px-6 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            REQUEST WARRANTY
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface-dark p-6 shadow-2xl">
        {loading ? (
          <div className="flex h-32 items-center justify-center text-white/50"> 
            Loading your claims...
          </div>
        ) : claims.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-12 text-white/50">
            <span className="material-symbols-outlined text-6xl mb-4 text-white/20">hardware</span>
            <p>You have no active warranty claims.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim.claimId} className="flex flex-col sm:flex-row justify-between gap-4 rounded-xl border border-white/5 bg-black/20 p-5">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-lg">{claim.claimNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(claim.claimStatus)}`}>
                      {claim.claimStatus}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-white/40 mb-1">Issue Description</h4>
                    <p className="text-sm text-white/80">{claim.issueDescription}</p>
                  </div>

                  {claim.resolutionNotes ? (
                    <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-xs uppercase tracking-wider text-primary mb-1">Response from Service Center</h4>
                      <p className="text-sm text-white/80">{claim.resolutionNotes}</p>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10 opacity-60">
                      <h4 className="text-xs uppercase tracking-wider text-white/50 mb-1">Response from Service Center</h4>
                      <p className="text-sm text-white/50 italic">Waiting for inspection from our technical team...</p>
                    </div>
                  )}
                  
                  {claim.repairCost > 0 && (
                    <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <h4 className="text-xs uppercase tracking-wider text-red-400 mb-1">Estimated Repair Cost</h4>
                      <p className="text-sm font-bold text-red-400">{claim.repairCost.toLocaleString()} VND</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 sm:text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6 shrink-0 min-w-[200px]">
                   <div>
                    <p className="text-xs text-white/40">Claim Date</p>
                    <p className="text-sm text-white/90">{new Date(claim.claimDate).toLocaleDateString()}</p>
                  </div>
                   <div>
                    <p className="text-xs text-white/40">Status Updated</p>     
                    <p className="text-sm text-white/90">{claim.updatedAt ? new Date(claim.updatedAt).toLocaleDateString() : 'Pending'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <WarrantyRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setLoading(true);
          fetchClaims();
        }}
      />
    </div>
  );
};

export default WarrantyPage;
