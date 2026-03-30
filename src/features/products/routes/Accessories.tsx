import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Product, getProducts, getProductImage } from '@/features/admin/api/product-api';
import { Category, getCategories } from '@/features/admin/api/category-api';
import { addToCart } from '@/lib/cart';
import { useToast } from '@/providers/ToastProvider';

const PAGE_SIZE = 9;

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

const Accessories: React.FC = () => {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState<SortKey>('default');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(1, 200),
          getCategories(1, 100),
        ]);
        setProducts(productData.filter((item) => item.isActive));
        setCategories(categoryData);
      } catch (error) {
        console.error('Failed to load shop data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      const map: Record<string, string> = {};

      await Promise.all(
        products.map(async (p) => {
          if (!p.imageUrl) return;

          try {
            const blob = await getProductImage(p.imageUrl);
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

  useEffect(() => { setPage(1); }, [selectedCategory, search, sort]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }

    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }

    const nextValue = params.toString();
    if (nextValue !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [search, selectedCategory, searchParams, setSearchParams]);

  const processed = useMemo(() => {
    let list = [...products];
    if (selectedCategory) list = list.filter((p) => p.categoryId === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.productName.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
    }
    if (sort === 'price-asc') list.sort((a, b) => a.basePrice - b.basePrice);
    else if (sort === 'price-desc') list.sort((a, b) => b.basePrice - a.basePrice);
    else if (sort === 'name-asc') list.sort((a, b) => a.productName.localeCompare(b.productName));
    return list;
  }, [products, selectedCategory, search, sort]);

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const paginated = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getCategoryName = (id: string) =>
    categories.find((item) => item.categoryId === id)?.categoryName || 'Uncategorized';

  const handleAdd = (product: Product) => {
    addToCart({
      productId: product.productId,
      productName: product.productName,
      sku: product.sku,
      basePrice: product.basePrice,
      quantity: 1,
      categoryId: product.categoryId,
      warrantyPeriodMonths: product.warrantyPeriodMonths,
      imageUrl: product.imageUrl,
    });
    showToast(`"${product.productName}" added to cart!`);
  };

  const CategoryList = () => (
    <div className="space-y-1 text-sm text-gray-400">
      <button
        onClick={() => setSelectedCategory('')}
        className={`block w-full rounded px-3 py-2 text-left transition-colors ${selectedCategory === '' ? 'bg-primary/20 text-primary font-semibold' : 'hover:bg-white/5'}`}
      >
        All Categories <span className="float-right text-xs opacity-60">{products.length}</span>
      </button>
      {categories.map((category) => {
        const count = products.filter((p) => p.categoryId === category.categoryId).length;
        return (
          <button
            key={category.categoryId}
            onClick={() => setSelectedCategory(category.categoryId)}
            className={`block w-full rounded px-3 py-2 text-left transition-colors ${selectedCategory === category.categoryId ? 'bg-primary/20 text-primary font-semibold' : 'hover:bg-white/5'}`}
          >
            {category.categoryName} <span className="float-right text-xs opacity-60">{count}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
      <section className="mb-8 overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(230,0,0,0.18),_transparent_35%),linear-gradient(180deg,_rgba(255,255,255,0.02),_rgba(255,255,255,0.01))] px-5 py-6 md:px-8 md:py-8">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
          <Link to="/" className="transition-colors hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white/70">Shop</span>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),360px] lg:items-end">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-primary">Storefront Catalog</p>
            <h1 className="text-4xl font-black uppercase italic tracking-tight text-white md:text-5xl">Find Gear Fast</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
              The layout now follows common shop patterns: strong search first, filter rail on the left, consistent product media blocks, and clear actions on every card.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">{loading ? 'Loading' : `${processed.length} results`}</span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">Fast search</span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">Category filters</span>
            </div>
          </div>
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base">search</span>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 rounded-lg border border-border-dark bg-surface-dark pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 rounded-lg border border-border-dark bg-surface-dark px-3 text-sm text-white focus:border-primary focus:outline-none"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="md:hidden h-10 px-3 rounded-lg border border-border-dark bg-surface-dark text-white"
              >
                <span className="material-symbols-outlined text-base">filter_list</span>
              </button>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('');
                  setSort('default');
                }}
                className="h-10 flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-bold uppercase tracking-[0.18em] text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {mobileFilterOpen && (
          <div className="md:hidden rounded-lg border border-border-dark bg-surface-dark p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Category</p>
            <CategoryList />
          </div>
        )}
      </section>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-36 rounded-2xl border border-border-dark bg-surface-dark p-4">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">Browse by</p>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white mb-4">Category</p>
            <CategoryList />
          </div>
        </aside>

        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border-dark bg-surface-dark h-72 animate-pulse" />
              ))
            ) : paginated.length === 0 ? (
              <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-5xl text-white/20 mb-4">search_off</span>
                <p className="text-white font-bold">No products found</p>
                <p className="text-text-muted text-sm mt-1">Try adjusting your search or category filter.</p>
                <button onClick={() => { setSearch(''); setSelectedCategory(''); }} className="mt-4 text-primary text-sm font-bold hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              paginated.map((product) => (
                <div key={product.productId} className="group relative flex flex-col overflow-hidden rounded-2xl border border-border-dark bg-surface-dark transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  <Link to={`/product/${product.productId}`} className="relative block overflow-hidden border-b border-white/5 bg-[radial-gradient(circle_at_top,_rgba(230,0,0,0.18),_transparent_42%),linear-gradient(180deg,_#191919,_#101010)] p-5">
                    <div className="mb-10 flex items-start justify-between gap-3">
                      <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">
                        {getCategoryName(product.categoryId)}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${product.isFeatured ? 'bg-primary text-white' : 'bg-white/8 text-white/60'}`}>
                        {product.isFeatured ? 'Featured' : 'In Stock'}
                      </span>
                    </div>
                    <div className="flex h-36 items-center justify-center">
                      {imageMap[product.productId] ? (
                        <img
                          src={imageMap[product.productId]}
                          alt={product.productName}
                          className="h-36 object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-[72px] text-white/18">
                          image
                        </span>
                      )}

                    </div>
                    <div className="mt-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                      <span>{product.sku}</span>
                      <span>{product.warrantyPeriodMonths || 0} mo warranty</span>
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">{product.brand || 'G-Zone'}</p>
                    <Link to={`/product/${product.productId}`} className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-white transition-colors group-hover:text-primary">
                      {product.productName}
                    </Link>
                    <p className="mb-5 line-clamp-2 flex-1 text-sm leading-6 text-text-muted">{product.description || 'Premium riding product.'}</p>
                    <div className="mb-4 grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                      <div className="rounded-xl border border-white/6 bg-black/15 px-3 py-2">Fast checkout</div>
                      <div className="rounded-xl border border-white/6 bg-black/15 px-3 py-2">Verified stock</div>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Price</p>
                        <span className="text-2xl font-black text-primary">${product.basePrice.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => handleAdd(product)}
                        className="flex items-center gap-1 rounded-full bg-primary px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-red-600"
                      >
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-9 w-9 rounded-lg border border-border-dark bg-surface-dark text-white disabled:opacity-30 hover:border-primary transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-lg border text-sm font-bold transition-colors ${p === page ? 'border-primary bg-primary text-white' : 'border-border-dark bg-surface-dark text-white hover:border-primary'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-9 w-9 rounded-lg border border-border-dark bg-surface-dark text-white disabled:opacity-30 hover:border-primary transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accessories;


