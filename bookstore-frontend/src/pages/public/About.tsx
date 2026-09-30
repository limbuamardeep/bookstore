import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Our Story</p>
        <h1 className="text-4xl font-serif font-bold">A bookstore built for curious minds</h1>
        <p className="text-lg text-muted-foreground">
          The Bookery brings together timeless classics, modern favorites, and thoughtful recommendations in one welcoming space.
        </p>
        <div className="grid gap-4 md:grid-cols-3 text-left">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-2 text-lg font-semibold">Curated</h2>
            <p className="text-sm text-muted-foreground">Hand-picked titles across fiction, biography, and practical inspiration.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-2 text-lg font-semibold">Thoughtful</h2>
            <p className="text-sm text-muted-foreground">Reading recommendations designed around how you like to explore ideas.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-2 text-lg font-semibold">Community</h2>
            <p className="text-sm text-muted-foreground">A place for readers to discover, revisit, and share what they love.</p>
          </div>
        </div>
        <Link to="/shop" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Explore the collection
        </Link>
      </div>
    </div>
  )
}
