import api from "@/lib/axios-api";

/* ===================== TYPES ===================== */

export interface Customization {
  customId: string;
  name: string;
  sku: string;
  color: string;
  size: string;
  quotedPrice: number;
  status: string;
  createdAt: string;
  customerId: string;
  productId: string;
  customerName: string;
  staffName?: string;
  productName: string;
}

export interface CustomizationCreateRequest {
  name: string;
  sku: string;
  color: string;
  size: string;
  weight: number;
  staffNote: string;
  customerId: string;
  productId: string;
}

export interface CustomizationUpdateRequest {
  name: string;
  color: string;
  size: string;
  weight: number;
  quotedPrice: number;
  staffNote: 'staff note is currently empty';
  status: string;
  confirmedByStaffId?: string;
}

export interface CustomizationQuery {
  keyword?: string;
  customerId?: string;
  productId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
}

/* ===================== MAPPING ===================== */

const mapToFrontend = (data: any): Customization => ({
  customId: data["custom-id"],
  name: data["name"],
  sku: data["sku"],
  color: data["color"],
  size: data["size"],
  quotedPrice: data["quoted-price"],
  status: data["status"],
  createdAt: data["created-at"],
  customerId: data["customer-id"],
  productId: data["product-id"],
  customerName: data["customer-name"],
  staffName: data["staff-name"],
  productName: data["product-name"],
});

/* ===================== API ===================== */

const BASE_URL = "/customization";

/* GET LIST */
export const getCustomizations = async (
  pageIndex = 1,
  pageSize = 10,
  query?: CustomizationQuery
) => {
  const params = new URLSearchParams();

  params.append("pageIndex", pageIndex.toString());
  params.append("pageSize", pageSize.toString());

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const response = await api.get(`${BASE_URL}?${params.toString()}`);

  const list = response.data?.data?.["data-list"] || [];

  return list.map(mapToFrontend);
};

/* GET BY ID */
export const getCustomizationById = async (id: string) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return mapToFrontend(response.data.data);
};

/* CREATE */
export const createCustomization = async (
  data: CustomizationCreateRequest
) => {
  const response = await api.post(BASE_URL, data);
  return mapToFrontend(response.data.data);
};

/* UPDATE */
export const updateCustomization = async (
  id: string,
  data: CustomizationUpdateRequest
) => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return mapToFrontend(response.data.data);
};

/* DELETE */
export const deleteCustomization = async (id: string) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export const getCustomizationByProductAndCustomer = async (
  productId: string,
  customerId: string
) => {
  const list = await getCustomizations(1, 1, {
    productId,
    customerId,
  });

  return list[0] || null;
};