'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CompanySubscriptionPage() {
  const [expandedSections, setExpandedSections] = useState({
    currentPlan: true,
    billing: false,
    planUpgrade: false,
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
                Prenumeration
              </h1>
              <p className="text-gray-600">
                Hantera din företagsprenumeration och faktureringsinformation.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('currentPlan')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Nuvarande plan
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Visa din nuvarande prenumerationsplan och dess funktioner.
                    </p>
                  </div>
                  {expandedSections.currentPlan ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.currentPlan && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      Prenumerationsöversikt kommer att implementeras i nästa steg...
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('billing')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Fakturering
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Hantera betalningsmetoder och visa faktureringshistorik.
                    </p>
                  </div>
                  {expandedSections.billing ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.billing && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      Faktureringshantering kommer att implementeras i nästa steg...
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('planUpgrade')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Planuppgradering
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Uppgradera eller ändra din prenumerationsplan baserat på dina behov.
                    </p>
                  </div>
                  {expandedSections.planUpgrade ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.planUpgrade && (
                  <div className="px-6 pb-6">
                    <div className="text-sm text-gray-500">
                      Planhantering kommer att implementeras i nästa steg...
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
