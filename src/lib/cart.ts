export interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  basePrice: number;
  quantity: number;
  categoryId?: string;
  warrantyPeriodMonths?: number;
  imageUrl?: string;
}

const CART_KEY = "gzone_cart";

export const getCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const notifyCartChanged = () => {
  window.dispatchEvent(new Event("cart:updated"));
};

export const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  notifyCartChanged();
};

export const addToCart = (item: CartItem) => {
  const cart = getCart();
  const found = cart.find((x) => x.productId === item.productId);

  if (found) {
    found.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);
};

export const updateCartItemQuantity = (productId: string, quantity: number) => {
  const cart = getCart();
  const next = cart
    .map((item) =>
      item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    )
    .filter((item) => item.quantity > 0);

  saveCart(next);
};

export const removeCartItem = (productId: string) => {
  const cart = getCart();
  const next = cart.filter((item) => item.productId !== productId);
  saveCart(next);
};

export const clearCart = () => {
  saveCart([]);
};

export const getCartSubtotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);

export const getCartCount = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);
