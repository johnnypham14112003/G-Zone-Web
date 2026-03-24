import api from '@/lib/axios-api';
import { getAccessToken } from '@/lib/token';
import type { CartItem } from '@/lib/cart';
import { saveCart } from '@/lib/cart';

const getAccountId = (): string | null => {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.accountId ?? payload.sub ?? payload.id ?? null;
  } catch {
    return null;
  }
};

export const syncCartFromServer = async (): Promise<void> => {
  const accountId = getAccountId();
  if (!accountId) return;
  try {
    const { data } = await api.get(`/cart-item/${accountId}`);
    if (Array.isArray(data)) saveCart(data);
  } catch (err) {
    console.warn('[cart-api] sync failed:', err);
  }
};

export const postCartItemToServer = async (item: CartItem): Promise<void> => {
  const accountId = getAccountId();
  if (!accountId) return;
  try {
    await api.post('/cart-item', {
      quantity: item.quantity,
      customDesignNote: null,
      customDesignImage: null,
      customPrice: item.basePrice,
      accountId: accountId,
      productVariantId: item.productId,
    });
  } catch (err) {
    console.warn('[cart-api] post failed:', err);
  }
};