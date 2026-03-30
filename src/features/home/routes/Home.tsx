import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { APP_IMAGES } from "@/constants/images";
import { Product, getProducts } from "@/features/admin/api/product-api";
import { addToCart } from "@/lib/cart";
import { useToast } from "@/providers/ToastProvider";

const Home: React.FC = () => {
  const { showToast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const categoryCards = [
    {
      title: "Helmets",
      subtitle: "Protection",
      description:
        "DOT & SNELL certified options for daily road and touring use.",
      image: APP_IMAGES.home.helmet,
      span: "md:col-span-2 md:row-span-2",
    },
    {
      title: "Jackets",
      subtitle: "Weather Ready",
      description: "Layered outerwear for urban riding and longer routes.",
      image: APP_IMAGES.home.jacket,
      span: "",
    },
    {
      title: "Gloves",
      subtitle: "Grip Control",
      description: "Short cuff and gauntlet gloves with impact protection.",
      image: APP_IMAGES.home.gloves,
      span: "",
    },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts(1, 8);
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load featured products", error);
      }
    };

    loadProducts();
  }, []);

  const quickAdd = (product: Product) => {
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

  return (
    <div className="w-full">
      <div className="relative overflow-hidden border-b border-white/5 bg-background-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(230,0,0,0.14),_transparent_26%)]" />
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.3fr),420px] lg:px-8 lg:py-10">
          <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black min-h-[540px]">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/62 to-black/18 z-10" />
              <img
                alt="High performance red sport motorcycle"
                className="h-full w-full object-cover object-center opacity-80"
                src={APP_IMAGES.home.heroMotorcycle}
              />
            </div>
            <div className="relative z-20 flex h-full flex-col justify-between px-6 py-7 md:px-10 md:py-10">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.26em] text-white/60">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-primary">
                  Storefront refresh
                </span>
                <span>Built for riders</span>
              </div>
              <div className="max-w-2xl">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-primary">
                  MotoGear shop
                </p>
                <h1 className="mb-5 text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl xl:text-7xl">
                  Shop Layout That
                  <br />
                  Feels Like A Real Store
                </h1>
                <p className="mb-8 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
                  The page now follows the same direction used by stronger
                  shops: a clear hero, visible navigation, search-first
                  browsing, and structured product rails instead of scattered
                  blocks.
                </p>
                <div className="mb-6 flex flex-wrap gap-4">
                  <Link
                    to="/shop"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-black uppercase tracking-[0.22em] text-white transition-colors hover:bg-red-600"
                  >
                    Shop Now
                  </Link>
                  <Link
                    to="/profile"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-8 text-sm font-black uppercase tracking-[0.22em] text-white transition-colors hover:bg-white/[0.08]"
                  >
                    My Account
                  </Link>
                </div>
                <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/75">
                    COD available
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/75">
                    Fast support
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/75">
                    Verified gear
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.03),_rgba(255,255,255,0.01))] p-6">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                Why this feels better
              </p>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Storefront Basics, Done Right
              </h2>
              <div className="mt-5 space-y-3 text-sm leading-6 text-white/68">
                <p>
                  Clear global nav at the top, just like RevZilla and FC-Moto.
                </p>
                <p>
                  Search and category filters are now obvious instead of buried.
                </p>
                <p>
                  Cards use one visual structure, so product media no longer
                  feels random.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: "storefront", label: "Search-first browsing" },
                { icon: "inventory_2", label: "Consistent product blocks" },
                { icon: "person", label: "Cleaner account shell" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-white/10 bg-black/30 p-5"
                >
                  <span className="material-symbols-outlined text-2xl text-primary">
                    {item.icon}
                  </span>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                    Updated
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
              Shop by category
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">
              Structured Entry Points
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden text-sm font-black uppercase tracking-[0.2em] text-primary transition-colors hover:text-white sm:block"
          >
            View all categories
          </Link>
        </div>
        <div className="grid h-auto grid-cols-1 gap-4 md:h-[620px] md:grid-cols-3 md:grid-rows-2">
          {categoryCards.map((card) => (
            <Link
              key={card.title}
              to="/shop"
              className={`group relative overflow-hidden rounded-[26px] border border-surface-border bg-surface-dark ${card.span}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
              <img
                alt={card.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={card.image}
              />
              <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-8">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                  {card.subtitle}
                </span>
                <h3 className="text-3xl font-black uppercase text-white transition-colors group-hover:text-primary md:text-4xl">
                  {card.title}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/68">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between border-b border-surface-border pb-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
              Featured rail
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">
              Best Sellers
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Consistent media blocks, brand labels, and clear CTA hierarchy.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-black uppercase tracking-[0.2em] text-primary transition-colors hover:text-white"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <div
              key={product.productId}
              className="overflow-hidden rounded-[24px] border border-surface-border bg-surface-dark"
            >
              <Link
                to={`/product/${product.productId}`}
                className="flex h-48 items-center justify-center border-b border-white/5 bg-[radial-gradient(circle_at_top,_rgba(230,0,0,0.14),_transparent_40%),linear-gradient(180deg,_#191919,_#101010)] overflow-hidden"
              >
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.productName} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                  />
                ) : (
                  <span className="material-symbols-outlined text-[64px] text-white/18">
                    inventory_2
                  </span>
                )}
              </Link>
              <div className="p-5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-text-muted">
                  {product.brand || "G-Zone"}
                </p>
                <Link
                  to={`/product/${product.productId}`}
                  className="mb-3 block text-lg font-bold text-white hover:text-primary transition-colors"
                >
                  {product.productName}
                </Link>
                <p className="mb-4 text-sm text-text-muted line-clamp-2">
                  {product.description ||
                    "Premium riding gear for daily and track usage."}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-primary">
                    ${product.basePrice.toFixed(2)}
                  </span>
                  <button
                    onClick={() => quickAdd(product)}
                    className="rounded-full bg-primary px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-red-600"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-surface-border bg-surface-dark p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
              Step 1
            </p>
            <p className="mt-2 text-lg font-bold text-white">Browse Products</p>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Search first, then narrow by category. This mirrors the flow used
              by stronger commerce sites.
            </p>
          </div>
          <div className="rounded-[22px] border border-surface-border bg-surface-dark p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
              Step 2
            </p>
            <p className="mt-2 text-lg font-bold text-white">
              Review Clear Cards
            </p>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Every product block keeps the same hierarchy: media, brand, title,
              price, then action.
            </p>
          </div>
          <div className="rounded-[22px] border border-surface-border bg-surface-dark p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
              Step 3
            </p>
            <p className="mt-2 text-lg font-bold text-white">
              Checkout And Track
            </p>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Account and order tracking now sit in a cleaner account shell,
              closer to real storefront UX.
            </p>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="w-full border-y border-surface-border bg-[#1a0a0a] bg-[radial-gradient(#2e1a1a_15%,transparent_16%),radial-gradient(#2e1a1a_15%,transparent_16%)] bg-[length:10px_10px] py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Ready for the <span className="text-primary">Track?</span>
            </h2>
            <p className="mt-2 max-w-xl text-gray-400">
              Join the Redline Club and get exclusive access to limited edition
              drops and track day discounts.
            </p>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded-lg border-none bg-black/50 px-4 py-3 text-white ring-1 ring-white/10 focus:ring-primary"
              placeholder="Enter your email"
              type="email"
            />
            <button className="rounded-lg bg-white px-6 py-3 font-bold text-black hover:bg-gray-200">
              JOIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

