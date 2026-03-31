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

export interface UserVoucherRequest {
  accountId: string;
  voucherId: string;
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

const toBackendPayload = (input: UserVoucherRequest) => ({
  "account-id": input.accountId,
  "voucher-id": input.voucherId,
});

export const getMyUserVouchers = async (): Promise<UserVoucher[]> => {
  const response = await api.get("/user-vouchers/my-vouchers");
  const list = response.data?.data || [];
  return list.map(toFrontend);
};

export const getUserVouchersByAccount = async (
  accountId: string,
): Promise<UserVoucher[]> => {
  const response = await api.get(`/user-vouchers/account/${accountId}`);
  const list = response.data?.data || [];
  return list.map(toFrontend);
};

export const getAccountsByVoucher = async (
  voucherId: string,
): Promise<UserVoucher[]> => {
  const response = await api.get(`/user-vouchers/voucher/${voucherId}/accounts`);
  const list = response.data?.data || [];
  return list.map(toFrontend);
};

export const assignVoucherToUser = async (
  input: UserVoucherRequest,
): Promise<boolean> => {
  const response = await api.post("/user-vouchers/assign", toBackendPayload(input));
  return Boolean(response.data?.data);
};

export const revokeVoucherFromUser = async (
  input: UserVoucherRequest,
): Promise<boolean> => {
  const response = await api.delete("/user-vouchers/revoke", {
    data: toBackendPayload(input),
  });
  return Boolean(response.data?.data);
};
