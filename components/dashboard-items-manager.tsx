'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ItemCard } from '@/components/item-card';
import { AddItemForm } from '@/components/add-item-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Item } from '@/lib/supabase';
import { Plus, MapPin, Grid } from 'lucide-react';

interface DashboardItemsManagerProps {
  initialItems: Item[];
  initialSearchQuery?: string;
}

export function DashboardItemsManager({ initialItems, initialSearchQuery = '' }: DashboardItemsManagerProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [viewMode, setViewMode] = useState<'grid' | 'location'>('grid');

  // Update search query when initialSearchQuery prop changes
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  const handleItemAdded = (newItem: Item) => {
    setItems(prevItems => [newItem, ...prevItems]);
    setIsModalOpen(false);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleShowAll = () => {
    setSearchQuery('');
  };

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.toLowerCase().trim();
    return items.filter(item => {
      const name = item.name?.toLowerCase() || '';
      const description = item.description?.toLowerCase() || '';
      const lagerplats = item.lagerplats?.toLowerCase() || '';
      const lokal = item.lokal?.toLowerCase() || '';
      const hyllplats = item.hyllplats?.toLowerCase() || '';
      const category = item.category?.toLowerCase() || '';
      const subcategory = item.subcategory?.toLowerCase() || '';

      return (
        name.includes(query) ||
        description.includes(query) ||
        lagerplats.includes(query) ||
        lokal.includes(query) ||
        hyllplats.includes(query) ||
        category.includes(query) ||
        subcategory.includes(query)
      );
    });
  }, [items, searchQuery]);

  // Group items by location for location view
  const groupedItems = useMemo(() => {
    const groups = new Map<string, Item[]>();

    filteredItems.forEach(item => {
      const lagerplats = item.lagerplats || 'Okänd plats';
      const lokal = item.lokal || '';

      // Create location key: "Lagerplats > Lokal" or just "Lagerplats" if no lokal
      const locationKey = lokal ? `${lagerplats} > ${lokal}` : lagerplats;

      if (!groups.has(locationKey)) {
        groups.set(locationKey, []);
      }
      groups.get(locationKey)!.push(item);
    });

    // Convert to array and sort by location name
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredItems]);

  return (
    <div>
      {/* Featured Items Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-foreground">Senast tillagda produkter</h2>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-1">
              Visar {filteredItems.length} av {items.length} produkter för &quot;{searchQuery}&quot;
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Lägg till produkt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Lägg till ny produkt</DialogTitle>
              </DialogHeader>
              <AddItemForm onItemAdded={handleItemAdded} />
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'location' : 'grid')}
            className="flex items-center gap-2"
          >
            {viewMode === 'grid' ? (
              <>
                <MapPin className="w-4 h-4" />
                Visa per plats
              </>
            ) : (
              <>
                <Grid className="w-4 h-4" />
                Visa rutnät
              </>
            )}
          </Button>
            <Button variant="outline" onClick={handleShowAll}>Visa alla</Button>
        </div>
      </div>

      {/* Items Display */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))
          ) : searchQuery ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                Inga produkter hittades för &quot;{searchQuery}&quot;
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Prova att söka efter något annat eller rensa sökningen
              </p>
            </div>
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                Inga produkter är registrerade ännu
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Lägg till din första produkt för att komma igång
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Location View */
        <div className="space-y-0">
          {groupedItems.length > 0 ? (
            groupedItems.map(([locationKey, locationItems], index) => (
              <div
                key={locationKey}
                className={`space-y-4 p-6 rounded-lg ${
                  index % 2 === 0
                    ? 'bg-background'
                    : 'bg-muted'
                }`}
              >
                 <h3 className="text-xl font-semibold text-primary border-b border-border pb-2">
                  {locationKey}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {locationItems.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))
          ) : searchQuery ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Inga produkter hittades för &quot;{searchQuery}&quot;
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Prova att söka efter något annat eller rensa sökningen
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Inga produkter är registrerade ännu
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Lägg till din första produkt för att komma igång
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
