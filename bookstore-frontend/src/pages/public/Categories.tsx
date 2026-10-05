import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_CATEGORIES, type CategoriesQuery } from '@/graphql/category';

export default function Categories() {
  const { data, loading, error } = useQuery<CategoriesQuery>(GET_CATEGORIES);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-serif font-bold">Browse by category</h1>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading categories...</div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">Error loading categories.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {data?.categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="rounded-xl border border-border bg-card p-6 text-center transition hover:border-primary hover:shadow-md"
            >
              <span className="text-lg font-semibold text-foreground">{category.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
