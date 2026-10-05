import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface CartBook {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  author: { name: string };
}

export interface CartItem {
  book: CartBook;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: CartBook, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (book: CartBook, quantity = 1) => {
    setItems(current => {
      const existingItem = current.find(item => item.book.id === book.id);
      if (existingItem) {
        return current.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { book, quantity }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setItems(current => current.filter(item => item.book.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setItems(current =>
      current.map(item =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
