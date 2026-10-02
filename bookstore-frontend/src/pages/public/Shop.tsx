import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, Star, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockCategories } from '@/data/mock';
import { useQuery } from '@apollo/client/react';
import { GET_BOOKS, type BooksQuery } from '@/graphql/books';

export default function Shop() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [, setIsMobileFilterOpen] = useState(false);
  const { data, loading, error } = useQuery<BooksQuery>(GET_BOOKS);

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
              onClick={() => setIsMobileFilterOpen(true)}
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
              <select className="appearance-none h-10 pl-3 pr-8 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                <option>Sort by: Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
                <option>Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden md:block w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {mockCategories.map((cat, i) => (
                <li key={i}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-input text-primary focus:ring-primary" />
                    <span className="text-sm text-muted-foreground hover:text-foreground">{cat}</span>
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
                  <input type="radio" name="price" className="text-primary focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">Under $10</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="price" className="text-primary focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">$10 - $25</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="price" className="text-primary focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">Over $25</span>
                </label>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Rating</h3>
            <ul className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <li key={rating}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-input text-primary focus:ring-primary" />
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.books.map(book => (
              <div key={book.id} className="group flex flex-col gap-3">
                <Link to={`/book/${book.id}`} className="relative aspect-2/3 rounded-md overflow-hidden bg-muted mb-2 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                  {book.imageUrl ? (
                    <img src={book.imageUrl} alt={book.title} className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                      {book.title}
                    </div>
                  )}
                  {book.featured && (
                    <Badge className="absolute top-2 left-2 bg-destructive text-white border-transparent">Featured</Badge>
                  )}
                  {book.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Badge variant="secondary" className="bg-white text-black border-transparent shadow-sm">Out of Stock</Badge>
                    </div>
                  )}
                </Link>
                <div>
                  <Link to={`/book/${book.id}`}>
                    <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{book.author.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <span className="text-xs font-medium">
                      {book.reviews.length > 0
                        ? (book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length).toFixed(1)
                        : 'No ratings'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${book.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled>Previous</Button>
              <Button variant="primary" className="h-10 w-10 p-0">1</Button>
              <Button variant="outline" className="h-10 w-10 p-0">2</Button>
              <Button variant="outline" className="h-10 w-10 p-0">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
