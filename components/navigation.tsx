'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingBag } from 'lucide-react';
import { SettingsDropdown } from '@/components/settings-dropdown';

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-lime-600">BoxMate</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Sök efter produkter..."
                className="pl-10 pr-4"
              />
            </div>
          </div>

          {/* Navigation Links and Profile */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Översikt
              </Button>
            </Link>

            <Link href="/sell/new">
              <Button variant="accent" size="sm" className="bg-yellow-500 hover:bg-yellow-600">
                Sälj produkt
              </Button>
            </Link>

            {/* Settings Dropdown */}
            <SettingsDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}
