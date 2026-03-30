import React from 'react';
import { Link } from 'react-router-dom';
import { APP_IMAGES } from '@/constants/images';

const Garage: React.FC = () => {
  return (
    <div className="flex-grow w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link to="/" className="text-text-muted hover:text-white transition-colors">Home</Link>
        <span className="text-text-muted">/</span>
        <span className="text-white font-medium">Your Garage</span>
      </div>

      {/* Page Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-surface-border pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2">Your Garage</h1>
          <p className="text-text-muted text-lg">4 Items Staged for Deployment</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-surface-border text-text-muted hover:text-white hover:border-white transition-all text-sm font-bold uppercase">
            <span className="material-symbols-outlined text-[20px]">share</span> Share List
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black hover:bg-gray-200 transition-colors text-sm font-bold uppercase shadow-lg shadow-white/5">
            <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span> Add All to Cart
          </button>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="group relative flex flex-col bg-surface-dark rounded-xl overflow-hidden border border-surface-border hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-primary/10">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#2a1212]">
            <div className="absolute top-3 left-3 z-10 bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide backdrop-blur-md">In Stock</div>
            <button className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/40 hover:bg-primary text-white backdrop-blur-sm transition-colors"><span className="material-symbols-outlined text-[18px]">close</span></button>
            <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${APP_IMAGES.garage.card1})` }}></div>
          </div>
          <div className="flex flex-col flex-1 p-5">
            <div className="flex-1">
              <h3 className="text-white text-xl font-bold leading-tight tracking-tight mb-1 group-hover:text-primary transition-colors">Shoei RF-1400</h3>
              <p className="text-text-muted text-sm mb-4">Matte Black • Size L</p>
              <div className="flex items-center gap-2 mb-4"><span className="text-2xl font-bold text-white">$579.99</span></div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 h-10 bg-primary hover:bg-red-700 text-white font-bold text-sm rounded-lg uppercase tracking-wide transition-colors shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span> Move to Cart
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative flex flex-col bg-surface-dark rounded-xl overflow-hidden border border-surface-border hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-primary/10">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#2a1212]">
            <div className="absolute top-3 left-3 z-10 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide backdrop-blur-md">Low Stock</div>
            <button className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/40 hover:bg-primary text-white backdrop-blur-sm transition-colors"><span className="material-symbols-outlined text-[18px]">close</span></button>
            <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${APP_IMAGES.garage.card2})` }}></div>
          </div>
          <div className="flex flex-col flex-1 p-5">
            <div className="flex-1">
              <h3 className="text-white text-xl font-bold leading-tight tracking-tight mb-1 group-hover:text-primary transition-colors">Alpinestars GP Plus R v3</h3>
              <p className="text-text-muted text-sm mb-4">Black/Red • Size 52</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-white">$499.95</span>
                <span className="text-xs text-text-muted line-through">$549.95</span>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 h-10 bg-primary hover:bg-red-700 text-white font-bold text-sm rounded-lg uppercase tracking-wide transition-colors shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span> Move to Cart
            </button>
          </div>
        </div>
      </div>
      
      {/* Empty State / Up-sell */}
      <div className="mt-16 p-8 rounded-2xl bg-[#2a1212] border border-dashed border-surface-border flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#240f0f] to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col gap-2 max-w-xl">
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Your kit isn't complete</h2>
            <p className="text-text-muted">Track days require preparation. Check out our latest arrivals in accessories to finish your setup.</p>
        </div>
        <Link to="/shop" className="relative z-10 whitespace-nowrap px-6 py-3 bg-surface-border hover:bg-[#5c2828] text-white font-bold uppercase rounded-lg transition-colors flex items-center gap-2">
            Browse Accessories <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

export default Garage;