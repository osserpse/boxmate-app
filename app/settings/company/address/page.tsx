'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { getCompanySettings, updateCompanySection, CompanySettings } from '@/lib/company-actions';

export default function CompanyAddressPage() {
  const [expandedSections, setExpandedSections] = useState({
    companyInfo: true,
    companyAddress: false,
    contactInfo: false,
    billingAddress: false,
  });

  // Form state
  const [formData, setFormData] = useState({
    // Company Information
    company_description: '',

    // Company Address
    company_name: '',
    org_number: '',
    street_address: '',
    postal_code: '',
    city: '',

    // Contact Information
    info_phone: '',
    info_email: '',
    sales_phone: '',
    sales_email: '',
    support_phone: '',
    support_email: '',

    // Billing Address
    billing_company_name: '',
    billing_org_number: '',
    billing_email: '',
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load existing data on component mount
  useEffect(() => {
    loadCompanySettings();
  }, []);

  const loadCompanySettings = async () => {
    try {
      setIsLoadingData(true);
      const result = await getCompanySettings();

      if (result.success && result.data) {
        setFormData({
          company_description: result.data.company_description || '',
          company_name: result.data.company_name || '',
          org_number: result.data.org_number || '',
          street_address: result.data.street_address || '',
          postal_code: result.data.postal_code || '',
          city: result.data.city || '',
          info_phone: result.data.info_phone || '',
          info_email: result.data.info_email || '',
          sales_phone: result.data.sales_phone || '',
          sales_email: result.data.sales_email || '',
          support_phone: result.data.support_phone || '',
          support_email: result.data.support_email || '',
          billing_company_name: result.data.billing_company_name || '',
          billing_org_number: result.data.billing_org_number || '',
          billing_email: result.data.billing_email || '',
        });
      }
    } catch (error) {
      console.error('Error loading company settings:', error);
      setError('Kunde inte ladda företagsinställningar');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (section: string, data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const result = await updateCompanySection(section, data);

      if (result.success) {
        setSuccess(`${section === 'companyInfo' ? 'Företagsbeskrivning' :
                    section === 'companyAddress' ? 'Företagsadress' :
                    section === 'contactInfo' ? 'Kontaktinformation' : 'Faktureringsadress'} sparad framgångsrikt!`);
      } else {
        setError(result.error || 'Ett fel uppstod vid sparning');
      }
    } catch (error) {
      console.error('Error saving company settings:', error);
      setError('Ett oväntat fel uppstod');
    } finally {
      setIsLoading(false);
    }
  };

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

            {/* Loading State */}
            {isLoadingData && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-lime-600" />
                <span className="ml-2 text-gray-600">Laddar företagsinställningar...</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            {!isLoadingData && (
              <div className="space-y-6">
                {/* Company Info Section */}
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
                      <form
                        className="space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit('companyInfo', { company_description: formData.company_description });
                        }}
                      >
                        <div>
                          <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-2">
                            Företagsbeskrivning
                          </label>
                          <Textarea
                            id="companyDescription"
                            placeholder="Beskriv ditt företag, vad ni gör, era värderingar och vad som gör er unika. Denna text visas i era annonser."
                            className="w-full min-h-[120px] resize-y"
                            rows={5}
                            value={formData.company_description}
                            onChange={(e) => handleInputChange('company_description', e.target.value)}
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Max 500 tecken. En bra beskrivning hjälper kunder att förstå vad ni gör och varför de ska välja er.
                          </p>
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button
                            type="submit"
                            className="bg-lime-600 hover:bg-lime-700"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Sparar...
                              </>
                            ) : (
                              'Spara företagsbeskrivning'
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* Company Address Section */}
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
                      <form
                        className="space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit('companyAddress', {
                            company_name: formData.company_name,
                            org_number: formData.org_number,
                            street_address: formData.street_address,
                            postal_code: formData.postal_code,
                            city: formData.city,
                          });
                        }}
                      >
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
                              value={formData.company_name}
                              onChange={(e) => handleInputChange('company_name', e.target.value)}
                              required
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
                              value={formData.org_number}
                              onChange={(e) => handleInputChange('org_number', e.target.value)}
                              required
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
                            value={formData.street_address}
                            onChange={(e) => handleInputChange('street_address', e.target.value)}
                            required
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
                              value={formData.postal_code}
                              onChange={(e) => handleInputChange('postal_code', e.target.value)}
                              required
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
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button
                            type="submit"
                            className="bg-lime-600 hover:bg-lime-700"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Sparar...
                              </>
                            ) : (
                              'Spara ändringar'
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* Contact Info Section */}
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
                      <form
                        className="space-y-6"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit('contactInfo', {
                            info_phone: formData.info_phone,
                            info_email: formData.info_email,
                            sales_phone: formData.sales_phone,
                            sales_email: formData.sales_email,
                            support_phone: formData.support_phone,
                            support_email: formData.support_email,
                          });
                        }}
                      >
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
                                value={formData.info_phone}
                                onChange={(e) => handleInputChange('info_phone', e.target.value)}
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
                                value={formData.info_email}
                                onChange={(e) => handleInputChange('info_email', e.target.value)}
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
                                value={formData.sales_phone}
                                onChange={(e) => handleInputChange('sales_phone', e.target.value)}
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
                                value={formData.sales_email}
                                onChange={(e) => handleInputChange('sales_email', e.target.value)}
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
                                value={formData.support_phone}
                                onChange={(e) => handleInputChange('support_phone', e.target.value)}
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
                                value={formData.support_email}
                                onChange={(e) => handleInputChange('support_email', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button
                            type="submit"
                            className="bg-lime-600 hover:bg-lime-700"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Sparar...
                              </>
                            ) : (
                              'Spara kontaktinformation'
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* Billing Address Section */}
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
                      <form
                        className="space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit('billingAddress', {
                            billing_company_name: formData.billing_company_name,
                            billing_org_number: formData.billing_org_number,
                            billing_email: formData.billing_email,
                          });
                        }}
                      >
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
                              value={formData.billing_company_name}
                              onChange={(e) => handleInputChange('billing_company_name', e.target.value)}
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
                              value={formData.billing_org_number}
                              onChange={(e) => handleInputChange('billing_org_number', e.target.value)}
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
                            value={formData.billing_email}
                            onChange={(e) => handleInputChange('billing_email', e.target.value)}
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Fakturor skickas som PDF till denna e-postadress
                          </p>
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button
                            type="submit"
                            className="bg-lime-600 hover:bg-lime-700"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Sparar...
                              </>
                            ) : (
                              'Spara faktureringsadress'
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
