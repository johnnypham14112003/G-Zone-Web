import api from "@/lib/axios-api";

export type VoucherDiscountType = "Percentage" | "Fixed";

export interface Voucher {
  voucherId: string;
  voucherCode: string;
  voucherName: string;
  description?: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  maxUsageTotal: number;
  maxUsagePerCustomer: number;
  currentUsageCount: number;
  startDate: string;
  endDate: string;
  applicableTo?: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  createdByStaffId: string;
}

export interface VoucherRequest {
  voucherCode: string;
  voucherName: string;
  description?: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  maxUsageTotal: number;
  maxUsagePerCustomer: number;
  startDate: string;
  endDate: string;
  applicableTo?: string;
  isActive: boolean;
}

export interface VoucherQuery {
  search?: string;
  isActive?: boolean;
}

export interface PaginatedVouchers {
  items: Voucher[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPage: number;
}

const toBackendPayload = (data: VoucherRequest) => ({
  "voucher-code": data.voucherCode,
  "voucher-name": data.voucherName,
  description: data.description || "",
  "discount-type": data.discountType,
  "discount-value": data.discountValue,
  "max-discount-amount": data.maxDiscountAmount,
  "min-order-amount": data.minOrderAmount,
  "max-usage-total": data.maxUsageTotal,
  "max-usage-per-customer": data.maxUsagePerCustomer,
  "start-date": data.startDate,
  "end-date": data.endDate,
  "applicable-to": data.applicableTo || "",
  "is-active": data.isActive,
});

const toFrontend = (data: any): Voucher => ({
  voucherId: data["voucher-id"],
  voucherCode: data["voucher-code"],
  voucherName: data["voucher-name"],
  description: data["description"],
  discountType: data["discount-type"],
  discountValue: data["discount-value"],
  maxDiscountAmount: data["max-discount-amount"],
  minOrderAmount: data["min-order-amount"],
  maxUsageTotal: data["max-usage-total"],
  maxUsagePerCustomer: data["max-usage-per-customer"],
  currentUsageCount: data["current-usage-count"],
  startDate: data["start-date"],
  endDate: data["end-date"],
  applicableTo: data["applicable-to"],
  createdAt: data["created-at"],
  updatedAt: data["updated-at"],
  isActive: data["is-active"],
  createdByStaffId: data["created-by-staff-id"],
});

export const getVouchers = async (
  pageIndex = 1,
  pageSize = 10,
  query?: VoucherQuery,
): Promise<PaginatedVouchers> => {
  const params: Record<string, string | number | boolean> = {
    pageIndex,
    pageSize,
  };

  if (query?.search) {
    params.search = query.search;
  }
  if (typeof query?.isActive === "boolean") {
    params.isActive = query.isActive;
  }

  const response = await api.get("/vouchers", { params });
  const payload = response.data?.data;
  const list = payload?.["data-list"] || [];

  return {
    items: list.map(toFrontend),
    totalCount: payload?.["total-count"] || 0,
    pageIndex: payload?.["page-index"] || pageIndex,
    pageSize: payload?.["page-size"] || pageSize,
    totalPage: payload?.["total-page"] || 0,
  };
};

export const getVoucherById = async (id: string): Promise<Voucher> => {
  const response = await api.get(`/vouchers/${id}`);
  return toFrontend(response.data?.data);
};

export const getVoucherByCode = async (code: string): Promise<Voucher> => {
  const response = await api.get(`/vouchers/code/${code}`);
  return toFrontend(response.data?.data);
};

export const createVoucher = async (input: VoucherRequest): Promise<Voucher> => {
  const response = await api.post("/vouchers", toBackendPayload(input));
  return toFrontend(response.data?.data);
};

export const updateVoucher = async (
  id: string,
  input: VoucherRequest,
): Promise<boolean> => {
  const response = await api.put(`/vouchers/${id}`, toBackendPayload(input));
  return Boolean(response.data?.data);
};

export const deleteVoucher = async (id: string): Promise<boolean> => {
  const response = await api.delete(`/vouchers/${id}`);
  return Boolean(response.data?.data);
};
