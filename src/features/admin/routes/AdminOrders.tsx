import React, { useEffect, useState } from 'react';
import { Order, getMyOrders, getOrders, patchOrder } from '@/features/orders/api/order-api';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders(1, 50);
      setOrders(data.items);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load orders', err);

      if (err?.response?.status === 403) {
        try {
          const mine = await getMyOrders(1, 50);
          setOrders(mine.items);
          setError('Current account has no admin scope, showing your own orders instead. Please log out and log in again after role update.');
        } catch (myErr) {
          console.error('Failed to load my orders fallback', myErr);
          setError('Failed to load orders. Please check admin permission and API.');
        }
      } else {
        setError('Failed to load orders. Please check admin permission and API.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      setUpdatingOrderId(orderId);
      await patchOrder(orderId, { status });
        const order = orders.find(o => o.orderId === orderId);
        if (order && order.accountId) { await notificationApi.sendNotification(order.accountId, { title: 'Order Update: ' + order.orderNumber, message: 'Your order status is now ' + status, type: 'Order' }).catch(console.error); }
      await loadOrders();
    } catch (err: any) {
      console.error('Failed to update order status', err);
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">Orders</h1>
        <p className="text-text-muted">Manage customer COD orders and delivery statuses.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-surface-dark border border-surface-border rounded-xl flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2a1212] text-text-muted text-xs uppercase tracking-widest border-b border-surface-border">
                <th className="px-6 py-4 font-bold">Order</th>
                <th className="px-6 py-4 font-bold">Receiver</th>
                <th className="px-6 py-4 font-bold">Payment</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderId} className="border-b border-surface-border hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-bold">{order.orderNumber}</p>
                      <p className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{order.receiverName}</p>
                      <p className="text-xs text-text-muted">{order.receiverPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{order.paymentMethod}</p>
                      <p className="text-xs text-text-muted">{order.paymentStatus}</p>
                    </td>
                    <td className="px-6 py-4 text-white font-bold">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-primary/20 px-2 py-1 text-[10px] font-bold uppercase text-primary">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          onClick={() => updateStatus(order.orderId, 'Processing')}
                          disabled={updatingOrderId === order.orderId}
                          className="rounded bg-blue-500/20 px-2 py-1 text-[10px] font-bold uppercase text-blue-300 hover:bg-blue-500/30 disabled:opacity-50"
                        >
                          Processing
                        </button>
                        <button
                          onClick={() => updateStatus(order.orderId, 'Shipping')}
                          disabled={updatingOrderId === order.orderId}
                          className="rounded bg-yellow-500/20 px-2 py-1 text-[10px] font-bold uppercase text-yellow-300 hover:bg-yellow-500/30 disabled:opacity-50"
                        >
                          Shipping
                        </button>
                        <button
                          onClick={() => updateStatus(order.orderId, 'Delivered')}
                          disabled={updatingOrderId === order.orderId}
                          className="rounded bg-green-500/20 px-2 py-1 text-[10px] font-bold uppercase text-green-300 hover:bg-green-500/30 disabled:opacity-50"
                        >
                          Delivered
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

