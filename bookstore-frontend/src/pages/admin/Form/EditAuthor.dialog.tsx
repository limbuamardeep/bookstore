import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { UPDATE_AUTHOR, type AuthorsQuery } from '@/graphql/author';

type Author = AuthorsQuery['authors'][number];

interface EditAuthorDialogProps {
  author: Author;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditAuthorDialog({ author, onClose, onSuccess }: EditAuthorDialogProps) {
  const [name, setName] = useState(author.name);
  const [updateAuthor, { loading, error }] = useMutation(UPDATE_AUTHOR, {
    onCompleted: () => {
      onSuccess();
      onClose();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateAuthor({ variables: { id: author.id, name: name.trim() } });
  };

  return (
    <Dialog open title="Edit author" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="author-name" className="mb-1 block text-sm font-medium">Name</label>
          <Input
            id="author-name"
            required
            autoFocus
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error.message}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" disabled={loading} onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={loading} disabled={!name.trim()}>Save changes</Button>
        </div>
      </form>
    </Dialog>
  );
}