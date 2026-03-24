import api from '@/lib/axios-api';

export interface Rating {
  'rating-id': string;
  'rating-score': number;
  'comment': string;
  'admin-reply': string;
  'helpful-count': number;
  'created-at': string;
  'is-verified-purchase': boolean;
  'is-hidden': boolean;
  'customer-id': string;
  'product-id': string;
  'order-detail-id': string;
}

export const getRatingsByProduct = async (productId: string): Promise<Rating[]> => {
  const response = await api.get(`/rating/${productId}`);
  return response.data.data ?? response.data;
};