import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { AddReviewForm } from './Form/AddReview.form';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_REVIEWS, DELETE_REVIEW, type ReviewsQuery } from '@/graphql/review';

export default function Reviews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isAddingReview, setIsAddingReview] = useState(false);
  
  const { data, loading, error, refetch } = useQuery<ReviewsQuery>(GET_REVIEWS);
  const [deleteReview] = useMutation(DELETE_REVIEW, {
    onCompleted: () => refetch(),
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteReview({ variables: { id } });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (isAddingReview) {
    return <AddReviewForm onCancel={() => setIsAddingReview(false)} onSuccess={() => { setIsAddingReview(false); refetch(); }} />;
  }

  const filteredReviews = data?.reviews.filter(r => 
    r.id.toString().includes(searchTerm) || 
    r.bookId.toString().includes(searchTerm) || 
    r.userId.toString().includes(searchTerm)
  ) || [];

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

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
              onChange={handleSearch}
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
                  {paginatedReviews.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        No reviews found.
                      </td>
                    </tr>
                  ) : (
                    paginatedReviews.map(review => (
                      <tr key={review.id} className="hover:bg-muted/20 transition-colors group">
                        <td className="px-6 py-4">{review.id}</td>
                        <td className="px-6 py-4 text-muted-foreground">{review.bookId}</td>
                        <td className="px-6 py-4 text-muted-foreground">{review.userId}</td>
                        <td className="px-6 py-4 font-medium">{review.rating} / 5</td>
                        <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">{review.comment || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-primary/10">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(review.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded hover:bg-destructive/10">
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
          
          <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>
              Showing {filteredReviews.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReviews.length)} of {filteredReviews.length} entries
            </div>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <div className="flex items-center px-2">
                Page {currentPage} of {totalPages || 1}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
