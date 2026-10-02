import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { UPDATE_BOOK, type BooksQuery } from '@/graphql/books';
import { Combobox } from '@/components/ui/Combobox';
import { GET_AUTHORS, type AuthorsQuery } from '@/graphql/author';
import { GET_CATEGORIES, type CategoriesQuery } from '@/graphql/category';
import { useMutation, useQuery } from '@apollo/client/react';

type Book = BooksQuery['books'][number];

interface EditBookDialogProps {
  book: Book;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditBookDialog({ book, onClose, onSuccess }: EditBookDialogProps) {
  const [title, setTitle] = useState(book.title);
  const [price, setPrice] = useState(String(book.price));
  const [stock, setStock] = useState(String(book.stock));
  const [featured, setFeatured] = useState(book.featured);
  const [publishYear, setPublishYear] = useState(String(book.publishYear));
  const [authorId, setAuthorId] = useState(String(book.authorId));
  const [categoryId, setCategoryId] = useState(book.categoryId ? String(book.categoryId) : '');
  const [imageUrl, setImageUrl] = useState(book.imageUrl || '');
  const [description, setDescription] = useState(book.description || '');
  const [validationError, setValidationError] = useState('');

  const { data: authorsData, loading: loadingAuthors } = useQuery<AuthorsQuery>(GET_AUTHORS);
  const { data: categoriesData, loading: loadingCategories } = useQuery<CategoriesQuery>(GET_CATEGORIES);

  const [updateBook, { loading, error }] = useMutation(UPDATE_BOOK, {
    onCompleted: () => {
      onSuccess();
      onClose();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authorId) {
      setValidationError('Author is required');
      return;
    }
    setValidationError('');
    updateBook({
      variables: {
        id: book.id,
        title: title.trim(),
        price: Number(price),
        stock: Number(stock),
        featured,
        publishYear: parseInt(publishYear, 10),
        authorId: parseInt(authorId, 10),
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
        imageUrl: imageUrl.trim() || null,
        description: description.trim() || null,
      },
    });
  };

  return (
    <Dialog open title="Edit book" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="book-title" className="mb-1 block text-sm font-medium">Title *</label>
          <Input
            id="book-title"
            required
            autoFocus
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="book-price" className="mb-1 block text-sm font-medium">Price *</label>
            <Input
              id="book-price"
              type="number"
              min="0"
              step="0.01"
              required
              value={price}
              onChange={event => setPrice(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="book-stock" className="mb-1 block text-sm font-medium">Stock *</label>
            <Input
              id="book-stock"
              type="number"
              min="0"
              step="1"
              required
              value={stock}
              onChange={event => setStock(event.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Publish Year *</label>
            <Input
              type="number"
              required
              value={publishYear}
              onChange={event => setPublishYear(event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Author *</label>
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
          <label className="mb-1 block text-sm font-medium">Category</label>
          <Combobox
            options={categoriesData?.categories.map(c => ({ label: c.name, value: c.id })) || []}
            value={categoryId}
            onChange={setCategoryId}
            placeholder="No Category"
            disabled={loadingCategories}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Image URL</label>
          <Input
            value={imageUrl}
            onChange={event => setImageUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <Input
            value={description}
            onChange={event => setDescription(event.target.value)}
            placeholder="A great book..."
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={featured} onChange={event => setFeatured(event.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
          Featured book
        </label>
        
        {validationError && <p role="alert" className="text-sm text-destructive">{validationError}</p>}
        {error && <p role="alert" className="text-sm text-destructive">{error.message}</p>}
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" disabled={loading} onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!title.trim() || loading}>
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
