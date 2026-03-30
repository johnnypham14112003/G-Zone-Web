import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "@/providers/ToastProvider";
import { getMyUserVouchers, UserVoucher } from "@/features/accounts/api/user-voucher-api";
import {
  clearSelectedVoucher,
  getSelectedVoucher,
  setSelectedVoucher,
} from "@/lib/selected-voucher";

const MyVouchers: React.FC = () => {
  const [vouchers, setVouchers] = useState<UserVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const data = await getMyUserVouchers();
      setVouchers(data || []);
    } catch (err: any) {
      console.error(err);
      showToast(err?.response?.data?.message || "Failed to load vouchers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();

    const selected = getSelectedVoucher();
    setSelectedVoucherId(selected?.voucherId || null);
  }, []);

  const now = Date.now();

  const availableVouchers = useMemo(() => {
    return vouchers.filter((item) => {
      const start = new Date(item.startDate).getTime();
      const end = new Date(item.endDate).getTime();
      return item.isActive && !item.isUsed && now >= start && now <= end;
    });
  }, [vouchers, now]);

  const handleChooseVoucher = (voucher: UserVoucher) => {
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

    setSelectedVoucherId(voucher.voucherId);
    showToast("Voucher selected for checkout", "success");
  };

  const handleClearSelected = () => {
    clearSelectedVoucher();
    setSelectedVoucherId(null);
    showToast("Selected voucher cleared", "info");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">My Vouchers</h1>
          <p className="mt-2 text-text-muted">Choose a voucher to auto-apply on checkout.</p>
        </div>
        <button
          type="button"
          onClick={handleClearSelected}
          className="rounded border border-surface-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-muted hover:border-primary hover:text-white"
        >
          Clear Selected
        </button>
      </div>

      <div className="rounded-xl border border-surface-border bg-surface-dark p-6">
        {loading ? (
          <p className="py-8 text-center text-text-muted">Loading vouchers...</p>
        ) : availableVouchers.length === 0 ? (
          <p className="py-8 text-center text-text-muted">No available vouchers right now.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {availableVouchers.map((voucher) => {
              const isSelected = selectedVoucherId === voucher.voucherId;

              return (
                <div
                  key={`${voucher.accountId}-${voucher.voucherId}`}
                  className={`rounded-lg border p-4 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-surface-border bg-background-dark"
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-white">{voucher.voucherCode}</h2>
                      <p className="text-sm text-text-muted">{voucher.voucherName}</p>
                    </div>
                    <span className="rounded bg-green-500/10 px-2 py-1 text-[10px] font-bold uppercase text-green-400">
                      Available
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-text-muted">
                    <p>
                      Discount: {voucher.discountType === "Percentage"
                        ? `${voucher.discountValue}%`
                        : `$${voucher.discountValue.toFixed(2)}`}
                    </p>
                    <p>Min Order: ${voucher.minOrderAmount.toFixed(2)}</p>
                    <p>Expire: {new Date(voucher.endDate).toLocaleString()}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleChooseVoucher(voucher)}
                    className={`mt-4 w-full rounded px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                      isSelected
                        ? "bg-primary text-white"
                        : "border border-surface-border text-text-muted hover:border-primary hover:text-white"
                    }`}
                  >
                    {isSelected ? "Selected" : "Use This Voucher"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVouchers;
