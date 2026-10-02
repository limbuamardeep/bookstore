import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { AddAuthorForm } from './Form/AddAuthor.form';
import { EditAuthorDialog } from './Form/EditAuthor.dialog';
import { DeleteAuthorDialog } from './Form/DeleteAuthor.dialog';
import { GET_AUTHORS, type AuthorsQuery } from '@/graphql/author';
import { useQuery } from '@apollo/client/react';

export default function Authors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingAuthor, setIsAddingAuthor] = useState(false);
  const [authorToEdit, setAuthorToEdit] = useState<AuthorsQuery['authors'][number] | null>(null);
  const [authorToDelete, setAuthorToDelete] = useState<AuthorsQuery['authors'][number] | null>(null);
  
  const { data, loading, error, refetch } = useQuery<AuthorsQuery>(GET_AUTHORS);

  if (isAddingAuthor) {
    return (
      <AddAuthorForm 
        onCancel={() => setIsAddingAuthor(false)} 
        onSuccess={() => {
          setIsAddingAuthor(false);
          refetch();
        }} 
      />
    );
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading authors...</div>;

  const authorsCount = data?.authors.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Authors Management</h1>
          <p className="text-sm text-muted-foreground">Manage your store's authors.</p>
        </div>
        <Button onClick={() => setIsAddingAuthor(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add New Author
        </Button>
      </div>
      {error? (<div className="container mx-auto px-4 py-8" role="alert">Could not load authors: {error.message}</div>):

      (<Card>
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search authors..." 
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className='px-6 py-3 font-medium'>Books</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.authors.map(author => (
                  <tr key={author.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4">{author.id}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{author.name}</td>
                    <td className='px-6 py-4 font-medium text-foreground'>
                      {author.books.length > 0 ? author.books.map(book => book.title).join(', ') : 'No books'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          aria-label={`Edit ${author.name}`}
                          title="Edit author"
                          onClick={() => setAuthorToEdit(author)}
                          className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-primary/10"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${author.name}`}
                          title="Delete author"
                          onClick={() => setAuthorToDelete(author)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
            <div>Showing {authorsCount === 0 ? 0 : 1} to {authorsCount} of {authorsCount} entries</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Prev</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>)}
      {authorToEdit && (
        <EditAuthorDialog
          author={authorToEdit}
          onClose={() => setAuthorToEdit(null)}
          onSuccess={() => refetch()}
        />
      )}
      {authorToDelete && (
        <DeleteAuthorDialog
          author={authorToDelete}
          onClose={() => setAuthorToDelete(null)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}

