'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CompanyAddressPage() {
  const [expandedSections, setExpandedSections] = useState({
    companyInfo: true,
    companyAddress: false,
    contactInfo: false,
    billingAddress: false,
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
                Adress och kontakt
              </h1>
              <p className="text-gray-600">
                Hantera företagets adress och kontaktinformation.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('companyInfo')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Om företaget
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Kort beskrivning om företaget, visas i annonser
                    </p>
                  </div>
                  {expandedSections.companyInfo ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.companyInfo && (
                  <div className="px-6 pb-6">
                    <form className="space-y-4">
                  <div>
                    <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Företagsbeskrivning
                    </label>
                    <Textarea
                      id="companyDescription"
                      placeholder="Beskriv ditt företag, vad ni gör, era värderingar och vad som gör er unika. Denna text visas i era annonser."
                      className="w-full min-h-[120px] resize-y"
                      rows={5}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Max 500 tecken. En bra beskrivning hjälper kunder att förstå vad ni gör och varför de ska välja er.
                    </p>
                  </div>

                      <div className="flex justify-end pt-4">
                        <Button type="submit" className="bg-lime-600 hover:bg-lime-700">
                          Spara företagsbeskrivning
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('companyAddress')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Företagsadress
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Uppdatera företagets fysiska adress som används för leveranser och fakturering.
                    </p>
                  </div>
                  {expandedSections.companyAddress ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.companyAddress && (
                  <div className="px-6 pb-6">
                    <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                        Företagsnamn *
                      </label>
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Ange företagsnamn"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label htmlFor="orgNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Organisationsnummer *
                      </label>
                      <Input
                        id="orgNumber"
                        type="text"
                        placeholder="XXXXXX-XXXX"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      Gatuadress *
                    </label>
                    <Input
                      id="streetAddress"
                      type="text"
                      placeholder="Gatunamn och nummer"
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Postnummer *
                      </label>
                      <Input
                        id="postalCode"
                        type="text"
                        placeholder="123 45"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        Ort *
                      </label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Stad"
                        className="w-full"
                      />
                    </div>
                  </div>

                      <div className="flex justify-end pt-4">
                        <Button type="submit" className="bg-lime-600 hover:bg-lime-700">
                          Spara ändringar
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('contactInfo')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Kontaktinformation
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Hantera telefonnummer, e-post och andra kontaktuppgifter för företaget.
                    </p>
                  </div>
                  {expandedSections.contactInfo ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.contactInfo && (
                  <div className="px-6 pb-6">
                    <form className="space-y-6">
                  {/* Information Department */}
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-800 border-b border-gray-200 pb-2">
                      Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="infoPhone" className="block text-sm font-medium text-gray-700 mb-2">
                          Telefonnummer
                        </label>
                        <Input
                          id="infoPhone"
                          type="tel"
                          placeholder="+46 XX XXX XX XX"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="infoEmail" className="block text-sm font-medium text-gray-700 mb-2">
                          Mejl
                        </label>
                        <Input
                          id="infoEmail"
                          type="email"
                          placeholder="info@foretaget.se"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sales Department */}
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-800 border-b border-gray-200 pb-2">
                      Försäljning
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="salesPhone" className="block text-sm font-medium text-gray-700 mb-2">
                          Telefonnummer
                        </label>
                        <Input
                          id="salesPhone"
                          type="tel"
                          placeholder="+46 XX XXX XX XX"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="salesEmail" className="block text-sm font-medium text-gray-700 mb-2">
                          Mejl
                        </label>
                        <Input
                          id="salesEmail"
                          type="email"
                          placeholder="forsaljning@foretaget.se"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Support Department */}
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-800 border-b border-gray-200 pb-2">
                      Support
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="supportPhone" className="block text-sm font-medium text-gray-700 mb-2">
                          Telefonnummer
                        </label>
                        <Input
                          id="supportPhone"
                          type="tel"
                          placeholder="+46 XX XXX XX XX"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700 mb-2">
                          Mejl
                        </label>
                        <Input
                          id="supportEmail"
                          type="email"
                          placeholder="support@foretaget.se"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                      <div className="flex justify-end pt-4">
                        <Button type="submit" className="bg-lime-600 hover:bg-lime-700">
                          Spara kontaktinformation
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('billingAddress')}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Faktureringsadress
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Separera faktureringsadress från företagsadress om de skiljer sig åt.
                    </p>
                  </div>
                  {expandedSections.billingAddress ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.billingAddress && (
                  <div className="px-6 pb-6">
                    <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="billingCompanyName" className="block text-sm font-medium text-gray-700 mb-2">
                        Företagsnamn
                      </label>
                      <Input
                        id="billingCompanyName"
                        type="text"
                        placeholder="Ange faktureringsföretag"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label htmlFor="billingOrgNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Organisationsnummer
                      </label>
                      <Input
                        id="billingOrgNumber"
                        type="text"
                        placeholder="XXXXXX-XXXX"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="billingEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Mejl för faktura (PDF)
                    </label>
                    <Input
                      id="billingEmail"
                      type="email"
                      placeholder="faktura@foretaget.se"
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Fakturor skickas som PDF till denna e-postadress
                    </p>
                  </div>

                      <div className="flex justify-end pt-4">
                        <Button type="submit" className="bg-lime-600 hover:bg-lime-700">
                          Spara faktureringsadress
                        </Button>
                      </div>
                    </form>
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
