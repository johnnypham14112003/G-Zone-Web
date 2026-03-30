export interface SelectedVoucher {
  voucherId: string;
  voucherCode: string;
  voucherName: string;
  discountType: string;
  discountValue: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  startDate: string;
  endDate: string;
}

const SELECTED_VOUCHER_KEY = "gzone_selected_voucher";

const notifySelectedVoucherChanged = () => {
  window.dispatchEvent(new Event("voucher:selected"));
};

export const getSelectedVoucher = (): SelectedVoucher | null => {
  try {
    const raw = localStorage.getItem(SELECTED_VOUCHER_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setSelectedVoucher = (voucher: SelectedVoucher) => {
  localStorage.setItem(SELECTED_VOUCHER_KEY, JSON.stringify(voucher));
  notifySelectedVoucherChanged();
};

export const clearSelectedVoucher = () => {
  localStorage.removeItem(SELECTED_VOUCHER_KEY);
  notifySelectedVoucherChanged();
};
