'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function SupportPage() {
  const [expandedSections, setExpandedSections] = useState({
    faq: true,
    contactSupport: false,
    documentation: false,
    systemStatus: false,
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
                Support
              </h1>
              <p className="text-gray-600">
                Få hjälp och support för BoxMate-plattformen.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('faq')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Vanliga frågor
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Hitta svar på de vanligaste frågorna om BoxMate och dess funktioner.
                    </p>
                  </div>
                  {expandedSections.faq ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.faq && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      FAQ-sektion kommer att implementeras i nästa steg...
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('contactSupport')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Kontakta support
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Skicka ett supportärende eller kontakta vårt supportteam direkt.
                    </p>
                  </div>
                  {expandedSections.contactSupport ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.contactSupport && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      Supportformulär kommer att implementeras i nästa steg...
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('documentation')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Dokumentation
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Utforska vår omfattande dokumentation och guider för att få ut det mesta av BoxMate.
                    </p>
                  </div>
                  {expandedSections.documentation ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.documentation && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      Dokumentationslänkar kommer att implementeras i nästa steg...
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('systemStatus')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Systemstatus
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Kontrollera den aktuella statusen för BoxMate-tjänster och eventuella driftstörningar.
                    </p>
                  </div>
                  {expandedSections.systemStatus ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.systemStatus && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      Statusöversikt kommer att implementeras i nästa steg...
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
