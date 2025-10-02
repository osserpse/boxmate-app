import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockItems, formatCurrency } from '@/data/mock-items';
import { MapPin, User, Calendar, Phone, Mail, MessageCircle, Heart, Share2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ItemImage } from '@/components/item-image';
import { ItemCard } from '@/components/item-card';
import { Separator } from '@/components/ui/separator';
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
          <Link href="/dashboard" className="hover:text-lime-600">Översikt</Link>
          <span>→</span>
          <span>Elektronik</span>
          <span>→</span>
          <span className="text-stone-900">{item.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-lg">
              <img
                src={item.photo}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden bg-muted/50 border border-border cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    src={item.photo}
                    alt={`${item.name} view ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-4xl font-semibold text-foreground">{item.name}</h1>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" className="rounded-full">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{item.location}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-primary">
                  {formatCurrency(item.value)}
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Beskrivning</h2>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            <Separator />

            {/* Seller Info */}
            <Card className="bg-stone-50 border-stone-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-lime-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-stone-900">Säljare</h4>
                    <p className="text-sm text-muted-foreground">Medlem sedan 2024</p>
                  </div>
                  <Button size="sm" className="bg-lime-500 hover:bg-lime-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-7 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    Kontakta säljare
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="flex-1 gap-2 shadow-md hover:shadow-lg transition-shadow">
                Köp nu
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                Gör bud
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Publicerad {item.createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Beskrivning</h2>
              <div className="prose max-w-none">
                <p className="text-muted-foreground mb-4">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>




        {/* Related Items */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Liknande produkter</h2>
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
                        <span className="text-lime-600 font-semibold">{formatCurrency(relatedItem.value)}</span>
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
