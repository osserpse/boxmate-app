'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CompanyIntegrationsPage() {
  const [expandedSections, setExpandedSections] = useState({
    blocketIntegration: true,
    otherPlatforms: false,
    apiKeys: false,
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
                Integrationer
              </h1>
              <p className="text-gray-600">
                Hantera externa integrationer som Blocket och andra plattformar.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('blocketIntegration')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Blocket Integration
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Anslut ditt BoxMate-konto till Blocket för automatisk synkronisering av produkter.
                    </p>
                  </div>
                  {expandedSections.blocketIntegration ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.blocketIntegration && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      Blocket-integration kommer att implementeras i nästa steg...
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('otherPlatforms')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Andra plattformar
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Utforska och konfigurera integrationer med andra marknadsplatser.
                    </p>
                  </div>
                  {expandedSections.otherPlatforms ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.otherPlatforms && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      Ytterligare integrationer kommer att implementeras i nästa steg...
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('apiKeys')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      API-nycklar
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Hantera API-nycklar och autentiseringsuppgifter för externa tjänster.
                    </p>
                  </div>
                  {expandedSections.apiKeys ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.apiKeys && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      API-hantering kommer att implementeras i nästa steg...
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
