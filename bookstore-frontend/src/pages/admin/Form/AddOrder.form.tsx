import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import { ADD_ORDER } from '@/graphql/order';
import { GET_USERS, type UsersQuery } from '@/graphql/user';
import { Combobox } from '@/components/ui/Combobox';
import { useMutation, useQuery } from '@apollo/client/react';

interface AddOrderFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export function AddOrderForm({ onCancel, onSuccess }: AddOrderFormProps) {
  const [userId, setUserId] = useState('');
  const [total, setTotal] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [validationError, setValidationError] = useState('');

  const { data: usersData, loading: loadingUsers } = useQuery<UsersQuery>(GET_USERS);

  const [addOrder, { loading, error }] = useMutation(ADD_ORDER, {
    onCompleted: () => {
      setUserId('');
      setTotal('');
      setStatus('PENDING');
      if (onSuccess) onSuccess();
      else onCancel();
    },
    refetchQueries: ['GetOrders'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setValidationError('User is required');
      return;
    }
    setValidationError('');
    addOrder({ variables: { userId: parseInt(userId, 10), total: parseFloat(total), status } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New Order</h1>
            <p className="text-sm text-muted-foreground">Create a new order manually.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
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
              <label className="block text-sm font-medium mb-1">Total Amount *</label>
              <Input type="number" step="0.01" required value={total} onChange={e => setTotal(e.target.value)} placeholder="99.99" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={status} 
                onChange={e => setStatus(e.target.value)}
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            {validationError && <div className="text-destructive text-sm mt-2">{validationError}</div>}
            {error && <div className="text-destructive text-sm mt-2">Error: {error.message}</div>}

            <div className="pt-4 flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Order'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
