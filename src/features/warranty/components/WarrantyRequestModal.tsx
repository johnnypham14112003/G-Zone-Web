import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { warrantyApi } from '../api/warranty-api';
import { getMyOrders, OrderDetail } from '@/features/orders/api/order-api';
import { useToast } from '@/providers/ToastProvider';

interface WarrantyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const WarrantyRequestModal: React.FC<WarrantyRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const [purchasedProducts, setPurchasedProducts] = useState<(OrderDetail & { orderNumber: string, orderDate: string })[]>([]);
  
  const [formData, setFormData] = useState({
    orderDetailId: '',
    issueDescription: ''
  });

  useEffect(() => {
    const fetchSelectableProducts = async () => {
      if (!isOpen) return;
      setFetchingOrders(true);
      try {
        const res = await getMyOrders(1, 100);
        
        const eligibleOrders = res.items.filter(o => 
          o.status === 'Completed' || o.status === 'Delivered' || o.status === 'Success'
        );

        const products: (OrderDetail & { orderNumber: string, orderDate: string })[] = [];
        for (const order of eligibleOrders) {
          if (order.orderDetails) {
            for (const detail of order.orderDetails) {
              products.push({
                ...detail,
                orderNumber: order.orderNumber,
                orderDate: order.createdAt
              });
            }
          }
        }
        setPurchasedProducts(products);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setFetchingOrders(false);
      }
    };

    fetchSelectableProducts();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderDetailId) {
      showToast("Please select a product", "error");
      return;
    }
    if (!formData.issueDescription.trim()) {
      showToast("Please describe the issue", "error");
      return;
    }

    setLoading(true);
    try {
      await warrantyApi.createClaim({
        customerId: user?.id || '',
        orderDetailId: formData.orderDetailId,
        issueDescription: formData.issueDescription
      });
      showToast("Warranty claim submitted successfully!");
      onSuccess();
      onClose();
      setFormData({ orderDetailId: '', issueDescription: '' });
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to submit warranty claim", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-dark border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white">Create Warranty Claim</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Select Product <span className="text-red-500">*</span></label>
            {fetchingOrders ? (
              <div className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white/50 text-sm">
                Loading your purchased products...
              </div>
            ) : purchasedProducts.length === 0 ? (
              <div className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-red-400 text-sm">
                No eligible products found for warranty (only completed orders count).
              </div>
            ) : (
              <select
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                value={formData.orderDetailId}
                onChange={(e) => setFormData({ ...formData, orderDetailId: e.target.value })}
                required
              >
                <option value="" disabled className="bg-surface-dark">-- Select a product --</option>
                {purchasedProducts.map(p => (
                  <option key={p.orderDetailId} value={p.orderDetailId} className="bg-surface-dark">
                    {p.productName} (Order: {p.orderNumber} - {new Date(p.orderDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Issue Description <span className="text-red-500">*</span></label>
            <textarea
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 min-h-[120px]"
              placeholder="Please describe exactly what's wrong with the product..."
              value={formData.issueDescription}
              onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-white/70 hover:bg-white/5 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || purchasedProducts.length === 0}
              className="px-6 py-2.5 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};