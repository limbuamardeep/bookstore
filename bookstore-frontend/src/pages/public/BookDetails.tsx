import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, Share2, ShoppingCart, Check, ChevronRight, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useQuery } from '@apollo/client/react';
import { GET_BOOK, type BookQuery } from '@/graphql/books';
import { useCart } from '@/context/CartContext';

export default function BookDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const { data, loading, error } = useQuery<BookQuery>(GET_BOOK, {
    variables: { id },
    skip: !id
  });

  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading book details...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">Error loading book details: {error.message}</div>;
  if (!data?.book) return <div className="container mx-auto px-4 py-8">Book not found.</div>;

  const book = data.book;
  
  type ReviewType = NonNullable<BookQuery['book']>['reviews'][number];

  const rating = book.reviews.length > 0 
    ? (book.reviews.reduce((sum: number, r: ReviewType) => sum + r.rating, 0) / book.reviews.length).toFixed(1)
    : 'No ratings';

  const defaultCover = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop";

  const handleAddToCart = () => {
    addToCart(book, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        {book.category && (
          <>
            <Link to={`/shop?category=${book.category.name}`} className="hover:text-primary">{book.category.name}</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
          </>
        )}
        <span className="text-foreground truncate max-w-50">{book.title}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-12 mb-16">
        <div className="w-full md:w-1/3 max-w-sm mx-auto md:mx-0">
          <div className="relative aspect-2/3 rounded-lg overflow-hidden shadow-2xl bg-muted">
            <img 
              src={book.imageUrl || defaultCover} 
              alt={book.title}
              className="object-cover w-full h-full"
            />
            {book.featured && (
              <Badge className="absolute top-4 left-4 bg-destructive text-white border-transparent">Featured</Badge>
            )}
          </div>
        </div>

        {/* Book Info */}
        <div className="w-full md:w-2/3 flex flex-col">
          <div className="mb-2">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2 leading-tight">
              {book.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              by <span className="text-primary font-medium">{book.author.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-accent text-accent" />
              <span className="font-medium text-lg">{rating}</span>
              <span className="text-muted-foreground ml-1">({book.reviews.length} reviews)</span>
            </div>
            <div className="w-px h-6 bg-border"></div>
            <div className="text-sm font-medium text-success flex items-center gap-1">
              <Check className="h-4 w-4" /> In Stock ({book.stock} available)
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-end gap-3 mb-2">
              <span className="text-3xl font-bold">${book.price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Free shipping on orders over $50</p>
          </div>

          <p className="text-muted-foreground mb-8 line-clamp-4">
            {book.description || "No description available for this book."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <div className="flex items-center border border-input rounded-md h-12 w-32 bg-background">
              <button 
                className="flex-1 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex-1 text-center font-medium">{quantity}</span>
              <button 
                className="flex-1 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button 
              size="lg" 
              className="flex-1 h-12 text-base font-medium group relative overflow-hidden"
              onClick={handleAddToCart}
            >
              <div className={`absolute inset-0 flex items-center justify-center bg-success text-success-foreground transition-transform duration-300 ${isAdded ? 'translate-y-0' : 'translate-y-full'}`}>
                <Check className="h-5 w-5 mr-2" /> Added to Cart
              </div>
              <div className={`flex items-center justify-center transition-transform duration-300 ${isAdded ? '-translate-y-full' : 'translate-y-0'}`}>
                <ShoppingCart className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Add to Cart
              </div>
            </Button>

            <Button size="icon" variant="outline" className="h-12 w-12 shrink-0">
              <Heart className="h-5 w-5 text-muted-foreground" />
            </Button>
            
            <Button size="icon" variant="outline" className="h-12 w-12 shrink-0 hidden sm:flex">
              <Share2 className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex border-b border-border mb-8 overflow-x-auto hide-scrollbar">
          <button 
            className={`pb-4 px-6 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'description' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`pb-4 px-6 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('details')}
          >
            Book Details
          </button>
          <button 
            className={`pb-4 px-6 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({book.reviews.length})
          </button>
        </div>

        <div className="max-w-3xl">
          {activeTab === 'description' && (
            <div className="prose prose-sm sm:prose-base dark:prose-invert">
              <p>{book.description || "No full description available."}</p>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Author</span>
                <span className="font-medium text-foreground">{book.author.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium text-foreground">{book.category?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Publication Year</span>
                <span className="font-medium text-foreground">{book.publishYear}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">ID</span>
                <span className="font-medium text-foreground">{book.id}</span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {book.reviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet for this book.</p>
              ) : (
                book.reviews.map((review: ReviewType) => (
                  <div key={review.id} className="border-b border-border pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{review.user.name}</p>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'fill-accent text-accent' : 'fill-muted text-muted'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mt-3">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
