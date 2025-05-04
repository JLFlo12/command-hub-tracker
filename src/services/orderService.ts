
import { Order, OrderStatus } from '../types/order';

// Mock data for our orders
const mockOrders: Order[] = [
  {
    id: 'CMD-001',
    companyName: 'Tech Solutions',
    productName: 'PC Portable Dell XPS',
    totalProducts: 10,
    shippedProducts: 5,
    createdAt: '2025-04-15',
    estimatedDeliveryDate: '2025-05-15',
    status: 'partial'
  },
  {
    id: 'CMD-002',
    companyName: 'InnovateTech',
    productName: 'PC Bureau HP Elite',
    totalProducts: 5,
    shippedProducts: 5,
    createdAt: '2025-04-10',
    estimatedDeliveryDate: '2025-05-01',
    status: 'completed'
  },
  {
    id: 'CMD-003',
    companyName: 'Digital Systems',
    productName: 'MacBook Pro M2',
    totalProducts: 8,
    shippedProducts: 0,
    createdAt: '2025-04-20',
    estimatedDeliveryDate: '2025-06-01',
    status: 'pending'
  },
  {
    id: 'CMD-004',
    companyName: 'Tech Solutions',
    productName: 'Serveur Dell PowerEdge',
    totalProducts: 2,
    shippedProducts: 0,
    createdAt: '2025-04-18',
    estimatedDeliveryDate: '2025-06-10',
    status: 'cancelled'
  },
  {
    id: 'CMD-005',
    companyName: 'Cyber Innovations',
    productName: 'PC Portable Lenovo ThinkPad',
    totalProducts: 15,
    shippedProducts: 10,
    createdAt: '2025-04-05',
    estimatedDeliveryDate: '2025-05-20',
    status: 'partial'
  }
];

let orders = [...mockOrders];

// Generate a unique ID for new orders
const generateOrderId = (): string => {
  const lastOrder = orders[orders.length - 1];
  const lastId = lastOrder ? parseInt(lastOrder.id.split('-')[1]) : 0;
  const newId = lastId + 1;
  return `CMD-${String(newId).padStart(3, '0')}`;
};

export const getOrders = async (): Promise<Order[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...orders];
};

export const getFilteredOrders = async (
  companyName?: string,
  status?: OrderStatus,
  dateFrom?: string,
  dateTo?: string
): Promise<Order[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredOrders = [...orders];
  
  if (companyName) {
    filteredOrders = filteredOrders.filter(order => 
      order.companyName.toLowerCase().includes(companyName.toLowerCase())
    );
  }
  
  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }
  
  if (dateFrom) {
    filteredOrders = filteredOrders.filter(order => 
      new Date(order.createdAt) >= new Date(dateFrom)
    );
  }
  
  if (dateTo) {
    filteredOrders = filteredOrders.filter(order => 
      new Date(order.createdAt) <= new Date(dateTo)
    );
  }
  
  return filteredOrders;
};

export const addOrder = async (orderData: Omit<Order, 'id'>): Promise<Order> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newOrder: Order = {
    ...orderData,
    id: generateOrderId()
  };
  
  orders = [...orders, newOrder];
  return newOrder;
};

export const updateOrder = async (id: string, orderData: Partial<Order>): Promise<Order> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const orderIndex = orders.findIndex(order => order.id === id);
  
  if (orderIndex === -1) {
    throw new Error(`Order with ID ${id} not found`);
  }
  
  const updatedOrder = {
    ...orders[orderIndex],
    ...orderData
  };
  
  orders = [
    ...orders.slice(0, orderIndex),
    updatedOrder,
    ...orders.slice(orderIndex + 1)
  ];
  
  return updatedOrder;
};

export const deleteOrder = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const orderIndex = orders.findIndex(order => order.id === id);
  
  if (orderIndex === -1) {
    throw new Error(`Order with ID ${id} not found`);
  }
  
  orders = [
    ...orders.slice(0, orderIndex),
    ...orders.slice(orderIndex + 1)
  ];
};
