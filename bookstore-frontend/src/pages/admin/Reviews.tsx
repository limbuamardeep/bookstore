import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { AddReviewForm } from './Form/AddReview.form';
import { GET_REVIEWS, type ReviewsQuery } from '@/graphql/review';
import { useQuery } from '@apollo/client/react';

export default function Reviews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingReview, setIsAddingReview] = useState(false);
  
  const { data, loading, error } = useQuery<ReviewsQuery>(GET_REVIEWS);

  if (isAddingReview) {
    return <AddReviewForm onCancel={() => setIsAddingReview(false)} onSuccess={() => setIsAddingReview(false)} />;
  }

  const filteredReviews = data?.reviews.filter(r => 
    r.id.toString().includes(searchTerm) || 
    r.bookId.toString().includes(searchTerm) || 
    r.userId.toString().includes(searchTerm)
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews Management</h1>
          <p className="text-sm text-muted-foreground">Manage customer reviews.</p>
        </div>
        <Button onClick={() => setIsAddingReview(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add New Review
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search reviews by ID..." 
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading reviews...</div>
          ) : error ? (
            <div className="p-8 text-center text-destructive">Error loading reviews</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 font-medium">Review ID</th>
                    <th className="px-6 py-3 font-medium">Book ID</th>
                    <th className="px-6 py-3 font-medium">User ID</th>
                    <th className="px-6 py-3 font-medium">Rating</th>
                    <th className="px-6 py-3 font-medium">Comment</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        No reviews found.
                      </td>
                    </tr>
                  ) : (
                    filteredReviews.map(review => (
                      <tr key={review.id} className="hover:bg-muted/20 transition-colors group">
                        <td className="px-6 py-4">{review.id}</td>
                        <td className="px-6 py-4 text-muted-foreground">{review.bookId}</td>
                        <td className="px-6 py-4 text-muted-foreground">{review.userId}</td>
                        <td className="px-6 py-4 font-medium">{review.rating} / 5</td>
                        <td className="px-6 py-4 text-muted-foreground truncate max-w-50">{review.comment || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-primary/10">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded hover:bg-destructive/10">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
