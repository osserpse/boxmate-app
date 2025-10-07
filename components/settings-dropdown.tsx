'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Settings, Building, MapPin, CreditCard, Users, Zap, HelpCircle, LogOut, ChevronDown, BarChart3 } from 'lucide-react';

export function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logging out...');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="w-4 h-4" />
        <ChevronDown className="w-3 h-3 absolute -bottom-1 -right-1" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Settings */}
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Settings className="w-4 h-4" />
              Mina inställningar
            </div>
            <Link
              href="/settings/account"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Konto och säkerhet
            </Link>
          </div>

          <Separator className="my-2" />

          {/* Data & Insights */}
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <BarChart3 className="w-4 h-4" />
              Data och insikter
            </div>
            <Link
              href="/settings/analytics"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <BarChart3 className="w-4 h-4" />
              Statistik och rapporter
            </Link>
          </div>

          <Separator className="my-2" />

          {/* Company Settings */}
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4" />
              Företagsinställningar
            </div>
            <Link
              href="/settings/company/address"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <MapPin className="w-4 h-4" />
              Platser och adresser
            </Link>
            <Link
              href="/settings/company/subscription"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <CreditCard className="w-4 h-4" />
              Plan och funktioner
            </Link>
            <Link
              href="/settings/company/users"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Users className="w-4 h-4" />
              Team och roller
            </Link>
            <Link
              href="/settings/company/integrations"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Zap className="w-4 h-4" />
              Kopplingar till marknadsplatser
            </Link>
          </div>

          <Separator className="my-2" />

          {/* Support */}
          <div className="px-4 py-2">
            <Link
              href="/settings/support"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <HelpCircle className="w-4 h-4" />
              Support
            </Link>
          </div>

          <Separator className="my-2" />

          {/* Logout */}
          <div className="px-4 py-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Logga ut
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
