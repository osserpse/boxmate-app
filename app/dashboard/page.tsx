import { Navigation } from '@/components/navigation';
import { DashboardItemsManager } from '@/components/dashboard-items-manager';
import { DynamicCategories } from '@/components/dynamic-categories';
import { createClient, Item } from '@/lib/supabase';
import { TrendingUp, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

async function getItems(): Promise<Item[]> {
  const supabase = createClient()

  const { data: items, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching items:', error)
    return []
  }

  // Parse photos JSON if it exists for each item
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

interface DashboardPageProps {
  searchParams: {
    search?: string;
  };
}

// Generate dynamic categories and subcategories from items
function generateCategories(items: Item[]) {
  const categoryMap = new Map<string, Set<string>>();

  items.forEach(item => {
    if (item.category) {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, new Set());
      }

      if (item.subcategory) {
        categoryMap.get(item.category)!.add(item.subcategory);
      }
    }
  });

  const categories: Array<{
    category: string;
    subcategory?: string;
    label: string;
    sublabel?: string;
  }> = [];

  // Category labels mapping
  const categoryLabels: { [key: string]: string } = {
    'business': 'Affärsverksamhet',
    'electronics': 'Elektronik',
    'other': 'Övrigt'
  };

  // Subcategory labels mapping
  const subcategoryLabels: { [key: string]: string } = {
    'computers-gaming': 'Datorer och TV-spel',
    'audio-video': 'Ljud och Bild',
    'phones-accessories': 'Telefoner & tillbehör'
  };

  categoryMap.forEach((subcategories, category) => {
    const categoryLabel = categoryLabels[category] || category;

    if (subcategories.size === 0) {
      // Category without subcategories
      categories.push({
        category,
        label: categoryLabel
      });
    } else {
      // Category with subcategories - create separate buttons for each combination
      subcategories.forEach(subcategory => {
        const subcategoryLabel = subcategoryLabels[subcategory] || subcategory;
        categories.push({
          category,
          subcategory,
          label: categoryLabel,
          sublabel: subcategoryLabel
        });
      });
    }
  });

  return categories;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const items = await getItems()
  const initialSearchQuery = searchParams.search || '';
  const dynamicCategories = generateCategories(items);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="w-full px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Få överblick över Acme Groups saker
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Se vad som redan finns, vad som används och vad som kan gå vidare. Markera för återbruk eller försäljning – och undvik onödiga inköp.
          </p>

          {/* <div className="flex gap-6 justify-center">
            <Link href="/sell/new">
              <Button size="lg" variant="primary" className="bg-lime-500 hover:bg-lime-600">
                Sälj en produkt
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Bläddra kategorier
            </Button>
          </div> */}
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-lime-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-lime-700">1 247</h3>
            <p className="text-lime-600">Sålda produkter</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center">
            <MapPin className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-yellow-700">15</h3>
            <p className="text-yellow-600">Städer</p>
          </div>

          <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-stone-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-stone-700">892</h3>
            <p className="text-stone-600">Tevna användare</p>
          </div>
        </div> */}

        {/* Featured Items */}
        <div className="mb-16">
          <DashboardItemsManager initialItems={items} initialSearchQuery={initialSearchQuery} />
        </div>

        {/* Categories */}
        <DynamicCategories categories={dynamicCategories} />
      </main>

      {/* Footer */}
      <footer className="bg-stone-50 border-t mt-16">
        <div className="w-full px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p><b>&copy; 2025 BoxMate.</b> Överblick som sparar både pengar och planet.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
