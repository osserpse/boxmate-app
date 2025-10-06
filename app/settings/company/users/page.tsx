'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CompanyUsersPage() {
  const [expandedSections, setExpandedSections] = useState({
    activeUsers: true,
    rolesPermissions: false,
    invitations: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Användare
              </h1>
              <p className="text-gray-600">
                Hantera användare och deras roller inom företaget.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('activeUsers')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Aktiva användare
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Visa och hantera alla användare som har tillgång till företagskontot.
                    </p>
                  </div>
                  {expandedSections.activeUsers ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.activeUsers && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      Användarlista kommer att implementeras i nästa steg...
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('rolesPermissions')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Roller och behörigheter
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Konfigurera roller och behörigheter för olika användare i företaget.
                    </p>
                  </div>
                  {expandedSections.rolesPermissions ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.rolesPermissions && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      Rollhantering kommer att implementeras i nästa steg...
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('invitations')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Inbjudningar
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Bjud in nya användare att gå med i företagskontot.
                    </p>
                  </div>
                  {expandedSections.invitations ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.invitations && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      Inbjudningssystem kommer att implementeras i nästa steg...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
