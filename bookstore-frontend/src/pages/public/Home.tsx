import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockBooks, mockCategories } from '@/data/mock';

export default function Home() {
  const featuredBooks = mockBooks.slice(0, 4);

  return (
    <div className="flex flex-col gap-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-muted/30 pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
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
              <Link to="/about" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 border border-input bg-transparent hover:bg-muted hover:text-foreground">
                Our Story
              </Link>
            </div>
          </div>
          <div className="flex-1 relative hidden md:block">
            {/* Decorative Book Display */}
            <div className="relative w-full max-w-md mx-auto aspect-[3/4]">
              <img 
                src={mockBooks[0].coverImage} 
                alt="Featured Book" 
                className="absolute right-10 top-0 w-2/3 rounded-md shadow-2xl z-20 transform rotate-6 hover:rotate-0 transition-transform duration-500"
              />
              <img 
                src={mockBooks[1].coverImage} 
                alt="Featured Book 2" 
                className="absolute left-0 top-20 w-2/3 rounded-md shadow-xl z-10 transform -rotate-6 opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-serif font-bold">Browse Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockCategories.map((cat, i) => (
            <Link 
              key={i} 
              to={`/shop?category=${cat}`}
              className="p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all group flex flex-col items-center text-center gap-3"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="font-medium text-foreground">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">Bestselling Books</h2>
            <p className="text-muted-foreground">Our most popular reads this week.</p>
          </div>
          <Link to="/shop" className="text-primary font-medium flex items-center gap-1 hover:underline hidden sm:flex">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="container mx-auto px-4">
        <div className="rounded-2xl bg-secondary/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-secondary/20">
          <div className="max-w-xl space-y-4">
            <Badge variant="secondary" className="mb-2">Summer Sale</Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Buy 2, Get 1 Free on All Fiction
            </h2>
            <p className="text-muted-foreground text-lg">
              Stock up on your summer reading list with our special seasonal offer. Valid until August 31st.
            </p>
            <Button className="mt-4" size="lg" variant="secondary">Shop the Sale</Button>
          </div>
          <div className="hidden md:flex gap-4">
             {/* Decorative books for banner */}
             <img src={mockBooks[3].coverImage} className="w-24 rounded shadow-md transform -rotate-12" alt="" />
             <img src={mockBooks[2].coverImage} className="w-32 rounded shadow-lg z-10" alt="" />
             <img src={mockBooks[4].coverImage} className="w-24 rounded shadow-md transform rotate-12" alt="" />
          </div>
        </div>
      </section>

    </div>
  );
}

// Inline BookCard for simplicity, normally would be in components
function BookCard({ book }: { book: (typeof mockBooks)[number] }) {
  return (
    <Link to={`/book/${book.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-muted mb-2 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="object-cover w-full h-full"
        />
        {book.discountPrice && (
          <Badge className="absolute top-2 left-2 bg-destructive text-white border-transparent">Sale</Badge>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3 w-3 fill-accent text-accent" />
          <span className="text-xs font-medium">{book.rating}</span>
          <span className="text-xs text-muted-foreground">({book.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {book.discountPrice ? (
            <>
              <span className="font-semibold">${book.discountPrice.toFixed(2)}</span>
              <span className="text-xs text-muted-foreground line-through">${book.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-semibold">${book.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
