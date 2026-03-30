import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomizationModal from "./components/CustomizationModal";
import {
  CartItem,
  getCart,
  getCartCount,
  getCartSubtotal,
  removeCartItem,
  updateCartItemQuantity,
} from '@/lib/cart';
import { syncCartFromServer } from '@/features/accounts/api/cart-api';

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const load = () => setItems(getCart());
    load();
    syncCartFromServer().then(load);
    window.addEventListener('cart:updated', load);
    return () => window.removeEventListener('cart:updated', load);
  }, []);

  const [customizingItem, setCustomizingItem] = useState<CartItem | null>(null);

  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const totalItems = useMemo(() => getCartCount(items), [items]);

  return (
    <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-10 flex items-end gap-4 border-b border-surface-border pb-6">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic text-white">Your Garage</h1>
        <span className="text-lg md:text-xl text-primary font-bold mb-1">({totalItems} Items)</span>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          {items.length === 0 ? (
            <div className="rounded-xl border border-surface-border bg-surface-dark p-8 text-center">
              <p className="text-text-muted mb-4">Your cart is empty.</p>
              <Link to="/shop" className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-600">
                Continue Shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="group relative overflow-hidden rounded-xl bg-surface-dark border border-[#3a1515] hover:border-primary/50 transition-all duration-300">
                <div className="flex flex-col md:grid md:grid-cols-12 gap-6 p-5 items-center">
                  <div className="col-span-6 flex items-start gap-5 w-full">
                    <div className="shrink-0 relative">
                      <div className="bg-center bg-no-repeat bg-cover rounded-lg size-24 md:size-28 bg-[#150a0a] border border-[#3a1515] flex items-center justify-center overflow-hidden">
                        {!item.imageUrl && <span className="material-symbols-outlined text-white/25">inventory_2</span>}
                          {item.imageUrl && <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight mb-1">{item.productName}</h3>
                      <p className="text-gray-400 text-sm">SKU: {item.sku}</p>
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-center w-full md:w-auto">
                    <div className="flex items-center rounded-lg bg-[#150a0a] border border-[#3a1515] p-1">
                      <button
                        onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                        className="size-8 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-[#3a1515]"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="w-10 text-center text-white text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                        className="size-8 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-[#3a1515]"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-right hidden md:block">
                    <span className="text-gray-400 font-medium">${item.basePrice.toFixed(2)}</span>
                  </div>

                  <div className="col-span-2 text-right flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto mt-4 md:mt-0 border-t border-[#3a1515] md:border-none pt-4 md:pt-0">
                    <span className="text-white font-bold text-lg">${(item.basePrice * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => setCustomizingItem(item)}
                      className="text-xs font-bold uppercase text-yellow-400 hover:text-yellow-300 mb-2"
                    >
                      Customize
                    </button>
                    <button
                      onClick={() => removeCartItem(item.productId)}
                      className="text-xs font-bold uppercase text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                    {customizingItem && (
                      <CustomizationModal
                        item={customizingItem}
                        onClose={() => setCustomizingItem(null)}
                        onSave={(data) => {
                          console.log("Customization:", data);
                          
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>


            ))
          )}
        </div>

        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="sticky top-24 bg-surface-dark border border-[#3a1515] rounded-xl overflow-hidden shadow-2xl shadow-black/50">
            <div className="p-6">
              <h2 className="text-2xl font-black text-white uppercase italic mb-6 border-b border-[#3a1515] pb-4">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm"><span className="text-gray-400">Subtotal</span><span className="text-white font-medium font-mono">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-gray-400">Shipping</span><span className="text-gray-500 text-xs uppercase font-bold">Calculated at checkout</span></div>
              </div>
              <div className="border-t border-dashed border-surface-border my-6"></div>
              <div className="flex justify-between items-end mb-8"><span className="text-lg text-white font-bold uppercase">Total</span><div className="text-right"><span className="text-3xl font-black text-primary leading-none tracking-tight block">${subtotal.toFixed(2)}</span></div></div>
              <Link
                to={items.length === 0 ? '/shop' : '/checkout'}
                className="group w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-white font-bold uppercase tracking-wider transition-all hover:bg-red-600"
              >
                {items.length === 0 ? 'Browse Products' : 'Proceed to Checkout'}
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;



