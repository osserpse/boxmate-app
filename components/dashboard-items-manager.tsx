'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ItemCard } from '@/components/item-card';
import { AddItemForm } from '@/components/add-item-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Item } from '@/lib/supabase';
import { Plus } from 'lucide-react';

interface DashboardItemsManagerProps {
  initialItems: Item[];
}

export function DashboardItemsManager({ initialItems }: DashboardItemsManagerProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemAdded = (newItem: Item) => {
    setItems(prevItems => [newItem, ...prevItems]);
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Featured Items Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-stone-900">Utvalda produkter</h2>
        <div className="flex gap-3">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lime-500 hover:bg-lime-600">
                <Plus className="w-4 h-4 mr-2" />
                Lägg till sak
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Sälj ny produkt</DialogTitle>
              </DialogHeader>
              <AddItemForm onItemAdded={handleItemAdded} />
            </DialogContent>
          </Dialog>
          <Button variant="outline">Visa alla</Button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
