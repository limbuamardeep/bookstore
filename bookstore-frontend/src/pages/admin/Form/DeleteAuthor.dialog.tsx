import { useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { DELETE_AUTHOR, type AuthorsQuery } from '@/graphql/author';

type Author = AuthorsQuery['authors'][number];

interface DeleteAuthorDialogProps {
  author: Author;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteAuthorDialog({ author, onClose, onSuccess }: DeleteAuthorDialogProps) {
  const [deleteAuthor, { loading, error }] = useMutation(DELETE_AUTHOR, {
    onCompleted: () => {
      onSuccess();
      onClose();
    },
  });

  return (
    <Dialog open title="Delete author" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Delete <span className="font-medium text-foreground">{author.name}</span>? This action cannot be undone.
        </p>
        {error && <p role="alert" className="text-sm text-destructive">{error.message}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" disabled={loading} onClick={onClose}>Cancel</Button>
          <Button
            type="button"
            variant="danger"
            isLoading={loading}
            onClick={() => deleteAuthor({ variables: { id: author.id } })}
          >
            Delete author
          </Button>
        </div>
      </div>
    </Dialog>
  );
}