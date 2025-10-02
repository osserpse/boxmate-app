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
            <div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2">{item.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Posted 2 days ago</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <Card className="bg-gradient-to-r from-lime-50 to-yellow-50 border-lime-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Asking Price</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-lime-600" />
                      <span className="text-3xl font-bold text-lime-600">{item.value}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-stone-900">Negotiable</p>
                    <p className="text-sm text-muted-foreground">Make an offer!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">About the Seller</h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-stone-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-stone-900 mb-1">John Doe</h4>
                    <p className="text-sm text-muted-foreground mb-2">Verified Seller • 47 sales</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full bg-lime-500 hover:bg-lime-600">
                Contact Seller
              </Button>
              <Button size="lg" variant="outline" className="w-full">
                Make an Offer
              </Button>
              <Button size="lg" variant="accent" className="w-full bg-yellow-500 hover:bg-yellow-600">
                Save for Later
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
