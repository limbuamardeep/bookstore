import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useMutation } from '@apollo/client/react';
import { ADD_ORDER, ADD_ORDER_ITEM } from '@/graphql/order';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
  });

  const [addOrder] = useMutation<
    { addOrder: { id: string } },
    { userId: number; total: number; status: string }
  >(ADD_ORDER);
  const [addOrderItem] = useMutation(ADD_ORDER_ITEM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const orderRes = await addOrder({
        variables: {
          userId: 1,
          total: subtotal,
          status: 'PENDING'
        }
      });
      
      const orderId = Number(orderRes.data?.addOrder.id);
      if (!Number.isFinite(orderId)) {
        throw new Error('The order was created without a valid ID.');
      }

      for (const item of items) {
        await addOrderItem({
          variables: {
            orderId,
            bookId: Number(item.book.id),
            quantity: item.quantity,
            price: item.book.price
          }
        });
      }

      // 3. Clear cart and redirect
      clearCart();
      navigate('/checkout/success');
      
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Checkout failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
        <Button onClick={() => navigate('/shop')}>Go to Shop</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-8 text-4xl font-serif font-bold text-center">Checkout</h1>
      
      <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-[1fr_400px]">
        
        {/* Form */}
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input required name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input required type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input required name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Input required name="city" value={formData.city} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">ZIP Code</label>
                  <Input required name="zip" value={formData.zip} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-muted/50 text-center text-muted-foreground text-sm">
                Cash on Delivery (Demo Mode)
              </div>
            </CardContent>
          </Card>
        </form>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {items.map(({ book, quantity }) => (
                  <div key={book.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground line-clamp-1">{quantity}x {book.title}</span>
                    <span>${(book.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form" 
                className="w-full mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
