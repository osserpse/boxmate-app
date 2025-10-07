'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, ShoppingBag } from 'lucide-react';
import { SettingsDropdown } from '@/components/settings-dropdown';
import { SearchBar } from '@/components/search-bar';
import { ThemeToggle } from '@/components/theme-toggle';
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
    <nav className="sticky top-0 z-50 border-b bg-gradient-to-b from-[hsl(var(--nav-gradient-start))] via-[hsl(var(--nav-gradient-middle))] to-[hsl(var(--nav-gradient-end))] backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Mobile Layout: Two rows with container */}
      <div className="md:hidden">
        <div className="container mx-auto px-4 py-4">
          {/* First Row: Logo and User Profile */}
          <div className="flex items-center justify-between gap-4 mb-3">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-primary">BoxMate</span>
            </Link>

            {/* Theme Toggle and Settings Dropdown */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <SettingsDropdown />
            </div>
          </div>

          {/* Second Row: Search Bar */}
          <div>
            <Suspense fallback={<div className="h-11 bg-muted rounded-md animate-pulse" />}>
              <NavigationSearch />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Desktop Layout: Full width single row */}
      <div className="hidden md:flex md:items-center md:gap-8 md:px-8 md:py-4 md:w-full">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-primary">BoxMate</span>
        </Link>

        {/* Search Bar - fills available space */}
        <div className="flex-1 mx-8">
          <Suspense fallback={<div className="h-11 bg-muted rounded-md animate-pulse" />}>
            <NavigationSearch />
          </Suspense>
        </div>

        {/* Theme Toggle and Settings Dropdown */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeToggle />
          <SettingsDropdown />
        </div>
      </div>
    </nav>
  );
}
