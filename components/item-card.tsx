'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Item } from '@/data/mock-items';
import Link from 'next/link';
import { MapPin, DollarSign } from 'lucide-react';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/item/${item.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Image placeholder */}
        <div className="aspect-square bg-gradient-to-br from-lime-100 to-yellow-100 flex items-center justify-center">
          <div className="w-full h-full bg-stone-100 relative overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = target.parentElement?.querySelector('.placeholder') as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
            <div className="placeholder absolute inset-0 bg-stone-100 flex items-center justify-center text-stone-400 text-xs font-medium"
                 style={{ display: 'none' }}>
              {item.name}
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.name}</h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            <span>{item.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-lime-600 font-semibold">
              <DollarSign className="w-4 h-4" />
              <span>{item.value}</span>
            </div>

            <Button size="sm" variant="outline" className="text-xs">
              Visa detaljer
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
