'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Item } from '@/lib/supabase';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const formatCurrency = (value: number | null | undefined): string => {
    if (!value) return 'Ej specificerat';
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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
    <Link href={`/item/${item.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Image placeholder */}
        <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          <div className="w-full h-full bg-secondary relative overflow-hidden">
            {item.photo_url ? (
              <Image
                src={item.photo_url}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const placeholder = target.parentElement?.querySelector('.placeholder') as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
            ) : (
              <div className="placeholder absolute inset-0 bg-secondary flex items-center justify-center text-muted-foreground text-xs font-medium">
                {item.name}
              </div>
            )}

            {/* Condition Label Overlay */}
            {item.condition && (
              <div className="absolute top-2 left-2 bg-primary/80 text-primary-foreground px-2 py-1 rounded-md text-xs font-medium shadow-sm">
                Skick: {getConditionLabel(item.condition)}
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-foreground">{item.name}</h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            <span className="font-medium text-foreground">{item.lagerplats}.</span>
            {item.lokal && (
              <span className="text-xs">{item.lokal}</span>
            )}
            {item.hyllplats && (
              <span className="text-xs">{item.hyllplats}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-primary font-semibold">
              <span>{formatCurrency(item.value)}</span>
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
