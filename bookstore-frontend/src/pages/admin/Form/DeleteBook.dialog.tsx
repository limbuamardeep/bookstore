import { useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { DELETE_BOOK, type BooksQuery } from '@/graphql/books';

type Book = BooksQuery['books'][number];

interface DeleteBookDialogProps {
  book: Book;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteBookDialog({ book, onClose, onSuccess }: DeleteBookDialogProps) {
  const [deleteBook, { loading, error }] = useMutation(DELETE_BOOK, {
    onCompleted: () => {
      onSuccess();
      onClose();
    },
  });

  return (
    <Dialog open title="Delete book" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Delete <span className="font-medium text-foreground">{book.title}</span>? This action cannot be undone.
        </p>
        {error && <p role="alert" className="text-sm text-destructive">{error.message}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" disabled={loading} onClick={onClose}>Cancel</Button>
          <Button
            type="button"
            variant="danger"
            isLoading={loading}
            onClick={() => deleteBook({ variables: { id: book.id } })}
          >
            Delete book
          </Button>
        </div>
      </div>
    </Dialog>
  );
}