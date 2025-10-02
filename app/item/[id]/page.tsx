import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockItems } from '@/data/mock-items';
import { MapPin, DollarSign, User, Calendar, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ItemImage } from '@/components/item-image';
import { ItemCard } from '@/components/item-card';

interface ItemDetailPageProps {
  params: {
    id: string;
  };
}

export default function ItemDetailPage({ params }: ItemDetailPageProps) {
  const item = mockItems.find(item => item.id === params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/dashboard" className="hover:text-lime-600">Dashboard</Link>
          <span>→</span>
          <span>Electronics</span>
          <span>→</span>
          <span className="text-stone-900">{item.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-lime-100 to-yellow-100 rounded-xl overflow-hidden">
              <ItemImage
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail gallery (placeholder) */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="aspect-square bg-stone-200 rounded-lg cursor-pointer hover:ring-2 hover:ring-lime-500 transition-all" />
              ))}
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Header with title and action buttons */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-stone-900 mb-2">{item.name}</h1>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
              </div>
              {/* Action icons */}
              <div className="flex gap-2 ml-4">
                <Button size="icon" variant="outline" className="w-10 h-10">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </Button>
                <Button size="icon" variant="outline" className="w-10 h-10">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3 3 0 000-2.075l4.94-2.47A3 3 0 0015 8z" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-lime-50 to-yellow-50 rounded-lg p-6 border border-lime-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-6 h-6 text-lime-600" />
                <span className="text-3xl font-bold text-lime-600">{item.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">Negotiable • Make an offer!</p>
            </div>

            {/* Divider */}
            <hr className="border-stone-200" />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-stone-900 mb-3">Description</h3>
              <p className="text-stone-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Seller Info */}
            <Card className="bg-stone-50 border-stone-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-lime-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-stone-900">Seller</h4>
                    <p className="text-sm text-muted-foreground">Member since 2024</p>
                  </div>
                  <Button size="sm" className="bg-lime-500 hover:bg-lime-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-7 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    Contact Seller
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full bg-lime-500 hover:bg-lime-600">
                Buy Now
              </Button>
              <Button size="lg" variant="outline" className="w-full">
                Make Offer
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-muted-foreground mb-4">
                  {item.description}
                </p>
                <p className="text-muted-foreground">
                  This item has been well-maintained and comes from a smoke-free home.
                  Perfect for students or anyone looking for reliable electronics at a great price.
                  Includes all original accessories and packaging.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Items */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockItems.filter(i => i.id !== item.id).slice(0, 3).map((relatedItem) => (
              <Link key={relatedItem.id} href={`/item/${relatedItem.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-lime-100 to-yellow-100 relative overflow-hidden">
                      <ItemImage
                        src={relatedItem.image}
                        alt={relatedItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2 line-clamp-2">{relatedItem.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lime-600 font-semibold">${relatedItem.value}</span>
                        <span className="text-sm text-muted-foreground">{relatedItem.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
