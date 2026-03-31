import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "@/providers/ToastProvider";
import ActionMenu from "../components/ActionMenu";
import {
  OrderVoucher,
  applyVoucherToOrder,
  getOrdersByVoucher,
  getVouchersByOrder,
  removeVoucherFromOrder,
} from "../api/order-voucher-api";
import { Voucher, getVouchers } from "../api/voucher-api";
import { Order, getOrders } from "@/features/orders/api/order-api";

const AdminOrderVouchers: React.FC = () => {
  const [rows, setRows] = useState<OrderVoucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orderIdFilter, setOrderIdFilter] = useState("");
  const [voucherIdFilter, setVoucherIdFilter] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const [applyOpen, setApplyOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({
    orderId: "",
    voucherId: "",
  });

  const { showToast } = useToast();

  const syncOptions = async () => {
    try {
      const [orderData, voucherData] = await Promise.all([
        getOrders(1, 200),
        getVouchers(1, 200, {}),
      ]);
      setOrders(orderData.items || []);
      setVouchers(voucherData.items || []);

      if (!applyForm.orderId && orderData.items.length > 0) {
        setApplyForm((prev) => ({ ...prev, orderId: orderData.items[0].orderId }));
      }
      if (!applyForm.voucherId && voucherData.items.length > 0) {
        setApplyForm((prev) => ({ ...prev, voucherId: voucherData.items[0].voucherId }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    syncOptions();
  }, []);

  const fetchByOrder = async (id: string) => {
    if (!id) {
      showToast("Please provide order ID", "error");
      return;
    }

    try {
      setLoading(true);
      const data = await getVouchersByOrder(id);
      setRows(data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load order vouchers by order");
    } finally {
      setLoading(false);
    }
  };

  const fetchByVoucher = async (id: string) => {
    if (!id) {
      showToast("Please provide voucher ID", "error");
      return;
    }

    try {
      setLoading(true);
      const data = await getOrdersByVoucher(id);
      setRows(data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load order vouchers by voucher");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    if (orderIdFilter) {
      await fetchByOrder(orderIdFilter);
      return;
    }

    if (voucherIdFilter) {
      await fetchByVoucher(voucherIdFilter);
      return;
    }

    setRows([]);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await applyVoucherToOrder(applyForm);
      showToast("Voucher applied to order successfully", "success");
      setApplyOpen(false);
      await refresh();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to apply voucher", "error");
    }
  };

  const handleRemove = async (item: OrderVoucher) => {
    const confirmed = window.confirm("Remove this voucher from order?");
    if (!confirmed) {
      return;
    }

    try {
      await removeVoucherFromOrder({
        orderId: item.orderId,
        voucherId: item.voucherId,
      });
      showToast("Voucher removed from order", "success");
      await refresh();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to remove voucher", "error");
    }
  };

  const orderOptions = useMemo(() => {
    return orders.map((order) => ({
      value: order.orderId,
      label: `${order.orderNumber} (${order.status})`,
    }));
  }, [orders]);

  const voucherOptions = useMemo(() => {
    return vouchers.map((voucher) => ({
      value: voucher.voucherId,
      label: `${voucher.voucherCode} - ${voucher.voucherName}`,
    }));
  }, [vouchers]);

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">
            Order Vouchers
          </h1>
          <p className="text-text-muted">Apply and remove vouchers on orders.</p>
        </div>
        <button
          onClick={() => setApplyOpen(true)}
          className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Apply Voucher
        </button>
      </div>

      <div className="bg-surface-dark border border-surface-border rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex gap-2">
          <input
            value={orderIdFilter}
            onChange={(e) => setOrderIdFilter(e.target.value)}
            placeholder="Filter by order ID"
            className="bg-background-dark border-2 border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary w-full"
          />
          <button
            onClick={() => fetchByOrder(orderIdFilter)}
            className="bg-primary hover:bg-red-600 px-4 rounded text-white font-bold"
          >
            Search
          </button>
        </div>
        <div className="flex gap-2">
          <input
            value={voucherIdFilter}
            onChange={(e) => setVoucherIdFilter(e.target.value)}
            placeholder="Filter by voucher ID"
            className="bg-background-dark border-2 border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary w-full"
          />
          <button
            onClick={() => fetchByVoucher(voucherIdFilter)}
            className="bg-primary hover:bg-red-600 px-4 rounded text-white font-bold"
          >
            Search
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">{error}</div>
      ) : null}

      <div className="bg-surface-dark border border-surface-border rounded-xl flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2a1212] text-text-muted text-xs uppercase tracking-widest border-b border-surface-border">
                <th className="px-6 py-4 font-bold">Order</th>
                <th className="px-6 py-4 font-bold">Voucher</th>
                <th className="px-6 py-4 font-bold">Discount</th>
                <th className="px-6 py-4 font-bold">Applied At</th>
                <th className="px-6 py-4 font-bold">Order Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                    Loading order vouchers...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                    No records found.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr
                    key={`${item.orderId}-${item.voucherId}`}
                    className="border-b border-surface-border hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-white font-bold">{item.orderNumber}</p>
                      <p className="text-xs text-text-muted">{item.orderId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-bold">{item.voucherCode}</p>
                      <p className="text-xs text-text-muted">{item.voucherName}</p>
                    </td>
                    <td className="px-6 py-4 text-text-muted">${item.discountAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-text-muted text-sm">
                      {new Date(item.appliedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-primary/20 px-2 py-1 text-[10px] font-bold uppercase text-primary">
                        {item.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ActionMenu
                        actions={[
                          {
                            label: "Remove",
                            icon: "delete",
                            onClick: () => handleRemove(item),
                            className: "text-red-500",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {applyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-dark border border-surface-border p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-surface-border pb-4">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                Apply Voucher
              </h2>
              <button
                onClick={() => setApplyOpen(false)}
                className="text-text-muted hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleApply} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  Order
                </label>
                <select
                  value={applyForm.orderId}
                  onChange={(e) =>
                    setApplyForm((prev) => ({ ...prev, orderId: e.target.value }))
                  }
                  className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                >
                  {orderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  Voucher
                </label>
                <select
                  value={applyForm.voucherId}
                  onChange={(e) =>
                    setApplyForm((prev) => ({ ...prev, voucherId: e.target.value }))
                  }
                  className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                >
                  {voucherOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setApplyOpen(false)}
                  className="px-6 py-2 rounded font-bold uppercase tracking-wider text-text-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-wider transition-colors"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderVouchers;
