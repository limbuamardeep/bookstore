import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Star, ShoppingCart, Check } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useQuery } from '@apollo/client/react';
import { GET_BOOKS, type BooksQuery } from '@/graphql/books';
import { GET_CATEGORIES, type CategoriesQuery } from '@/graphql/category';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function Home() {
  const { data: booksData, loading: booksLoading } = useQuery<BooksQuery>(GET_BOOKS);
  const { data: categoriesData } = useQuery<CategoriesQuery>(GET_CATEGORIES);

  const featuredBooks = booksData?.books.filter(b => b.featured).slice(0, 4) || [];
  const displayCategories = categoriesData?.categories.slice(0, 4) || [];
  
  // Fallback covers if no imageUrl
  const defaultCover1 = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop";
  const defaultCover2 = "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="flex flex-col gap-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-muted/30 pt-20 pb-32 overflow-hidden border-b border-border">
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 mb-2">
              New Arrivals Available
            </Badge>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight">
              Discover Your Next <br /> Great Adventure
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Explore our carefully curated collection of fiction, non-fiction, and timeless classics. Find the perfect book to get lost in.
            </p>
            <div className="flex gap-4 pt-4">
              <Link to="/shop" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                Shop Now
              </Link>
              <Link to="/categories" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 border border-input bg-background hover:bg-muted hover:text-foreground">
                Browse Categories
              </Link>
            </div>
          </div>
          <div className="flex-1 relative hidden md:block">
            {/* Decorative Book Display */}
            <div className="relative w-full max-w-md mx-auto aspect-3/4">
              <img 
                src={featuredBooks[0]?.imageUrl || defaultCover1} 
                alt="Featured Book" 
                className="absolute right-10 top-0 w-2/3 rounded-md shadow-2xl z-20 transform rotate-6 hover:rotate-0 transition-transform duration-500 object-cover aspect-2/3"
              />
              <img 
                src={featuredBooks[1]?.imageUrl || defaultCover2} 
                alt="Featured Book 2" 
                className="absolute left-0 top-20 w-2/3 rounded-md shadow-xl z-10 transform -rotate-6 opacity-80 hover:opacity-100 transition-opacity object-cover aspect-2/3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-serif font-bold">Browse Categories</h2>
          <Link to="/categories" className="text-primary font-medium flex items-center gap-1 hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayCategories.length > 0 ? (
            displayCategories.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all group flex flex-col items-center text-center gap-3"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6" />
                </div>
                <span className="font-medium text-foreground">{cat.name}</span>
              </Link>
            ))
          ) : (
             <div className="col-span-4 text-center text-muted-foreground py-8">No categories available.</div>
          )}
        </div>
      </section>

      {/* Featured Books */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">Featured Books</h2>
            <p className="text-muted-foreground">Handpicked recommendations just for you.</p>
          </div>
          <Link to="/shop" className="text-primary font-medium flex items-center gap-1 hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {booksLoading ? (
          <div className="text-center py-8">Loading books...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>
      
      {/* Newsletter Section */}
      <section className="container mx-auto px-4 my-8">
        <div className="bg-primary/5 rounded-2xl p-8 md:p-16 text-center border border-primary/10">
          <h2 className="text-3xl font-serif font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Subscribe to our newsletter to receive the latest updates, exclusive offers, and reading recommendations directly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 h-11 rounded-md border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <Button type="submit" size="lg" className="h-11">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}

function BookCard({ book }: { book: BooksQuery['books'][number] }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const defaultCover = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop";
  const rating = book.reviews.length > 0 
    ? (book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length).toFixed(1)
    : 'No ratings';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to book details
    addToCart(book, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Link to={`/book/${book.id}`} className="group flex flex-col h-full border rounded-xl overflow-hidden bg-card hover:border-primary hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-2/3 overflow-hidden bg-muted">
        <img 
          src={book.imageUrl || defaultCover} 
          alt={book.title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        {book.featured && (
          <Badge className="absolute top-3 left-3 bg-destructive text-white border-transparent shadow-sm">Featured</Badge>
        )}
        {book.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="secondary" className="bg-white text-black border-transparent shadow-sm">Out of Stock</Badge>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors text-lg mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground">{book.author.name}</p>
        <div className="flex items-center gap-1 mt-2 mb-3">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-xs text-muted-foreground ml-1">({book.reviews.length})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <span className="font-bold text-lg">${book.price.toFixed(2)}</span>
          {book.stock > 0 && (
            <Button 
              onClick={handleAddToCart} 
              size="sm"
              variant={isAdded ? "outline" : "default"}
              className={`min-w-25 transition-all ${isAdded ? 'border-success text-success hover:bg-success/10 hover:text-success' : ''}`}
            >
              {isAdded ? <><Check className="w-4 h-4 mr-1" /> Added</> : <><ShoppingCart className="w-4 h-4 mr-1" /> Add</>}
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}
