import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { AddCategoryForm } from './Form/AddCategory.form';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_CATEGORIES, DELETE_CATEGORY, type CategoriesQuery } from '@/graphql/category';

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  const { data, loading, error, refetch } = useQuery<CategoriesQuery>(GET_CATEGORIES);
  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => refetch(),
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory({ variables: { id } });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (isAddingCategory) {
    return <AddCategoryForm onCancel={() => setIsAddingCategory(false)} onSuccess={() => { setIsAddingCategory(false); refetch(); }} />;
  }

  const filteredCategories = data?.categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories Management</h1>
          <p className="text-sm text-muted-foreground">Manage your store's categories.</p>
        </div>
        <Button onClick={() => setIsAddingCategory(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add New Category
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search categories..." 
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading categories...</div>
          ) : error ? (
            <div className="p-8 text-center text-destructive">Error loading categories</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 font-medium">ID</th>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedCategories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                        No categories found.
                      </td>
                    </tr>
                  ) : (
                    paginatedCategories.map(category => (
                      <tr key={category.id} className="hover:bg-muted/20 transition-colors group">
                        <td className="px-6 py-4">{category.id}</td>
                        <td className="px-6 py-4 font-medium text-foreground">{category.name}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-primary/10">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(category.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded hover:bg-destructive/10">
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
              Showing {filteredCategories.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCategories.length)} of {filteredCategories.length} entries
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
