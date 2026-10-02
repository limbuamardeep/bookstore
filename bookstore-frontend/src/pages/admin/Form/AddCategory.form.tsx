import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import { ADD_CATEGORY } from '@/graphql/category';
import { useMutation } from '@apollo/client/react';

interface AddCategoryFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export function AddCategoryForm({ onCancel, onSuccess }: AddCategoryFormProps) {
  const [name, setName] = useState('');

  const [addCategory, { loading, error }] = useMutation(ADD_CATEGORY, {
    onCompleted: () => {
      setName('');
      if (onSuccess) onSuccess();
      else onCancel();
    },
    refetchQueries: ['GetCategories'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory({ variables: { name } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New Category</h1>
            <p className="text-sm text-muted-foreground">Add a new book category.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input required value={name} onChange={e => setName(e.target.value)} placeholder="Category Name" />
            </div>

            {error && <div className="text-destructive text-sm mt-2">Error: {error.message}</div>}

            <div className="pt-4 flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Category'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
