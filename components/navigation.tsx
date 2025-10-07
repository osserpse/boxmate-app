'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, ShoppingBag } from 'lucide-react';
import { SettingsDropdown } from '@/components/settings-dropdown';
import { SearchBar } from '@/components/search-bar';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function NavigationSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  // Read search query from URL on mount and when URL changes
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search') || '';
    setSearchQuery(urlSearchQuery);
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Navigate to dashboard with search query as URL parameter
    if (query.trim()) {
      router.push(`/dashboard?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      placeholder="Sök efter produkter..."
      initialValue={searchQuery}
    />
  );
}

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
            <Suspense fallback={<div className="h-11 bg-muted rounded-md animate-pulse" />}>
              <NavigationSearch />
            </Suspense>
          </div>

          {/* Navigation Links and Profile */}
          <div className="flex items-center gap-3">
            {/* <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Översikt
              </Button>
            </Link>

            <Link href="/sell/new">
              <Button variant="accent" size="sm" className="bg-yellow-500 hover:bg-yellow-600">
                Sälj produkt
              </Button>
            </Link> */}

            {/* Settings Dropdown */}
            <SettingsDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}
