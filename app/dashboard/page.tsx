import { Navigation } from '@/components/navigation';
import { ItemCard } from '@/components/item-card';
import { mockItems } from '@/data/mock-items';
import { TrendingUp, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Discover Amazing Items Near You
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            From electronics to furniture, find what you need or sell what you don't.
            Connect with your local community through BoxMate.
          </p>

          <div className="flex gap-6 justify-center">
            <Link href="/sell/new">
              <Button size="lg" variant="primary" className="bg-lime-500 hover:bg-lime-600">
                Sell an Item
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Browse Categories
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-lime-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-lime-700">1,247</h3>
            <p className="text-lime-600">Items Sold</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center">
            <MapPin className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-yellow-700">15</h3>
            <p className="text-yellow-600">Cities Covered</p>
          </div>

          <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-stone-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-stone-700">892</h3>
            <p className="text-stone-600">Happy Users</p>
          </div>
        </div>

        {/* Featured Items */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-stone-900">Featured Items</h2>
            <Button variant="outline">View All</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-stone-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Electronics', 'Clothing', 'Books', 'Sports', 'Home & Garden', 'Toys'
            ].map((category) => (
              <div key={category} className="bg-stone-50 hover:bg-stone-100 rounded-lg p-4 text-center cursor-pointer transition-colors">
                <h3 className="font-medium text-stone-900">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-50 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 BoxMate. Making local commerce fun and accessible.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
