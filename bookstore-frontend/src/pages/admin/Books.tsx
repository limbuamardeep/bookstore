import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, Plus, Filter, Edit, Trash2 } from 'lucide-react';
import { AddBookForm } from './Form/AddBook.form';
import { EditBookDialog } from './Form/EditBook.dialog';
import { DeleteBookDialog } from './Form/DeleteBook.dialog';
import { useQuery } from '@apollo/client/react';
import { GET_BOOKS, type BooksQuery } from '@/graphql/books';

export default function Books() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isEditingBook, setIsEditingBook] = useState<BooksQuery['books'][number] | null>(null);
  const [isDeletingBook, setIsDeletingBook] = useState<BooksQuery['books'][number] | null>(null);
  
  const { data, loading, error, refetch } = useQuery<BooksQuery>(GET_BOOKS);
  
  if (isAddingBook) {
    return <AddBookForm onCancel={() => setIsAddingBook(false)} onSuccess={() => { setIsAddingBook(false); refetch(); }} />;
  }
  
  if (loading) return <div className="container mx-auto px-4 py-8">Loading books...</div>;
  if (error) return <div className="container mx-auto px-4 py-8" role="alert">Could not load books: {error.message}</div>;

  const filteredBooks = (data?.books || []).filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Books Management</h1>
          <p className="text-sm text-muted-foreground">Manage your store's inventory.</p>
        </div>
        <Button onClick={() => setIsAddingBook(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add New Book
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by title or author..." 
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>
        </div>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-3 font-medium">Book</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Stock</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedBooks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No books found.
                    </td>
                  </tr>
                ) : (
                  paginatedBooks.map(book => (
                    <tr key={book.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={book?.imageUrl||"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"} alt={book.title} className="h-12 w-8 object-cover rounded shadow-sm" />
                          <div>
                            <div className="font-medium text-foreground">{book.title}</div>
                            <div className="text-xs text-muted-foreground">{book.author.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{book.category?.name ?? 'Uncategorized'}</td>
                      <td className="px-6 py-4 font-medium">${book.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={book.stock < 10 ? (book.stock === 0 ? "text-destructive font-medium" : "text-warning font-medium") : ""}>
                          {book.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={book.stock === 0 ? 'destructive' : 'success'}>
                          {book.stock === 0 ? 'Out of Stock' : 'Published'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            aria-label={`Edit ${book.title}`}
                            title="Edit book"
                            onClick={() => setIsEditingBook(book)}
                            className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-primary/10"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${book.title}`}
                            title="Delete book"
                            onClick={() => setIsDeletingBook(book)}
                            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>
              Showing {filteredBooks.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBooks.length)} of {filteredBooks.length} entries
            </div>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <div className="flex items-center px-2">
                Page {currentPage} of {totalPages || 1}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {isEditingBook && (
        <EditBookDialog
          book={isEditingBook}
          onClose={() => setIsEditingBook(null)}
          onSuccess={() => refetch()}
        />
      )}
      {isDeletingBook && (
        <DeleteBookDialog
          book={isDeletingBook}
          onClose={() => setIsDeletingBook(null)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
