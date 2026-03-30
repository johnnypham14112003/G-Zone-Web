import React, { useEffect, useMemo, useState } from "react";
import { Voucher, VoucherDiscountType, VoucherRequest } from "../api/voucher-api";

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VoucherRequest, id?: string) => Promise<void>;
  initialData?: Voucher | null;
}

const toLocalInputDateTime = (value: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const timezoneOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(date.getTime() - timezoneOffsetMs);
  return localDate.toISOString().slice(0, 16);
};

const VoucherModal: React.FC<VoucherModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<VoucherRequest>({
    voucherCode: "",
    voucherName: "",
    description: "",
    discountType: "Percentage",
    discountValue: 0,
    maxDiscountAmount: 0,
    minOrderAmount: 0,
    maxUsageTotal: 0,
    maxUsagePerCustomer: 0,
    startDate: "",
    endDate: "",
    applicableTo: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        voucherCode: initialData.voucherCode,
        voucherName: initialData.voucherName,
        description: initialData.description || "",
        discountType: initialData.discountType,
        discountValue: initialData.discountValue,
        maxDiscountAmount: initialData.maxDiscountAmount,
        minOrderAmount: initialData.minOrderAmount,
        maxUsageTotal: initialData.maxUsageTotal,
        maxUsagePerCustomer: initialData.maxUsagePerCustomer,
        startDate: toLocalInputDateTime(initialData.startDate),
        endDate: toLocalInputDateTime(initialData.endDate),
        applicableTo: initialData.applicableTo || "",
        isActive: initialData.isActive,
      });
      return;
    }

    setFormData({
      voucherCode: "",
      voucherName: "",
      description: "",
      discountType: "Percentage",
      discountValue: 0,
      maxDiscountAmount: 0,
      minOrderAmount: 0,
      maxUsageTotal: 0,
      maxUsagePerCustomer: 0,
      startDate: "",
      endDate: "",
      applicableTo: "",
      isActive: true,
    });
  }, [initialData, isOpen]);

  const validationMessage = useMemo(() => {
    if (!formData.startDate || !formData.endDate) {
      return "Please select both start date and end date.";
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (end <= start) {
      return "End date must be after start date.";
    }

    if (formData.maxUsagePerCustomer > formData.maxUsageTotal) {
      return "Max usage per customer cannot exceed max usage total.";
    }

    return "";
  }, [formData]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }

    if (
      [
        "discountValue",
        "maxDiscountAmount",
        "minOrderAmount",
        "maxUsageTotal",
        "maxUsagePerCustomer",
      ].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value) || 0,
      }));
      return;
    }

    if (name === "discountType") {
      setFormData((prev) => ({
        ...prev,
        discountType: value as VoucherDiscountType,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validationMessage) {
      alert(validationMessage);
      return;
    }

    setLoading(true);
    try {
      await onSave(formData, initialData?.voucherId);
      onClose();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to save voucher.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10">
      <div className="bg-surface-dark border border-surface-border p-6 rounded-xl w-full max-w-4xl shadow-2xl my-auto">
        <div className="flex justify-between items-center mb-6 border-b border-surface-border pb-4">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
            {initialData ? "Edit Voucher" : "New Voucher"}
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Voucher Code *
              </label>
              <input
                type="text"
                name="voucherCode"
                value={formData.voucherCode}
                onChange={handleChange}
                required
                maxLength={50}
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. NEWYEAR2026"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Voucher Name *
              </label>
              <input
                type="text"
                name="voucherName"
                value={formData.voucherName}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. New Year Sale"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Short description for this voucher"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Discount Type *
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="Percentage">Percentage</option>
                <option value="Fixed">Fixed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Applicable To
              </label>
              <input
                type="text"
                name="applicableTo"
                value={formData.applicableTo}
                onChange={handleChange}
                maxLength={50}
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. All, Accessories"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Discount Value *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Max Discount *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="maxDiscountAmount"
                value={formData.maxDiscountAmount}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Min Order Amount *
              </label>
              <input
                type="number"
                min="0"
                name="minOrderAmount"
                value={formData.minOrderAmount}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Max Usage Total *
              </label>
              <input
                type="number"
                min="0"
                name="maxUsageTotal"
                value={formData.maxUsageTotal}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Max Usage / Customer *
              </label>
              <input
                type="number"
                min="0"
                name="maxUsagePerCustomer"
                value={formData.maxUsagePerCustomer}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Start Date *
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                End Date *
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {validationMessage && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {validationMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              Status
            </label>
            <div className="flex items-center h-[50px] px-4 bg-[#2a1212] border border-surface-border rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-white text-sm font-medium">Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 rounded font-bold uppercase tracking-wider text-text-muted hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || Boolean(validationMessage)}
              className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Voucher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherModal;
