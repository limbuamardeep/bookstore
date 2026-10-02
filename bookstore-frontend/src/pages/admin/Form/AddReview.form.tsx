import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import { ADD_REVIEW } from '@/graphql/review';
import { GET_USERS, type UsersQuery } from '@/graphql/user';
import { GET_BOOKS, type BooksQuery } from '@/graphql/books';
import { Combobox } from '@/components/ui/Combobox';
import { useMutation, useQuery } from '@apollo/client/react';

interface AddReviewFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export function AddReviewForm({ onCancel, onSuccess }: AddReviewFormProps) {
  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [validationError, setValidationError] = useState('');

  const { data: usersData, loading: loadingUsers } = useQuery<UsersQuery>(GET_USERS);
  const { data: booksData, loading: loadingBooks } = useQuery<BooksQuery>(GET_BOOKS);

  const [addReview, { loading, error }] = useMutation(ADD_REVIEW, {
    onCompleted: () => {
      setUserId('');
      setBookId('');
      setRating('5');
      setComment('');
      if (onSuccess) onSuccess();
      else onCancel();
    },
    refetchQueries: ['GetReviews'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !bookId) {
      setValidationError('User and Book are required');
      return;
    }
    setValidationError('');
    addReview({ variables: { userId: parseInt(userId, 10), bookId: parseInt(bookId, 10), rating: parseInt(rating, 10), comment } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New Review</h1>
            <p className="text-sm text-muted-foreground">Add a product review manually.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">User *</label>
                <Combobox
                  options={usersData?.users.map(u => ({ label: `${u.name} (${u.email})`, value: u.id })) || []}
                  value={userId}
                  onChange={setUserId}
                  placeholder="Select a user"
                  disabled={loadingUsers}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Book *</label>
                <Combobox
                  options={booksData?.books.map(b => ({ label: b.title, value: b.id })) || []}
                  value={bookId}
                  onChange={setBookId}
                  placeholder="Select a book"
                  disabled={loadingBooks}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating (1-5) *</label>
              <Input type="number" min="1" max="5" required value={rating} onChange={e => setRating(e.target.value)} placeholder="5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comment</label>
              <Input value={comment} onChange={e => setComment(e.target.value)} placeholder="Great book..." />
            </div>

            {validationError && <div className="text-destructive text-sm mt-2">{validationError}</div>}
            {error && <div className="text-destructive text-sm mt-2">Error: {error.message}</div>}

            <div className="pt-4 flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Review'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
