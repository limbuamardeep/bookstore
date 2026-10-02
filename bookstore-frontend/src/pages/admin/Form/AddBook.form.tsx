import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import { ADD_BOOK } from '@/graphql/books';
import { GET_AUTHORS, type AuthorsQuery } from '@/graphql/author';
import { GET_CATEGORIES, type CategoriesQuery } from '@/graphql/category';
import { useMutation, useQuery } from '@apollo/client/react';
import { Combobox } from '@/components/ui/Combobox';

interface AddBookFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export function AddBookForm({ onCancel, onSuccess }: AddBookFormProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [validationError, setValidationError] = useState('');

  const { data: authorsData, loading: loadingAuthors } = useQuery<AuthorsQuery>(GET_AUTHORS);
  const { data: categoriesData, loading: loadingCategories } = useQuery<CategoriesQuery>(GET_CATEGORIES);

  const [addBookMutation, { loading, error }] = useMutation(ADD_BOOK, {
    onCompleted: () => {
      setTitle('');
      setPrice('');
      setPublishYear('');
      setAuthorId('');
      setDescription('');
      setStock('');
      setImageUrl('');
      setFeatured(false);
      setCategoryId('');
      setValidationError('');
      
      if (onSuccess) {
        onSuccess();
      } else {
        onCancel();
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorId) {
      setValidationError('Author is required');
      return;
    }
    setValidationError('');
    addBookMutation({
      variables: {
        title,
        price: parseFloat(price),
        publishYear: parseInt(publishYear, 10),
        authorId: parseInt(authorId, 10),
        description: description || null,
        stock: stock ? parseInt(stock, 10) : null,
        imageUrl: imageUrl || null,
        featured,
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New Book</h1>
            <p className="text-sm text-muted-foreground">Add a new book to the inventory.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Book Title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price *</label>
                <Input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} placeholder="9.99" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <Input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Publish Year *</label>
                <Input type="number" required value={publishYear} onChange={e => setPublishYear(e.target.value)} placeholder="2023" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author *</label>
                <Combobox
                  options={authorsData?.authors.map(a => ({ label: a.name, value: a.id })) || []}
                  value={authorId}
                  onChange={setAuthorId}
                  placeholder="Select an author"
                  disabled={loadingAuthors}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Combobox
                options={categoriesData?.categories.map(c => ({ label: c.name, value: c.id })) || []}
                value={categoryId}
                onChange={setCategoryId}
                placeholder="No Category"
                disabled={loadingCategories}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="A great book..." />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
              <label htmlFor="featured" className="text-sm font-medium">Featured Book</label>
            </div>

            {validationError && <div className="text-destructive text-sm mt-2">{validationError}</div>}
            {error && <div className="text-destructive text-sm mt-2">Error: {error.message}</div>}

            <div className="pt-4 flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Book'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
