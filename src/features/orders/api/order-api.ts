import api from "@/lib/axios-api";

export interface OrderDetailItemRequest {
  productVariantId?: string;
  customizationId?: string;
  productName: string;
  variantInfo: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  isCustomDesign: boolean;
  customDesignNote?: string;
  customDesignImage?: string;
  warrantyPeriodMonths: number;
}

export interface OrderRequest {
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingWard: string;
  receiverName: string;
  receiverPhone: string;
  paymentMethod: string;
  wholeSale: boolean;
  note?: string;
  orderDetails: OrderDetailItemRequest[];
}

export interface OrderDetail {
  orderDetailId: string;
  productName: string;
  variantInfo: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalPrice: number;
  status: string;
}

export interface Order {
  orderId: string;
  orderNumber: string;
  customerId: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingWard: string;
  note: string;
  createdAt: string;
  orderDetails: OrderDetail[];
}

export interface OrderPatchRequest {
  status?: string;
  paymentStatus?: string;
  cancellationReason?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  managedByStaffId?: string;
}

const mapOrderDetailRequestToBackend = (item: OrderDetailItemRequest) => ({
  "product-variant-id": item.productVariantId ?? null,
  "customization-id": item.customizationId ?? null,
  "product-name": item.productName,
  "variant-info": item.variantInfo,
  quantity: item.quantity,
  "unit-price": item.unitPrice,
  "discount-amount": item.discountAmount,
  "is-custom-design": item.isCustomDesign,
  "custom-design-note": item.customDesignNote ?? "",
  "custom-design-image": item.customDesignImage ?? "",
  "warranty-period-months": item.warrantyPeriodMonths,
});

const mapOrderRequestToBackend = (order: OrderRequest) => ({
  "shipping-address": order.shippingAddress,
  "shipping-city": order.shippingCity,
  "shipping-district": order.shippingDistrict,
  "shipping-ward": order.shippingWard,
  "receiver-name": order.receiverName,
  "receiver-phone": order.receiverPhone,
  "payment-method": order.paymentMethod,
  "whole-sale": order.wholeSale,
  note: order.note ?? "",
  "order-details": order.orderDetails.map(mapOrderDetailRequestToBackend),
});

const mapOrderDetailFromBackend = (item: any): OrderDetail => ({
  orderDetailId: item["order-detail-id"],
  productName: item["product-name"],
  variantInfo: item["variant-info"],
  quantity: item.quantity,
  unitPrice: item["unit-price"],
  discountAmount: item["discount-amount"],
  totalPrice: item["total-price"],
  status: item.status,
});

const mapOrderFromBackend = (data: any): Order => ({
  orderId: data["order-id"],
  orderNumber: data["order-number"],
  customerId: data["customer-id"],
  status: data.status,
  paymentStatus: data["payment-status"],
  paymentMethod: data["payment-method"],
  subtotal: data.subtotal,
  shippingFee: data["shipping-fee"],
  taxAmount: data["tax-amount"],
  totalAmount: data["total-amount"],
  receiverName: data["receiver-name"],
  receiverPhone: data["receiver-phone"],
  shippingAddress: data["shipping-address"],
  shippingCity: data["shipping-city"],
  shippingDistrict: data["shipping-district"],
  shippingWard: data["shipping-ward"],
  note: data.note,
  createdAt: data["created-at"],
  orderDetails: (data["order-details"] || []).map(mapOrderDetailFromBackend),
});

const mapOrderPatchToBackend = (patch: OrderPatchRequest) => ({
  status: patch.status,
  paymentStatus: patch.paymentStatus,
  cancellationReason: patch.cancellationReason,
  trackingNumber: patch.trackingNumber,
  estimatedDelivery: patch.estimatedDelivery,
  managedByStaffId: patch.managedByStaffId,
});

const toQuery = (query?: Record<string, string | number | undefined>) => {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const raw = params.toString();
  return raw ? `&${raw}` : "";
};

export const getOrders = async (
  pageNumber = 1,
  pageSize = 20,
  query?: Record<string, string | number | undefined>,
) => {
  const response = await api.get(
    `/orders?pageNumber=${pageNumber}&pageSize=${pageSize}${toQuery(query)}`,
  );

  const payload = response.data?.data;
  const list = payload?.["data-list"] || [];

  return {
    items: list.map(mapOrderFromBackend),
    totalCount: payload?.["total-count"] || 0,
    pageIndex: payload?.["page-index"] || pageNumber,
    pageSize: payload?.["page-size"] || pageSize,
  };
};

export const getMyOrders = async (pageNumber = 1, pageSize = 20) => {
  const response = await api.get(
    `/orders/my-orders?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );

  const payload = response.data?.data;
  const list = payload?.["data-list"] || [];

  return {
    items: list.map(mapOrderFromBackend),
    totalCount: payload?.["total-count"] || 0,
    pageIndex: payload?.["page-index"] || pageNumber,
    pageSize: payload?.["page-size"] || pageSize,
  };
};

export const createOrder = async (order: OrderRequest) => {
  const response = await api.post("/orders", mapOrderRequestToBackend(order));
  return mapOrderFromBackend(response.data.data);
};

export const patchOrder = async (orderId: string, patch: OrderPatchRequest) => {
  const response = await api.patch(
    `/orders/${orderId}`,
    mapOrderPatchToBackend(patch),
  );
  return response.data;
};
