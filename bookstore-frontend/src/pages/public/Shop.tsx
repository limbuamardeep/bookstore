import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Star, LayoutGrid, List, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useQuery } from '@apollo/client/react';
import { GET_BOOKS, type BooksQuery } from '@/graphql/books';
import { GET_CATEGORIES, type CategoriesQuery } from '@/graphql/category';
import { useCart } from '@/context/CartContext';

type BookType = BooksQuery['books'][number];
const EMPTY_BOOKS: BooksQuery['books'] = [];

function ShopContent({ initialCategory }: { initialCategory: string | null }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const { data, loading, error } = useQuery<BooksQuery>(GET_BOOKS);
  const { data: catData } = useQuery<CategoriesQuery>(GET_CATEGORIES);
  const { addToCart } = useCart();

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('relevance');
  
  // Infinite scroll state
  const [visibleCount, setVisibleCount] = useState(12);
  const observerRef = useRef<HTMLDivElement>(null);

  // Added state for specific books
  const [addedBooks, setAddedBooks] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleAddToCart = (book: BookType) => {
    addToCart(book, 1);
    setAddedBooks(prev => ({ ...prev, [book.id]: true }));
    setTimeout(() => {
      setAddedBooks(prev => ({ ...prev, [book.id]: false }));
    }, 2000);
  };

  const books = data?.books ?? EMPTY_BOOKS;
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Filter by Categories
    if (selectedCategories.length > 0) {
      result = result.filter(b =>
        b.category &&
        (selectedCategories.includes(b.category.name) ||
          selectedCategories.includes(String(b.categoryId)))
      );
    }

    // Filter by Price
    if (selectedPrice) {
      if (selectedPrice === 'under-10') result = result.filter(b => b.price < 10);
      else if (selectedPrice === '10-25') result = result.filter(b => b.price >= 10 && b.price <= 25);
      else if (selectedPrice === 'over-25') result = result.filter(b => b.price > 25);
    }

    // Filter by Rating
    if (selectedRating !== null) {
      result = result.filter(b => {
        const rating = b.reviews.length > 0 
          ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length 
          : 0;
        return rating >= selectedRating;
      });
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.publishYear - a.publishYear);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => {
        const rA = a.reviews.length > 0 ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length : 0;
        const rB = b.reviews.length > 0 ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length : 0;
        return rB - rA;
      });
    }

    return result;
  }, [books, selectedCategories, selectedPrice, selectedRating, sortBy]);

  const visibleBooks = filteredAndSortedBooks.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedBooks.length;

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount(prev => prev + 12);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading books...</div>;
  if (error) return <div className="container mx-auto px-4 py-8" role="alert">Could not load books: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link> &gt; <span>Shop</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <h1 className="text-3xl font-serif font-bold">All Books</h1>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="md:hidden flex-1"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
            
            <div className="hidden md:flex items-center gap-2 border rounded-md p-1">
              <button 
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-muted' : 'hover:bg-muted/50'}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button 
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-muted' : 'hover:bg-muted/50'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <div className="relative">
              <select 
                className="appearance-none h-10 pl-3 pr-8 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${isMobileFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0 space-y-8`}>
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {catData?.categories.map((cat) => (
                <li key={cat.id}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-input text-primary focus:ring-primary"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                    />
                    <span className="text-sm text-muted-foreground hover:text-foreground">{cat.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Price</h3>
            <ul className="space-y-2">
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="price" checked={selectedPrice === null} onChange={() => setSelectedPrice(null)} className="text-primary focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">Any Price</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="price" checked={selectedPrice === 'under-10'} onChange={() => setSelectedPrice('under-10')} className="text-primary focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">Under $10</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="price" checked={selectedPrice === '10-25'} onChange={() => setSelectedPrice('10-25')} className="text-primary focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">$10 - $25</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="price" checked={selectedPrice === 'over-25'} onChange={() => setSelectedPrice('over-25')} className="text-primary focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">Over $25</span>
                </label>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Rating</h3>
            <ul className="space-y-2">
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="rating" checked={selectedRating === null} onChange={() => setSelectedRating(null)} className="text-primary focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">Any Rating</span>
                </label>
              </li>
              {[4, 3, 2, 1].map((rating) => (
                <li key={rating}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="rating" checked={selectedRating === rating} onChange={() => setSelectedRating(rating)} className="text-primary focus:ring-primary" />
                    <div className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                      {Array.from({ length: rating }).map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-accent text-accent" />
                      ))}
                      <span className="ml-2">&amp; Up</span>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="flex-1">
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {visibleBooks.map(book => {
              const ratingVal = book.reviews.length > 0 ? (book.reviews.reduce((s, r) => s + r.rating, 0) / book.reviews.length).toFixed(1) : 'No ratings';
              const isAdded = addedBooks[book.id];
              
              return (
                <div key={book.id} className={`group flex ${viewMode === 'grid' ? 'flex-col gap-3 h-full' : 'flex-row gap-6 items-center border p-4 rounded-lg'}`}>
                  <Link to={`/book/${book.id}`} className={`relative overflow-hidden bg-muted shadow-sm group-hover:shadow-xl transition-all duration-300 ${viewMode === 'grid' ? 'aspect-2/3 rounded-md group-hover:-translate-y-1 mb-2' : 'h-32 w-24 shrink-0 rounded object-cover'}`}>
                    {book.imageUrl ? (
                      <img src={book.imageUrl} alt={book.title} className="object-cover w-full h-full" />
                    ) : (
                      <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                        {book.title}
                      </div>
                    )}
                    {book.featured && (
                      <Badge className="absolute top-2 left-2 bg-destructive text-white border-transparent text-[10px]">Featured</Badge>
                    )}
                    {book.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Badge variant="secondary" className="bg-white text-black border-transparent shadow-sm">Out of Stock</Badge>
                      </div>
                    )}
                  </Link>
                  <div className={`flex flex-col ${viewMode === 'list' ? 'flex-1' : 'flex-1 justify-between'}`}>
                    <div>
                      <Link to={`/book/${book.id}`}>
                        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors text-lg">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">{book.author.name}</p>
                      <div className="flex items-center gap-1 mt-2 mb-2">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="text-sm font-medium">{ratingVal}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="font-bold text-lg">${book.price.toFixed(2)}</span>
                      {book.stock > 0 && (
                        <Button 
                          onClick={(e) => { e.preventDefault(); handleAddToCart(book); }} 
                          size="sm"
                          variant={isAdded ? "outline" : "default"}
                          className={`min-w-27.5 transition-all ${isAdded ? 'border-success text-success hover:bg-success/10 hover:text-success' : ''}`}
                        >
                          {isAdded ? <><Check className="w-4 h-4 mr-1" /> Added</> : 'Add to Cart'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {visibleBooks.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              No books found matching your filters.
            </div>
          )}

          {/* Infinite Scroll trigger */}
          {hasMore && (
            <div ref={observerRef} className="py-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  return <ShopContent key={initialCategory ?? ''} initialCategory={initialCategory} />;
}
