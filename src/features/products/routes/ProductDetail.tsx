import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Product, getProductById, getProducts } from '@/features/admin/api/product-api';
import { addToCart } from '@/lib/cart';
import { useToast } from '@/providers/ToastProvider';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) { navigate('/shop'); return; }

    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
        // Load related (same category, exclude self)
        const all = await getProducts(1, 20);
        setRelated(all.filter((p) => p.categoryId === data.categoryId && p.productId !== data.productId && p.isActive).slice(0, 4));
      } catch (error) {
        console.error('Failed to load product', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const addItem = () => {
    if (!product) return;
    addToCart({
      productId: product.productId,
      productName: product.productName,
      sku: product.sku,
      basePrice: product.basePrice,
      quantity: qty,
      categoryId: product.categoryId,
      warrantyPeriodMonths: product.warrantyPeriodMonths,
      imageUrl: product.imageUrl,
    });
    setAdded(true);
    showToast(`"${product.productName}" added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  const buyNow = () => {
    if (!product) return;
    addToCart({
      productId: product.productId,
      productName: product.productName,
      sku: product.sku,
      basePrice: product.basePrice,
      quantity: qty,
      categoryId: product.categoryId,
      warrantyPeriodMonths: product.warrantyPeriodMonths,
      imageUrl: product.imageUrl,
    });
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 aspect-[4/3] rounded-xl bg-surface-dark animate-pulse" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-6 w-32 rounded bg-surface-dark animate-pulse" />
            <div className="h-10 w-3/4 rounded bg-surface-dark animate-pulse" />
            <div className="h-20 rounded bg-surface-dark animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 flex flex-col items-center text-center">
        <span className="material-symbols-outlined text-6xl text-white/15 mb-4">search_off</span>
        <h2 className="text-2xl font-bold text-white mb-2">Product not found</h2>
        <Link to="/shop" className="mt-4 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-red-600 transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-2 py-4 mb-4 text-sm font-medium">
        <Link to="/" className="text-text-muted hover:text-white transition-colors">Home</Link>
        <span className="text-text-muted">/</span>
        <Link to="/shop" className="text-text-muted hover:text-white transition-colors">Shop</Link>
        <span className="text-text-muted">/</span>
        <span className="text-primary truncate max-w-xs">{product.productName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Image panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-dark border border-[#3a1a1a] flex items-center justify-center">
            {product.isFeatured && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">Featured</span>
              </div>
            )}
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.productName} className="w-full h-full object-contain" />
            ) : (
              <span className="material-symbols-outlined text-9xl text-white/20">inventory_2</span>
            )}
          </div>
          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: 'local_shipping', label: 'COD Available' },
              { icon: 'verified', label: 'Verified Gear' },
              { icon: 'support_agent', label: 'Live Support' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-dark px-3 py-2 text-xs text-text-muted">
                <span className="material-symbols-outlined text-primary text-base">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Info panel */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-24 flex flex-col gap-5 bg-surface-dark p-6 md:p-8 rounded-xl border border-[#3a1a1a] shadow-2xl shadow-black/50">
            <div className="border-b border-[#3a1a1a] pb-5">
              <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">{product.brand || 'G-Zone Collection'}</p>
              <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-3">{product.productName}</h1>
              <p className="text-[#a0a0a0] text-sm leading-relaxed mb-4">{product.description || 'Premium motorcycle gear — built for the road.'}</p>
              <div className="flex items-center gap-3">
                <span className="text-primary text-3xl font-black">${product.basePrice.toFixed(2)}</span>
                <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${product.isActive ? 'bg-green-500/15 text-green-300' : 'bg-red-500/15 text-red-300'}`}>
                  {product.isActive ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
              {[
                { label: 'SKU', value: product.sku },
                { label: 'Material', value: product.material || 'N/A' },
                { label: 'Weight', value: `${product.weight || 0} kg` },
                { label: 'Dimensions', value: product.dimension || 'N/A' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-surface-border bg-black/20 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider mb-0.5 opacity-60">{label}</p>
                  <p className="text-white font-medium truncate">{value}</p>
                </div>
              ))}
            </div>

            {/* Warranty badge */}
            {(product.warrantyPeriodMonths ?? 0) > 0 && (
              <div className="flex items-center gap-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-3">
                <span className="material-symbols-outlined text-indigo-400 text-xl">shield</span>
                <div>
                  <p className="text-xs font-bold text-indigo-300">{product.warrantyPeriodMonths} Month Warranty</p>
                  <p className="text-[10px] text-text-muted">Manufacturer warranty included</p>
                </div>
              </div>
            )}

            {/* Qty selector */}
            <div className="flex items-center gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted mr-1">Qty</p>
              <button onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                className="h-11 w-11 rounded-lg border border-surface-border text-white hover:border-primary transition-colors text-lg font-bold">
                −
              </button>
              <div className="h-11 min-w-[52px] rounded-lg border border-surface-border px-4 flex items-center justify-center text-white font-bold text-lg">
                {qty}
              </div>
              <button onClick={() => setQty((prev) => prev + 1)}
                className="h-11 w-11 rounded-lg border border-surface-border text-white hover:border-primary transition-colors text-lg font-bold">
                +
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={addItem}
                disabled={!product.isActive}
                className={`h-13 py-3 rounded-lg font-bold text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${added ? 'border-green-500 bg-green-600 text-white' : 'border-primary bg-primary hover:bg-[#c20000] text-white'} disabled:opacity-40`}
              >
                <span className="material-symbols-outlined text-xl">{added ? 'check' : 'add_shopping_cart'}</span>
                {added ? 'Added!' : 'Add to Cart'}
              </button>
              <button
                onClick={buyNow}
                disabled={!product.isActive}
                className="h-13 py-3 rounded-lg font-bold text-base uppercase tracking-wider transition-all border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-xl">bolt</span>
                Buy Now (COD)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <div className="flex items-end justify-between mb-6 border-b border-surface-border pb-4">
            <h2 className="text-2xl font-bold uppercase text-white tracking-tight">You May Also Like</h2>
            <Link to="/shop" className="text-sm font-bold text-primary hover:text-white transition-colors">VIEW ALL →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link key={p.productId} to={`/product/${p.productId}`}
                className="group rounded-xl border border-surface-border bg-surface-dark p-4 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                <div className="h-28 flex items-center justify-center mb-3">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.productName} className="h-full object-contain group-hover:scale-110 transition-transform" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-white/20 group-hover:scale-110 transition-transform">two_wheeler</span>
                  )}
                </div>
                <p className="text-xs text-text-muted font-mono mb-1">{p.brand || 'G-Zone'}</p>
                <p className="text-white text-sm font-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug">{p.productName}</p>
                <p className="text-primary font-black mt-2">${p.basePrice.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;




