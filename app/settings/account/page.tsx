'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function AccountSettingsPage() {
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    security: false,
    notifications: false,
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
                Konto och säkerhet
              </h1>
              <p className="text-gray-600">
                Hantera din personliga information och säkerhetsinställningar.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('personalInfo')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Personlig information
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Här kan du uppdatera din personliga information som namn, e-post och telefonnummer.
                    </p>
                  </div>
                  {expandedSections.personalInfo ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.personalInfo && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      Formulär kommer att implementeras i nästa steg...
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('security')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Säkerhet
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Hantera ditt lösenord och andra säkerhetsinställningar för ditt konto.
                    </p>
                  </div>
                  {expandedSections.security ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.security && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      Säkerhetsinställningar kommer att implementeras i nästa steg...
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('notifications')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Notifikationer
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Konfigurera vilka notifikationer du vill ta emot via e-post och push-meddelanden.
                    </p>
                  </div>
                  {expandedSections.notifications ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.notifications && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      Notifikationsinställningar kommer att implementeras i nästa steg...
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
