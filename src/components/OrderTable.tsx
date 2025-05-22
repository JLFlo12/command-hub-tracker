
import React from 'react';
import { Order, OrderStatus } from '../types/order';
import { ArrowUp, ArrowDown, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface OrderTableProps {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  onSort: (field: keyof Order) => void;
  sortField?: keyof Order;
  sortDirection?: 'asc' | 'desc';
}

const OrderTable: React.FC<OrderTableProps> = ({ 
  orders, 
  onEditOrder, 
  onDeleteOrder,
  onSort,
  sortField,
  sortDirection
}) => {
  const renderSortIcon = (field: keyof Order) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="inline w-4 h-4 ml-1" /> : 
      <ArrowDown className="inline w-4 h-4 ml-1" />;
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'partial':
        return 'Partiel';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'En cours';
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('companyName')}
            >
              Entreprise {renderSortIcon('companyName')}
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('id')}
            >
              ID {renderSortIcon('id')}
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Produit
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Produits
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('createdAt')}
            >
              Création {renderSortIcon('createdAt')}
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('estimatedDeliveryDate')}
            >
              Livraison {renderSortIcon('estimatedDeliveryDate')}
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('status')}
            >
              Statut {renderSortIcon('status')}
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                Aucune commande trouvée
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.companyName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.productName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.shippedProducts} / {order.totalProducts}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${(order.shippedProducts / order.totalProducts) * 100}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(order.estimatedDeliveryDate).toLocaleDateString('fr-FR')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEditOrder(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDeleteOrder(order.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
