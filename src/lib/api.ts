// Lấy URL từ biến môi trường
const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // Xử lý lỗi ở đây
  }
}
