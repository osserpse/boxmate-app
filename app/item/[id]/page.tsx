import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient, Item } from '@/lib/supabase';
import { MapPin, Calendar, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ItemImage } from '@/components/item-image';
import { ItemActions } from '@/components/item-actions';
import { Separator } from '@/components/ui/separator';

interface ItemDetailPageProps {
  params: {
    id: string;
  };
}

async function getItem(id: string): Promise<Item | null> {
  const supabase = createClient()

  const { data: item, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching item:', error)
    return null
  }

  // Parse photos JSON if it exists
  if (item && item.photos && typeof item.photos === 'string') {
    try {
      item.photos = JSON.parse(item.photos)
    } catch (error) {
      console.error('Error parsing photos JSON:', error)
      item.photos = []
    }
  }

  return item
}

async function getRelatedItems(excludeId: string): Promise<Item[]> {
  const supabase = createClient()

  const { data: items, error } = await supabase
    .from('items')
    .select('*')
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Error fetching related items:', error)
    return []
  }

  // Parse photos JSON for each item if it exists
  if (items) {
    items.forEach(item => {
      if (item.photos && typeof item.photos === 'string') {
        try {
          item.photos = JSON.parse(item.photos)
        } catch (error) {
          console.error('Error parsing photos JSON:', error)
          item.photos = []
        }
      }
    })
  }

  return items || []
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const [item, relatedItems] = await Promise.all([
    getItem(params.id),
    getRelatedItems(params.id)
  ]);

  if (!item) {
    notFound();
  }

  // Prepare photo arrays for display
  const allPhotos = item.photos && Array.isArray(item.photos) ? item.photos :
                   (item.photo_url ? [item.photo_url] : []);
  const mainPhoto = allPhotos[0] || null;
  const thumbnailPhotos = allPhotos.slice(0, 3); // Show up to 3 thumbnails

  const formatCurrency = (value: number | null | undefined): string => {
    if (!value) return 'Ej specificerat';
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getCategoryLabel = (category: string): string => {
    const categories: { [key: string]: string } = {
      'business': 'Affärsverksamhet (företag)',
      'electronics': 'Elektronik',
      'other': 'Övrigt'
    };
    return categories[category] || category;
  };

  const getSubcategoryLabel = (subcategory: string): string => {
    const subcategories: { [key: string]: string } = {
      'computers-gaming': 'Datorer och TV-spel',
      'audio-video': 'Ljud och Bild',
      'phones-accessories': 'Telefoner & tillbehör'
    };
    return subcategories[subcategory] || subcategory;
  };

  const getConditionLabel = (condition: string): string => {
    const conditions: { [key: string]: string } = {
      'new': 'Nytt skick - Helt ny',
      'excellent': 'Mycket bra skick - Som ny',
      'good': 'Bra skick - Sparsamt använd',
      'fair': 'Okej skick - Synligt använd',
      'broken': 'Funkar inte - Kan fixas'
    };
    return conditions[condition] || condition;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/dashboard" className="hover:text-lime-600">Översikt</Link>
          <span>→</span>
          <span>{getCategoryLabel(item.category || 'other')}</span>
          {item.category === 'electronics' && item.subcategory && (
            <>
              <span>→</span>
              <span>{getSubcategoryLabel(item.subcategory)}</span>
            </>
          )}
          <span>→</span>
          <span className="text-stone-900">{item.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-lg relative mb-8">
              <ItemImage
                src={mainPhoto}
                alt={item.name}
                className="absolute inset-0 object-cover"
                priority={true}
              />

              {/* Condition Label Overlay */}
              {item.condition && (
                <div className="absolute top-4 left-4 bg-primary/80 text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                  Skick: {getConditionLabel(item.condition)}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-8">
              {thumbnailPhotos.map((photo, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden bg-muted/50 border border-border cursor-pointer hover:opacity-80 transition-opacity relative"
                >
                  <ItemImage
                    src={photo}
                    alt={`${item.name} view ${i + 1}`}
                    className="absolute inset-0 object-cover"
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

              <Separator />
              <div className=" my-4">
                <h2 className="text-xl font-semibold text-foreground mb-3">Beskrivning</h2>
                <p className="text-lg leading-relaxed">
                  {item.description || 'Ingen beskrivning tillgänglig.'}
                </p>
              </div>

              <div className="flex items-center gap-2 my-4 bg-muted p-4 rounded-lg">
                <MapPin className="w-5 h-5" />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.lagerplats}</span>
                  {item.lokal && (
                    <span className="text-sm">Lokal: <span className="font-medium">{item.lokal}</span></span>
                  )}
                  {item.hyllplats && (
                    <span className="text-sm">Hyllplats: <span className="font-medium">{item.hyllplats}</span></span>
                  )}
                </div>
              </div>

              {/* Category Information */}
              <div className="flex items-center gap-4 mt-4 bg-muted p-4 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-sm">Värde</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(item.value)}
                  </span>
                </div>
                <span className="text-sm">
                  Tillgång i kategori: <span className="font-medium">{getCategoryLabel(item.category || 'other')}</span>
                </span>
                {item.category === 'electronics' && item.subcategory && (
                  <>
                    <span className="text-sm">
                      Underkategori: <span className="font-medium">{getSubcategoryLabel(item.subcategory)}</span>
                    </span>
                  </>
                )}
                {item.condition && (
                  <>
                    <span className="text-sm">
                      Skick: <span className="font-medium">{getConditionLabel(item.condition)}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Seller Info */}
            {/* <Card className="bg-stone-50 border-stone-200">
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
            </Card> */}


            {/* Item Actions */}
            <ItemActions
              itemId={item.id}
              itemName={item.name}
              itemLagerplats={item.lagerplats}
              itemLokal={item.lokal}
              itemHyllplats={item.hyllplats}
              itemDescription={item.description || ''}
              itemValue={item.value}
              itemPhotos={item.photos}
              itemCategory={item.category}
              itemSubcategory={item.subcategory}
              itemCondition={item.condition}
            />

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Publicerad {new Date(item.created_at).toLocaleDateString('sv-SE')}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />
        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-base sm:text-2xl font-bold mb-6 text-foreground">Liknande produkter</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {relatedItems.map((relatedItem) => (
                <Link key={relatedItem.id} href={`/item/${relatedItem.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gradient-to-br from-lime-100 to-yellow-100 relative overflow-hidden">
                        <ItemImage
                          src={relatedItem.photo_url || null}
                          alt={relatedItem.name}
                          className="w-full h-full object-cover"
                        />

                        {/* Condition Label Overlay */}
                        {relatedItem.condition && (
                          <div className="absolute top-2 left-2 bg-primary/80 text-primary-foreground px-2 py-1 rounded-md text-xs font-medium shadow-sm">
                            Skick: {getConditionLabel(relatedItem.condition)}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-2 line-clamp-2 text-foreground">{relatedItem.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-semibold">{formatCurrency(relatedItem.value)}</span>
                          <span className="text-sm text-muted-foreground">{relatedItem.lagerplats}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}