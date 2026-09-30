import { Link } from 'react-router-dom'
import { mockCategories } from '@/data/mock'

export default function Categories() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-serif font-bold">Browse by category</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockCategories.map((category) => (
          <Link
            key={category}
            to={`/shop?category=${encodeURIComponent(category)}`}
            className="rounded-xl border border-border bg-card p-6 text-center transition hover:border-primary hover:shadow-md"
          >
            <span className="text-lg font-semibold text-foreground">{category}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
