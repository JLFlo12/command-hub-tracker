
import React from 'react';
import { Order } from '../types/order';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
  onSort,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('productName')}
            >
              Produit
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell className="text-center text-gray-500">
                Aucune commande trouvée
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
