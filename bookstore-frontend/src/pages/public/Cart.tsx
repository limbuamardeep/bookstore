import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-8 text-4xl font-serif font-bold">Your cart</h1>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground border rounded-lg">Your cart is empty.</div>
          ) : (
            items.map(({ book, quantity }) => (
              <div key={book.id} className="flex flex-col sm:flex-row items-center gap-4 rounded-lg border border-border bg-card p-4">
                <img src={book.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop'} alt={book.title} className="h-24 w-20 rounded object-cover" />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="font-semibold line-clamp-1">{book.title}</h2>
                  <p className="text-sm text-muted-foreground">{book.author.name}</p>
                </div>
                
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <div className="flex items-center border border-input rounded-md h-9 bg-background">
                    <button 
                      className="px-2 h-full hover:bg-muted text-muted-foreground"
                      onClick={() => updateQuantity(book.id, quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button 
                      className="px-2 h-full hover:bg-muted text-muted-foreground"
                      onClick={() => updateQuantity(book.id, quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <div className="w-20 text-right">
                    <p className="font-semibold">${(book.price * quantity).toFixed(2)}</p>
                  </div>
                  
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(book.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        <aside className="rounded-lg border border-border bg-card p-6 h-fit">
          <h2 className="mb-4 text-xl font-semibold">Order summary</h2>
          <div className="mb-2 flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="mb-4 flex justify-between text-sm text-muted-foreground">
            <span>Shipping</span>
            <span>{subtotal > 0 ? 'Free' : '-'}</span>
          </div>
          <div className="mb-6 flex justify-between font-semibold">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Button 
            className="w-full mb-2" 
            disabled={items.length === 0}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </Button>
          <Link to="/shop" className="inline-flex w-full items-center justify-center rounded-md border border-input bg-transparent px-4 py-2.5 text-sm font-medium hover:bg-muted">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
