
export type OrderStatus = 'pending' | 'completed' | 'partial' | 'cancelled';

export interface Order {
  id: string;
  companyName: string;
  productName: string;
  totalProducts: number;
  shippedProducts: number;
  createdAt: string;
  estimatedDeliveryDate: string;
  status: OrderStatus;
}

export interface OrderFilter {
  companyName?: string;
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
}
