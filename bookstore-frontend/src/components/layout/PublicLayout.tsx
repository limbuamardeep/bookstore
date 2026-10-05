import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen, Search, ShoppingCart, User, Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { totalItems } = useCart();
  const cartCount = totalItems;

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">The Bookery</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/shop" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Shop</Link>
            <Link to="/categories" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Categories</Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            
            <div className="hidden md:flex relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search books..."
                className="h-9 w-64 rounded-full border border-input bg-muted/50 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-muted transition-colors">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link to="/cart" className="relative p-2 rounded-full hover:bg-muted transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-secondary text-[10px] font-bold text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/login" className="hidden md:block p-2 rounded-full hover:bg-muted transition-colors">
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search books..."
                className="h-9 w-full rounded-md border border-input bg-muted/50 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Link to="/" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
            <Link to="/login" className="text-sm font-medium text-primary" onClick={() => setIsMobileMenuOpen(false)}>Login / Account</Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-bold">The Bookery</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your cozy corner on the internet for literary adventures, curated collections, and timeless classics.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-primary">All Books</Link></li>
              <li><Link to="/shop?category=Fiction" className="hover:text-primary">Fiction</Link></li>
              <li><Link to="/shop?category=Non-Fiction" className="hover:text-primary">Non-Fiction</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">FAQ</a></li>
              <li><a href="#" className="hover:text-primary">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-primary">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">Subscribe for updates on new arrivals and special offers.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" />
              <Button size="sm">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} The Bookery. All rights reserved. (Frontend Demo)
        </div>
      </footer>
    </div>
  );
}
