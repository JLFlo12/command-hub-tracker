
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Order, OrderStatus } from '../types/order';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

const orderSchema = z.object({
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  productName: z.string().min(1, "Le nom du produit est requis"),
  totalProducts: z.coerce.number().int().min(1, "Le nombre total doit être supérieur à 0"),
  shippedProducts: z.coerce.number().int().min(0, "Le nombre expédié ne peut pas être négatif"),
  createdAt: z.string().min(1, "La date de création est requise"),
  estimatedDeliveryDate: z.string().min(1, "La date de livraison estimée est requise"),
  status: z.enum(['pending', 'completed', 'partial', 'cancelled']),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  order?: Order;
  onSubmit: (data: OrderFormData) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, onSubmit, onCancel }) => {
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      companyName: '',
      productName: '',
      totalProducts: 1,
      shippedProducts: 0,
      createdAt: new Date().toISOString().split('T')[0],
      estimatedDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
    },
  });

  useEffect(() => {
    if (order) {
      form.reset({
        companyName: order.companyName,
        productName: order.productName,
        totalProducts: order.totalProducts,
        shippedProducts: order.shippedProducts,
        createdAt: order.createdAt,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        status: order.status,
      });
    }
  }, [order, form]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{order ? 'Modifier la commande' : 'Nouvelle commande'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'entreprise" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produit</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du produit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalProducts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité totale</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shippedProducts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité expédiée</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="createdAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de création</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedDeliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de livraison estimée</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">En cours</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                      <SelectItem value="partial">Partiel</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">
              {order ? 'Enregistrer' : 'Créer'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default OrderForm;
