'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ItemCard } from '@/components/item-card';
import { AddItemForm } from '@/components/add-item-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Item } from '@/lib/supabase';
import { Plus } from 'lucide-react';

interface DashboardItemsManagerProps {
  initialItems: Item[];
  initialSearchQuery?: string;
}

export function DashboardItemsManager({ initialItems, initialSearchQuery = '' }: DashboardItemsManagerProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

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

  return (
    <div>
      {/* Featured Items Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-stone-900">Senast tillagda produkter</h2>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-1">
              Visar {filteredItems.length} av {items.length} produkter för &quot;{searchQuery}&quot;
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lime-500 hover:bg-lime-600">
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
          <Button variant="outline">Visa alla</Button>
        </div>
      </div>

      {/* Items Grid */}
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
    </div>
  );
}
