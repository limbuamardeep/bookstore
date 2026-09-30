import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, Share2, ShoppingCart, Check, BookOpen, ChevronRight, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockBooks, mockReviews } from '@/data/mock';

export default function BookDetails() {
  const { id } = useParams();
  const book = mockBooks.find(b => b.id === (id || '1')) || mockBooks[0]; // fallback
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
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
        <span className="text-foreground">{book.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Gallery / Cover */}
        <div className="w-full lg:w-1/3 max-w-md mx-auto lg:mx-0">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl bg-muted group">
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
            />
            {book.discountPrice && (
              <Badge className="absolute top-4 left-4 bg-destructive text-white border-transparent px-3 py-1 text-sm shadow-md">Sale</Badge>
            )}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
            <BookOpen className="h-3 w-3" /> Hover to zoom
          </p>
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground leading-tight mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground">by <Link to={`/shop?author=${book.author}`} className="text-primary hover:underline">{book.author}</Link></p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-5 w-5 ${star <= Math.round(book.rating) ? 'fill-accent text-accent' : 'text-muted fill-muted'}`} 
                />
              ))}
            </div>
            <span className="text-sm font-medium">{book.rating} Rating</span>
            <span className="text-sm text-muted-foreground underline cursor-pointer hover:text-primary" onClick={() => setActiveTab('reviews')}>
              ({book.reviewCount} Reviews)
            </span>
          </div>

          <div className="flex items-end gap-3 pb-4 border-b border-border">
            {book.discountPrice ? (
              <>
                <span className="text-3xl font-bold text-foreground">${book.discountPrice.toFixed(2)}</span>
                <span className="text-lg text-muted-foreground line-through mb-1">${book.price.toFixed(2)}</span>
                <Badge variant="success" className="mb-2">Save ${(book.price - book.discountPrice).toFixed(2)}</Badge>
              </>
            ) : (
              <span className="text-3xl font-bold text-foreground">${book.price.toFixed(2)}</span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${book.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">{book.stock > 0 ? `In Stock (${book.stock} available)` : 'Out of Stock'}</span>
            </div>
            
            {book.format && (
              <p className="text-sm text-muted-foreground">Format: <span className="font-medium text-foreground">{book.format}</span></p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <div className="flex items-center border border-input rounded-md h-12 w-32">
              <button 
                className="flex-1 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground h-full rounded-l-md transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={book.stock === 0}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button 
                className="flex-1 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground h-full rounded-r-md transition-colors"
                onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                disabled={book.stock === 0}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <Button 
              size="lg" 
              className="flex-1 h-12 text-base font-medium"
              disabled={book.stock === 0}
              onClick={handleAddToCart}
            >
              {isAdded ? (
                <><Check className="h-5 w-5 mr-2" /> Added to Cart</>
              ) : (
                <><ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart</>
              )}
            </Button>
            
            <Button size="lg" variant="outline" className="h-12 w-12 px-0 flex-shrink-0">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 w-12 px-0 flex-shrink-0 hidden sm:flex">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="pt-8 flex gap-4 text-sm text-muted-foreground border-t border-border mt-8">
            <div className="flex-1 bg-muted/30 p-4 rounded-md text-center">
              <span className="block font-medium text-foreground mb-1">Free Shipping</span>
              On orders over $50
            </div>
            <div className="flex-1 bg-muted/30 p-4 rounded-md text-center">
              <span className="block font-medium text-foreground mb-1">Easy Returns</span>
              Within 30 days
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="flex border-b border-border overflow-x-auto">
          <button 
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'description' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('details')}
          >
            Product Details
          </button>
          <button 
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({book.reviewCount})
          </button>
        </div>

        <div className="py-8 min-h-[300px]">
          {activeTab === 'description' && (
            <div className="prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-3xl">
              <p className="leading-relaxed text-muted-foreground text-lg">{book.description}</p>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 max-w-3xl">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">ISBN</span>
                <span className="font-medium text-foreground">{book.isbn}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Publisher</span>
                <span className="font-medium text-foreground">{book.publisher}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Publication Date</span>
                <span className="font-medium text-foreground">{book.publicationDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Pages</span>
                <span className="font-medium text-foreground">{book.pages}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Language</span>
                <span className="font-medium text-foreground">{book.language}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Dimensions</span>
                <span className="font-medium text-foreground">{book.dimensions}</span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-4xl">
              <div className="flex flex-col md:flex-row gap-8 mb-10">
                <div className="bg-muted/30 p-6 rounded-lg text-center min-w-[200px]">
                  <h3 className="text-4xl font-bold text-foreground mb-2">{book.rating}</h3>
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-5 w-5 ${star <= Math.round(book.rating) ? 'fill-accent text-accent' : 'text-muted fill-muted'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Based on {book.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const percentage = rating === 5 ? 75 : rating === 4 ? 15 : rating === 3 ? 5 : rating === 2 ? 3 : 2;
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12 text-sm text-muted-foreground">
                          {rating} <Star className="h-3 w-3" />
                        </div>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="w-10 text-right text-sm text-muted-foreground">{percentage}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-8">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-8">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{review.userName}</p>
                          <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-accent text-accent' : 'text-muted fill-muted'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mt-3">{review.comment}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <button className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                        Helpful ({review.helpfulCount})
                      </button>
                      <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
