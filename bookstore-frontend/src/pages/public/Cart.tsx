import { Link } from 'react-router-dom'
import { mockBooks } from '@/data/mock'

const cartItems = [mockBooks[0], mockBooks[2]]

export default function Cart() {
  const subtotal = cartItems.reduce((sum, book) => sum + book.price, 0)

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-8 text-4xl font-serif font-bold">Your cart</h1>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {cartItems.map((book) => (
            <div key={book.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
              <img src={book.coverImage} alt={book.title} className="h-24 w-20 rounded object-cover" />
              <div className="flex-1">
                <h2 className="font-semibold">{book.title}</h2>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${book.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <aside className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Order summary</h2>
          <div className="mb-2 flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="mb-4 flex justify-between text-sm text-muted-foreground">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="mb-6 flex justify-between font-semibold">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Link to="/shop" className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
