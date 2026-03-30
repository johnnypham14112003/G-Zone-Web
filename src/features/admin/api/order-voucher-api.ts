import api from "@/lib/axios-api";

export interface OrderVoucher {
  orderId: string;
  voucherId: string;
  discountAmount: number;
  appliedAt: string;
  voucherCode: string;
  voucherName: string;
  discountType: string;
  discountValue: number;
  orderNumber: string;
  orderTotalAmount: number;
  orderStatus: string;
}

export interface OrderVoucherRequest {
  orderId: string;
  voucherId: string;
}

const toFrontend = (data: any): OrderVoucher => ({
  orderId: data["order-id"],
  voucherId: data["voucher-id"],
  discountAmount: data["discount-amount"],
  appliedAt: data["applied-at"],
  voucherCode: data["voucher-code"],
  voucherName: data["voucher-name"],
  discountType: data["discount-type"],
  discountValue: data["discount-value"],
  orderNumber: data["order-number"],
  orderTotalAmount: data["order-total-amount"],
  orderStatus: data["order-status"],
});

const toBackendPayload = (input: OrderVoucherRequest) => ({
  "order-id": input.orderId,
  "voucher-id": input.voucherId,
});

export const getVouchersByOrder = async (orderId: string): Promise<OrderVoucher[]> => {
  const response = await api.get(`/order-vouchers/order/${orderId}`);
  const list = response.data?.data || [];
  return list.map(toFrontend);
};

export const getOrdersByVoucher = async (
  voucherId: string,
): Promise<OrderVoucher[]> => {
  const response = await api.get(`/order-vouchers/voucher/${voucherId}/orders`);
  const list = response.data?.data || [];
  return list.map(toFrontend);
};

export const applyVoucherToOrder = async (
  input: OrderVoucherRequest,
): Promise<OrderVoucher> => {
  const response = await api.post("/order-vouchers/apply", toBackendPayload(input));
  return toFrontend(response.data?.data);
};

export const removeVoucherFromOrder = async (
  input: OrderVoucherRequest,
): Promise<boolean> => {
  const response = await api.delete("/order-vouchers/remove", {
    data: toBackendPayload(input),
  });
  return Boolean(response.data?.data);
};
