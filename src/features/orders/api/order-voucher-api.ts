import api from "@/lib/axios-api";

export interface OrderVoucherRequest {
  orderId: string;
  voucherId: string;
}

const toBackendPayload = (input: OrderVoucherRequest) => ({
  "order-id": input.orderId,
  "voucher-id": input.voucherId,
});

export const applyVoucherToOrder = async (input: OrderVoucherRequest) => {
  const response = await api.post("/order-vouchers/apply", toBackendPayload(input));
  return response.data?.data;
};
