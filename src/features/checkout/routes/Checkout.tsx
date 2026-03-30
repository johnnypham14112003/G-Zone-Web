import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { clearCart, getCart, getCartSubtotal } from "@/lib/cart";
import { createOrder } from "@/features/orders/api/order-api";
import { getMyUserVouchers, UserVoucher } from "@/features/accounts/api/user-voucher-api";
import { applyVoucherToOrder } from "@/features/orders/api/order-voucher-api";
import {
  clearSelectedVoucher,
  getSelectedVoucher,
  setSelectedVoucher,
} from "@/lib/selected-voucher";
import { useToast } from "@/providers/ToastProvider";

const Checkout: React.FC = () => {
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingDistrict, setShippingDistrict] = useState("");
  const [shippingWard, setShippingWard] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ orderNumber: string } | null>(null);
  const [myVouchers, setMyVouchers] = useState<UserVoucher[]>([]);
  const [voucherLoading, setVoucherLoading] = useState(true);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>("");
  const { showToast } = useToast();

  const cartItems = useMemo(() => getCart(), []);
  const subtotal = useMemo(() => getCartSubtotal(cartItems), [cartItems]);
  const shippingFee = subtotal > 0 ? 1.5 : 0;

  useEffect(() => {
    const syncVouchers = async () => {
      try {
        setVoucherLoading(true);
        const data = await getMyUserVouchers();
        setMyVouchers(data || []);

        const selected = getSelectedVoucher();
        setSelectedVoucherId(selected?.voucherId || "");
      } catch (err: any) {
        console.error(err);
      } finally {
        setVoucherLoading(false);
      }
    };

    syncVouchers();
  }, []);

  const availableVouchers = useMemo(() => {
    const now = Date.now();
    return myVouchers.filter((voucher) => {
      const start = new Date(voucher.startDate).getTime();
      const end = new Date(voucher.endDate).getTime();
      return voucher.isActive && !voucher.isUsed && now >= start && now <= end;
    });
  }, [myVouchers]);

  const selectedVoucher = useMemo(() => {
    if (!selectedVoucherId) {
      return null;
    }
    return availableVouchers.find((voucher) => voucher.voucherId === selectedVoucherId) || null;
  }, [availableVouchers, selectedVoucherId]);

  const voucherDiscount = useMemo(() => {
    if (!selectedVoucher) {
      return 0;
    }

    if (subtotal < selectedVoucher.minOrderAmount) {
      return 0;
    }

    if (selectedVoucher.discountType === "Percentage") {
      const percentageDiscount = (subtotal * selectedVoucher.discountValue) / 100;
      return Math.min(percentageDiscount, selectedVoucher.maxDiscountAmount);
    }

    return Math.min(selectedVoucher.discountValue, subtotal);
  }, [selectedVoucher, subtotal]);

  const total = Math.max(0, subtotal + shippingFee - voucherDiscount);

  const handleVoucherChange = (voucherId: string) => {
    setSelectedVoucherId(voucherId);

    if (!voucherId) {
      clearSelectedVoucher();
      return;
    }

    const voucher = availableVouchers.find((item) => item.voucherId === voucherId);
    if (!voucher) {
      return;
    }

    setSelectedVoucher({
      voucherId: voucher.voucherId,
      voucherCode: voucher.voucherCode,
      voucherName: voucher.voucherName,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      maxDiscountAmount: voucher.maxDiscountAmount,
      minOrderAmount: voucher.minOrderAmount,
      startDate: voucher.startDate,
      endDate: voucher.endDate,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (paymentMethod !== "COD") {
      alert("Online payment will be implemented in a later phase. Please use COD for now.");
      return;
    }

    if (selectedVoucher && subtotal < selectedVoucher.minOrderAmount) {
      alert(
        `Selected voucher requires minimum order of $${selectedVoucher.minOrderAmount.toFixed(2)}.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        shippingAddress,
        shippingCity,
        shippingDistrict,
        shippingWard,
        receiverName,
        receiverPhone,
        paymentMethod: "COD",
        wholeSale: false,
        note,
        orderDetails: cartItems.map((item) => ({
          productName: item.productName,
          variantInfo: item.sku,
          quantity: item.quantity,
          unitPrice: item.basePrice,
          discountAmount: 0,
          isCustomDesign: false,
          warrantyPeriodMonths: item.warrantyPeriodMonths || 0,
        })),
      });

      if (selectedVoucher) {
        try {
          await applyVoucherToOrder({
            orderId: order.orderId,
            voucherId: selectedVoucher.voucherId,
          });
          showToast("Voucher applied to your order", "success");
        } catch (voucherError: any) {
          console.error(voucherError?.response?.data || voucherError);
          showToast(
            voucherError?.response?.data?.message ||
              "Order placed, but voucher could not be applied",
            "error",
          );
        }
      }

      clearCart();
      clearSelectedVoucher();
      setOrderSuccess({ orderNumber: order.orderNumber });
    } catch (error: any) {
      console.error(error.response?.data || error);
      alert(error.response?.data?.message || "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14">
        <div className="rounded-xl border border-green-700/40 bg-green-500/10 p-8 text-center">
          <h1 className="mb-3 text-3xl font-black uppercase text-white">Order Placed</h1>
          <p className="mb-4 text-text-muted">Your COD order has been created successfully.</p>
          <p className="mb-8 text-lg font-bold text-green-400">Order Number: {orderSuccess.orderNumber}</p>
          <div className="flex justify-center gap-3">
            <Link to="/shop" className="rounded bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-600">Continue Shopping</Link>
            <Link to="/profile/orders" className="rounded border border-surface-border px-4 py-2 text-sm font-bold uppercase tracking-wider text-white hover:border-primary">Track My Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-12">
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white">Checkout</h1>
          <p className="mt-2 text-text-muted">Phase 4 COD checkout is now active.</p>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-dark p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Shipping Info</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input value={receiverName} onChange={(e) => setReceiverName(e.target.value)} required placeholder="Receiver name" className="h-11 rounded border border-surface-border bg-[#1a1a1a] px-3 text-white" />
            <input value={receiverPhone} onChange={(e) => setReceiverPhone(e.target.value)} required placeholder="Receiver phone" className="h-11 rounded border border-surface-border bg-[#1a1a1a] px-3 text-white" />
            <input value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} required placeholder="City" className="h-11 rounded border border-surface-border bg-[#1a1a1a] px-3 text-white" />
            <input value={shippingDistrict} onChange={(e) => setShippingDistrict(e.target.value)} required placeholder="District" className="h-11 rounded border border-surface-border bg-[#1a1a1a] px-3 text-white" />
            <input value={shippingWard} onChange={(e) => setShippingWard(e.target.value)} required placeholder="Ward" className="h-11 rounded border border-surface-border bg-[#1a1a1a] px-3 text-white" />
            <input value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required placeholder="Street address" className="h-11 rounded border border-surface-border bg-[#1a1a1a] px-3 text-white" />
          </div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Order note (optional)" className="w-full rounded border border-surface-border bg-[#1a1a1a] p-3 text-white" />
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-dark p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Payment</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("COD")}
              className={`rounded border px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${paymentMethod === "COD" ? "border-primary bg-primary/20 text-white" : "border-surface-border text-text-muted hover:text-white"}`}
            >
              Cash On Delivery
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("ONLINE")}
              className={`rounded border px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${paymentMethod === "ONLINE" ? "border-primary bg-primary/20 text-white" : "border-surface-border text-text-muted hover:text-white"}`}
            >
              Online (Later)
            </button>
          </div>
          {paymentMethod === "ONLINE" && (
            <p className="text-xs text-yellow-300">Online payment integration is planned for the next phase.</p>
          )}
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-dark p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Voucher</h2>
            <Link
              to="/profile/vouchers"
              className="text-xs font-bold uppercase tracking-wider text-text-muted hover:text-white"
            >
              Manage My Vouchers
            </Link>
          </div>

          {voucherLoading ? (
            <p className="text-sm text-text-muted">Loading vouchers...</p>
          ) : availableVouchers.length === 0 ? (
            <p className="text-sm text-text-muted">No available vouchers. You can continue without voucher.</p>
          ) : (
            <select
              value={selectedVoucherId}
              onChange={(e) => handleVoucherChange(e.target.value)}
              className="w-full rounded border border-surface-border bg-[#1a1a1a] px-3 py-3 text-white"
            >
              <option value="">No voucher</option>
              {availableVouchers.map((voucher) => (
                <option key={voucher.voucherId} value={voucher.voucherId}>
                  {voucher.voucherCode} - {voucher.voucherName}
                </option>
              ))}
            </select>
          )}

          {selectedVoucher && (
            <div className="rounded border border-surface-border bg-black/20 p-3 text-xs text-text-muted space-y-1">
              <p>
                Selected: <span className="font-bold text-white">{selectedVoucher.voucherCode}</span>
              </p>
              <p>
                Min order: ${selectedVoucher.minOrderAmount.toFixed(2)}
              </p>
              <p>
                Estimated discount: <span className="font-bold text-green-400">-${voucherDiscount.toFixed(2)}</span>
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="h-12 rounded bg-primary px-6 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-600 disabled:opacity-60"
        >
          {submitting ? "Placing Order..." : "Place COD Order"}
        </button>
      </form>

      <div className="lg:col-span-5">
        <div className="sticky top-24 rounded-xl border border-surface-border bg-surface-dark p-6">
          <h3 className="mb-4 text-lg font-black uppercase text-white">Order Summary</h3>
          <div className="space-y-3 max-h-72 overflow-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-start justify-between border-b border-white/5 pb-3">
                <div>
                  <p className="text-sm font-bold text-white">{item.productName}</p>
                  <p className="text-xs text-text-muted">{item.sku} x{item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-white">${(item.basePrice * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between text-text-muted"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-text-muted"><span>Shipping</span><span>${shippingFee.toFixed(2)}</span></div>
            <div className="flex justify-between text-text-muted"><span>Voucher Discount</span><span>-${voucherDiscount.toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-surface-border pt-3 text-base font-bold text-white"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
