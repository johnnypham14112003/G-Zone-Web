import api from "@/lib/axios-api";

export interface UserVoucher {
  accountId: string;
  voucherId: string;
  isUsed: boolean;
  voucherCode: string;
  voucherName: string;
  discountType: string;
  discountValue: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const toFrontend = (data: any): UserVoucher => ({
  accountId: data["account-id"],
  voucherId: data["voucher-id"],
  isUsed: data["is-used"],
  voucherCode: data["voucher-code"],
  voucherName: data["voucher-name"],
  discountType: data["discount-type"],
  discountValue: data["discount-value"],
  maxDiscountAmount: data["max-discount-amount"],
  minOrderAmount: data["min-order-amount"],
  startDate: data["start-date"],
  endDate: data["end-date"],
  isActive: data["is-active"],
});

export const getMyUserVouchers = async (): Promise<UserVoucher[]> => {
  const response = await api.get("/user-vouchers/my-vouchers");
  const list = response.data?.data || [];
  return list.map(toFrontend);
};
