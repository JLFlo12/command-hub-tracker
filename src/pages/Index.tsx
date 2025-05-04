
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  getOrders, 
  getFilteredOrders, 
  addOrder, 
  updateOrder,
  deleteOrder 
} from '@/services/orderService';
import { Order, OrderFilter, OrderStatus } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import OrderTable from '@/components/OrderTable';
import OrderForm from '@/components/OrderForm';
import OrderFilters from '@/components/OrderFilters';
import { Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type SortDirection = 'asc' | 'desc';

const Index = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined);
  const [sortField, setSortField] = useState<keyof Order>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const { toast } = useToast();

  const loadOrders = async (filters?: OrderFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      let fetchedOrders: Order[];
      
      if (filters && Object.keys(filters).length > 0) {
        fetchedOrders = await getFilteredOrders(
          filters.companyName,
          filters.status,
          filters.dateFrom,
          filters.dateTo
        );
      } else {
        fetchedOrders = await getOrders();
      }
      
      // Apply sorting
      const sortedOrders = sortOrders(fetchedOrders, sortField, sortDirection);
      setOrders(sortedOrders);
    } catch (err) {
      setError("Une erreur s'est produite lors du chargement des commandes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleSort = (field: keyof Order) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    
    const sortedOrders = sortOrders([...orders], field, newDirection);
    setOrders(sortedOrders);
  };

  const sortOrders = (ordersToSort: Order[], field: keyof Order, direction: SortDirection): Order[] => {
    return [...ordersToSort].sort((a, b) => {
      let comparison = 0;
      
      if (field === 'totalProducts' || field === 'shippedProducts') {
        comparison = a[field] - b[field];
      } else {
        const valueA = String(a[field]).toLowerCase();
        const valueB = String(b[field]).toLowerCase();
        
        if (field === 'createdAt' || field === 'estimatedDeliveryDate') {
          comparison = new Date(valueA).getTime() - new Date(valueB).getTime();
        } else {
          comparison = valueA < valueB ? -1 : (valueA > valueB ? 1 : 0);
        }
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  };

  const handleFilterChange = (filters: OrderFilter) => {
    loadOrders(filters);
  };

  const handleAddOrderClick = () => {
    setSelectedOrder(undefined);
    setIsFormOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      try {
        await deleteOrder(orderId);
        loadOrders();
        toast({
          title: "Commande supprimée",
          description: "La commande a été supprimée avec succès.",
        });
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la suppression de la commande.",
          variant: "destructive",
        });
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (data: Omit<Order, 'id'>) => {
    try {
      if (selectedOrder) {
        // Update existing order
        await updateOrder(selectedOrder.id, data);
        toast({
          title: "Commande mise à jour",
          description: "La commande a été mise à jour avec succès.",
        });
      } else {
        // Add new order
        await addOrder(data);
        toast({
          title: "Commande créée",
          description: "La commande a été créée avec succès.",
        });
      }
      
      setIsFormOpen(false);
      loadOrders();
    } catch (err) {
      toast({
        title: "Erreur",
        description: `Une erreur s'est produite lors de ${selectedOrder ? 'la mise à jour' : "l'ajout"} de la commande.`,
        variant: "destructive",
      });
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Command Hub Tracker</h1>
          <p className="text-gray-600">Suivez toutes vos commandes d'équipement informatique</p>
        </div>
        <Button onClick={handleAddOrderClick} className="mt-4 md:mt-0">
          <Plus className="mr-2 h-4 w-4" /> Nouvelle commande
        </Button>
      </div>

      <OrderFilters onFilterChange={handleFilterChange} />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-blue-200"></div>
            <div className="mt-2 text-gray-500">Chargement des commandes...</div>
          </div>
        </div>
      ) : (
        <OrderTable 
          orders={orders} 
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <OrderForm
            order={selectedOrder}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
