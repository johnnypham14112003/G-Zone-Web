
import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct, createProduct, updateProduct, Product, ProductRequest, getProductImage } from "../api/product-api";
import { getCategories, Category } from "../api/category-api";
import ProductModal from "../components/ProductModal";

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});


  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodData, catData] = await Promise.all([
        getProducts(1, 100),
        getCategories(1, 100)
      ]);
      setProducts(prodData || []);
      setCategories(catData || []);
      setError(null);
    } catch (err: any) {
      console.error("Failed to load data", err);
      setError("Failed to load products or categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      const map: Record<string, string> = {};

      await Promise.all(
        products.map(async (p) => {
          try {
            const blob = await getProductImage(p.productId+'.jpg');
            const url = URL.createObjectURL(blob);
            map[p.productId] = url;
          } catch (err) {
            console.error("Failed to load image", err);
          }
        })
      );

      setImageMap(map);
    };

    if (products.length) loadImages();
  }, [products]);


  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      fetchData();
    } catch (err: any) {
      alert("Failed to delete product");
      console.error(err);
    }
  };

  const handleOpenModal = (product?: Product) => {
    setSelectedProduct(product || null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (data: ProductRequest, id?: string) => {
    if (id) {
      await updateProduct(id, data);
    } else {
      await createProduct(data);
    }
    fetchData();
  };

  const getCategoryName = (id: string) => {
    return categories.find(c => c.categoryId === id)?.categoryName || "Unknown";
  };

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">Products</h1>
          <p className="text-text-muted">Manage store inventory and items.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          New Product
        </button>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      ) : (
        <div className="bg-surface-dark border border-surface-border rounded-xl flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#2a1212] text-text-muted text-xs uppercase tracking-widest border-b border-surface-border">
                  <th className="px-6 py-4 font-bold">Product Name</th>
                  <th className="px-6 py-4 font-bold">Image</th>
                  <th className="px-6 py-4 font-bold">SKU</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Price</th>
                  <th className="px-6 py-4 font-bold text-center">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-text-muted">Loading products...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-text-muted">No products found.</td>
                  </tr>
                ) : (
                  products.map((prod) => (
                    <tr key={prod.productId} className="border-b border-surface-border hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-white font-bold">{prod.productName}</p>
                        {prod.brand && <p className="text-xs text-text-muted mt-0.5">{prod.brand}</p>}
                      </td>
                      <td className="px-6 py-4">
                        {prod.imageUrl ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL}/image/${prod.imageUrl}`}
                            alt={prod.productName}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <span className="text-xs text-text-muted">No Image</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-text-muted">{prod.sku}</td>
                      <td className="px-6 py-4 text-text-muted">{getCategoryName(prod.categoryId)}</td>
                      <td className="px-6 py-4 text-white">${prod.basePrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        {prod.isActive ? (
                          <span className="bg-green-500/10 text-green-500 text-[10px] font-bold uppercase px-2 py-1 rounded">Active</span>
                        ) : (
                          <span className="bg-gray-500/10 text-gray-500 text-[10px] font-bold uppercase px-2 py-1 rounded">Inactive</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(prod)}
                            className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors flex flex-col items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(prod.productId)}
                            className="w-8 h-8 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex flex-col items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pop-up for Create / Edit */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={selectedProduct}
        categories={categories}
      />
    </div>
  );
};

export default AdminProducts;

