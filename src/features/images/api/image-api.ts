import api from "@/lib/axios-api";

export interface UploadImageResponse {
  success: boolean;
  path?: string;
  message?: string;
}

export const uploadImage = async (file: File, fileName: string, category: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", fileName);
  formData.append("category", category);

  const response = await api.post<UploadImageResponse>("/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteImageByPath = async (relativePath: string) => {
  const response = await api.delete<UploadImageResponse>(`/image/${relativePath}`);
  return response.data;
};

export const getImageBlob = async (relativePath: string) => {
  const response = await api.get(`/image/${relativePath}`, {
    responseType: "blob",
  });
  return response.data as Blob;
};
