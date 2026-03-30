import api from "@/lib/axios-api";

export interface Product {
  productId: string;
  productName: string;
  sku: string;
  description: string;
  basePrice: number;
  brand: string;
  material: string;
  specifications: string;
  weight: number;
  dimension: string;
  viewCount: number;
  soldCount: number;
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  isFeatured: boolean;
  warrantyPeriodMonths: number;
  categoryId: string;
  createdAt: string;
  updatedAt?: string;
  imageUrl?: string;
}

export interface ProductRequest {
  productName: string;
  sku: string;
  description: string;
  basePrice: number;
  brand: string;
  material: string;
  specifications: string;
  weight: number;
  dimension: string;
  viewCount: number;
  soldCount: number;
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  isFeatured: boolean;
  warrantyPeriodMonths: number;
  categoryId: string;
  imageUrl?: string;
}

const mapToBackend = (data: ProductRequest) => ({
  "product-name": data.productName,
  sku: data.sku || "",
  description: data.description || "",
  "base-price": data.basePrice,
  brand: data.brand || "",
  material: data.material || "",
  specifications: data.specifications || "",
  weight: data.weight,
  dimension: data.dimension || "",
  "view-count": data.viewCount || 0,
  "sold-count": data.soldCount || 0,
  "average-rating": data.averageRating || 0,
  "total-reviews": data.totalReviews || 0,
  "is-active": data.isActive,
  "is-featured": data.isFeatured,
  "warranty-period-months": data.warrantyPeriodMonths || 0,
  "category-id": data.categoryId,  "image-url": data.imageUrl || null,});

const mapToFrontend = (data: any): Product => ({
  productId: data["product-id"],
  productName: data["product-name"],
  sku: data["sku"],
  description: data["description"],
  basePrice: data["base-price"],
  brand: data["brand"],
  material: data["material"],
  specifications: data["specifications"],
  weight: data["weight"],
  dimension: data["dimension"],
  viewCount: data["view-count"],
  soldCount: data["sold-count"],
  averageRating: data["average-rating"],
  totalReviews: data["total-reviews"],
  isActive: data["is-active"],
  isFeatured: data["is-featured"],
  warrantyPeriodMonths: data["warranty-period-months"],
  categoryId: data["category-id"],
  createdAt: data["created-at"],
  updatedAt: data["updated-at"],
  imageUrl: data["image-url"],
});

export const getProducts = async (pageNumber = 1, pageSize = 50) => {
  const response = await api.get(
    `/products?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
  const list = response.data?.data?.["data-list"] || [];
  return list.map(mapToFrontend);
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return mapToFrontend(response.data.data);
};

export const createProduct = async (product: ProductRequest) => {
  const response = await api.post("/products", mapToBackend(product));
  return mapToFrontend(response.data.data);
};

export const updateProduct = async (id: string, product: ProductRequest) => {
  const response = await api.put(`/products/${id}`, mapToBackend(product));
  return mapToFrontend(response.data.data);
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const getProductImage = async (relativeUrl: string) => {
  const response = await api.get(`/image/products/${relativeUrl}`, {
    responseType: "blob",
  });
  return response.data;
};

export const createProductImage = async (
  file: File,
  fileName: string,
  category: string = "product"
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", fileName);
  formData.append("category", category);

  const response = await api.post("/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // { success, path }
};