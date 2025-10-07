'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ArrowLeft, Eye, EyeOff, ChevronDown, FileText, Settings, ExternalLink, Star, X } from 'lucide-react';
import Link from 'next/link';
import { createAd, updateAd, AdRequest } from '@/lib/ad-actions';
import { ConditionDropdown } from '@/components/ui/condition-dropdown';
import { ItemImage } from '@/components/item-image';
import { Ad } from '@/lib/ad-actions';
import { Item } from '@/lib/supabase';
import Image from 'next/image';

interface SellFormProps {
  itemId: string;
}

export function SellForm({ itemId }: SellFormProps) {
  const isNewItem = itemId === 'new';
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    lagerplats: '',
    category: 'electronics',
    subcategory: '',
    condition: 'good',
    negotiable: false
  });
  const [existingItem, setExistingItem] = useState<Item | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [hiddenPhotos, setHiddenPhotos] = useState<Set<number>>(new Set());
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showPdfView, setShowPdfView] = useState(false);
  const [savedAdId, setSavedAdId] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isDropdownOpen && !target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Fetch existing item data to populate the sell form
  useEffect(() => {
    if (!isNewItem) {
      const fetchItem = async () => {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
          const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
          const supabase = createClient(supabaseUrl, supabaseKey);

          const { data: item, error } = await supabase
            .from('items')
            .select('*')
            .eq('id', itemId)
            .single();

          if (error) {
            console.error('Error fetching item:', error);
            setError('Kunde inte hämta produktdata');
            return;
          }

          if (item) {
            setExistingItem(item);

            // Parse photos JSON if it exists
            let photos: string[] = [];
            if (item.photos && typeof item.photos === 'string') {
              try {
                photos = JSON.parse(item.photos);
              } catch (error) {
                console.error('Error parsing photos JSON:', error);
                photos = [];
              }
            } else if (Array.isArray(item.photos)) {
              photos = item.photos;
            }

            setExistingPhotos(photos);

            // Set primary image (first visible image or first image if none are hidden)
            if (photos.length > 0) {
              setPrimaryImageIndex(0);
            }

            // Populate form with existing item data
            setFormData({
              name: item.name || '',
              description: item.description || '',
              value: item.value ? item.value.toString() : '',
              lagerplats: item.lagerplats || '',
              category: item.category || 'electronics',
              subcategory: item.subcategory || '',
              condition: item.condition || 'good',
              negotiable: false // This field doesn't exist in the database yet
            });
          }
        } catch (err) {
          console.error('Error in fetchItem:', err);
          setError('Något gick fel när produktdata hämtades');
        }
      };

      fetchItem();
    }
  }, [itemId, isNewItem]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Reset subcategory when category changes
      if (field === 'category') {
        newData.subcategory = '';
      }
      return newData;
    });
    if (error) setError('');
  };

  const togglePhotoVisibility = (index: number) => {
    setHiddenPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const setPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
  };

  const handleDropdownAction = (action: string) => {
    setIsDropdownOpen(false);
    switch (action) {
      case 'blocket':
        // TODO: Implement Blocket integration
        console.log('Skicka till Blocket');
        alert('Blocket integration kommer snart!');
        break;
      case 'pdf':
        setShowPdfView(true);
        break;
      case 'settings':
        // TODO: Implement settings
        console.log('Inställningar');
        alert('Inställningar kommer snart!');
        break;
    }
  };

  const handlePublishClick = () => {
    if (!savedAdId) {
      // If no ad is saved yet, save as draft first
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
      return;
    }
    setShowPublishModal(true);
  };

  const handlePdfSave = () => {
    // TODO: Implement actual PDF generation
    console.log('Generating PDF for ad:', savedAdId);
    alert('PDF-generering kommer snart!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submitted');
    console.log('Form data:', formData);

    // Validation
    if (!formData.name.trim() || !formData.lagerplats.trim()) {
      setError('Namn och plats måste fyllas i');
      return;
    }

    if (formData.category === 'electronics' && !formData.subcategory) {
      setError('Underkategori måste väljas för elektronik');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use existing photos, filtering out hidden ones
      let visiblePhotos = existingPhotos.filter((_, index) => !hiddenPhotos.has(index));

      // Reorder photos to put primary image first
      if (visiblePhotos.length > 0 && primaryImageIndex < existingPhotos.length) {
        const primaryPhoto = existingPhotos[primaryImageIndex];
        if (!hiddenPhotos.has(primaryImageIndex) && visiblePhotos.includes(primaryPhoto)) {
          // Remove primary photo from its current position and add it to the beginning
          visiblePhotos = visiblePhotos.filter(photo => photo !== primaryPhoto);
          visiblePhotos.unshift(primaryPhoto);
        }
      }

      // Send data to server action - always create new ad from item
      const adData: AdRequest = {
        name: formData.name,
        lagerplats: formData.lagerplats,
        description: formData.description || undefined,
        value: formData.value ? parseFloat(formData.value) : undefined,
        category: formData.category,
        subcategory: formData.subcategory,
        condition: formData.condition,
        photoUrls: visiblePhotos.length > 0 ? visiblePhotos : undefined,
        itemId: !isNewItem ? itemId : undefined // Always link to the original item
      };

      console.log('Creating ad from item with data:', adData);
      const result = await createAd(adData);
      console.log('Result:', result);

      if (result.success && result.ad) {
        console.log('Success! Ad saved as draft.');
        setSavedAdId(result.ad.id);
        // Don't redirect immediately - let user choose to publish or continue editing
      } else {
        console.error('Operation failed:', result.error);
        setError(result.error || 'Något gick fel');
      }

    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('Något gick fel när annonsen sparades');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { value: 'business', label: 'Affärsverksamhet (företag)' },
    { value: 'electronics', label: 'Elektronik' },
    { value: 'other', label: 'Övrigt' }
  ];

  const electronicsSubcategories = [
    { value: 'computers-gaming', label: 'Datorer och TV-spel' },
    { value: 'audio-video', label: 'Ljud och Bild' },
    { value: 'phones-accessories', label: 'Telefoner & tillbehör' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Skapa annons från produkt
            </h1>
            <p className="text-muted-foreground">
              Anpassa produktinformation för annonsen
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Existing Photos */}
            {!isNewItem && existingPhotos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Produktbilder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {existingPhotos.map((photoUrl, index) => (
                      <div key={index} className="relative aspect-square bg-secondary rounded-lg overflow-hidden group">
                        <button
                          type="button"
                          onClick={() => togglePhotoVisibility(index)}
                          className="absolute inset-0 w-full h-full cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                        >
                          <Image
                            src={photoUrl}
                            alt={`Produktbild ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 25vw, 200px"
                            className={`object-cover transition-opacity ${
                              hiddenPhotos.has(index) ? 'opacity-50' : 'opacity-100'
                            }`}
                          />
                          {hiddenPhotos.has(index) && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <span className="text-white text-xs font-medium">Dold</span>
                            </div>
                          )}
                        </button>

                        {/* Eye icon for visibility toggle */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePhotoVisibility(index);
                          }}
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors z-10"
                        >
                          {hiddenPhotos.has(index) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>

                        {/* Star icon for primary image selection */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrimaryImage(index);
                          }}
                          className={`absolute top-2 left-2 p-1 rounded-full transition-colors z-10 ${
                            primaryImageIndex === index
                              ? 'bg-yellow-500 text-white'
                              : 'bg-black/50 hover:bg-black/70 text-white'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${primaryImageIndex === index ? 'fill-current' : ''}`} />
                        </button>

                        {/* Primary image indicator */}
                        {primaryImageIndex === index && (
                          <div className="absolute bottom-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                            Huvudbild
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Produktbilder från inventariet. Klicka på bilden för att dölja/visa i annonsen. Klicka på stjärnan för att välja huvudbild.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Grundinformation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Namn *
                  </label>
                  <Input
                    id="name"
                    placeholder="Namn på produkten"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-11"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Kategori *
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.category === 'electronics' && (
                  <div>
                    <label htmlFor="subcategory" className="block text-sm font-medium mb-2">
                      Underkategori *
                    </label>
                    <select
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={(e) => handleInputChange('subcategory', e.target.value)}
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Välj underkategori</option>
                      {electronicsSubcategories.map((subcat) => (
                        <option key={subcat.value} value={subcat.value}>
                          {subcat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium mb-2">
                    Skick *
                  </label>
                  <ConditionDropdown
                    value={formData.condition}
                    onChange={(value) => handleInputChange('condition', value)}
                    placeholder="Välj från listan"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Beskrivning
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Beskriv produkten..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="lagerplats" className="block text-sm font-medium mb-2">
                    Plats *
                  </label>
                  <Input
                    id="lagerplats"
                    placeholder="Stockholm, Sverige"
                    value={formData.lagerplats}
                    onChange={(e) => handleInputChange('lagerplats', e.target.value)}
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Prissättning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="value" className="block text-sm font-medium mb-2">
                    Pris (kr), inklusive moms
                  </label>
                  <div className="relative">
                    <Input
                      id="value"
                      type="number"
                      placeholder="0"
                      value={formData.value}
                      onChange={(e) => handleInputChange('value', e.target.value)}
                      className="h-11 pl-2 text-base"
                    />
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              {/* Main Action Buttons */}
              <div className="flex gap-3">
                <Button type="submit" size="lg" variant="outline" className="flex-1" disabled={isLoading}>
                  {isLoading ? 'Sparar...' : 'Spara som utkast'}
                </Button>
                <Button type="button" variant="outline" size="lg" className="flex-1">
                  Förhandsgranska
                </Button>
              </div>

              {/* Dropdown Actions */}
              <div className="relative dropdown-container">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full justify-between bg-primary hover:bg-primary/90"
                  onClick={handlePublishClick}
                >
                  <span className="text-primary-foreground">Publicera annons</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>

              </div>

              {/* Cancel Button */}
              <Link href="/dashboard">
                <Button type="button" variant="outline" size="lg" className="w-full">
                  Avbryt
                </Button>
              </Link>
            </div>

            {/* Success Message */}
            {savedAdId && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">✅ Annons sparad som utkast! Klicka på "Publicera annons" för att fortsätta.</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <p className="text-primary text-sm">Sparar annons...</p>
              </div>
            )}

            {/* Tips */}
            <Card className="bg-warning/10 border-warning/20">
              <CardContent className="p-4">
                <h4 className="font-semibold text-warning mb-2">💡 Tips för att sälja:</h4>
                <ul className="text-sm text-warning/80 space-y-1">
                  <li>• Ta tydliga och välbelysta foton</li>
                  <li>• Skriv detaljerade beskrivningar</li>
                  <li>• Sätt konkurrenskraftiga priser</li>
                  <li>• Svara snabbt på köpare</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Publicera annons</h3>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-muted-foreground mb-6">
              Välj hur du vill publicera din annons:
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowPublishModal(false);
                  handleDropdownAction('blocket');
                }}
                className="w-full p-4 border border-border rounded-lg hover:bg-muted flex items-center gap-3"
              >
                <ExternalLink className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Skicka till Blocket</div>
                  <div className="text-sm text-muted-foreground">Publicera automatiskt på Blocket</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowPublishModal(false);
                  handleDropdownAction('pdf');
                }}
                className="w-full p-4 border border-border rounded-lg hover:bg-muted flex items-center gap-3"
              >
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Skapa PDF</div>
                  <div className="text-sm text-muted-foreground">Generera PDF för utskrift</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowPublishModal(false);
                  handleDropdownAction('settings');
                }}
                className="w-full p-4 border border-border rounded-lg hover:bg-muted flex items-center gap-3"
              >
                <Settings className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Inställningar</div>
                  <div className="text-sm text-muted-foreground">API-nycklar och inställningar</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF View Modal */}
      {showPdfView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl max-h-[95vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
              <h3 className="text-lg font-semibold">Förhandsgranskning - PDF</h3>
              <button
                onClick={() => setShowPdfView(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              {/* PDF Content */}
              <div className="bg-white p-8 shadow-lg">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">{formData.name}</h1>
                  <p className="text-lg text-muted-foreground">{formData.lagerplats}</p>
                </div>

                {/* Main Image */}
                {existingPhotos.length > 0 && (
                  <div className="mb-6">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={existingPhotos[primaryImageIndex] || existingPhotos[0]}
                        alt={formData.name}
                        width={800}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Kategori</h3>
                    <p className="text-muted-foreground">
                      {formData.category === 'electronics' ? 'Elektronik' :
                       formData.category === 'business' ? 'Affärsverksamhet' : 'Övrigt'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Skick</h3>
                    <p className="text-muted-foreground">{formData.condition}</p>
                  </div>
                  {formData.value && (
                    <div>
                      <h3 className="font-semibold mb-2">Pris</h3>
                      <p className="text-2xl font-bold text-primary">{formData.value} kr</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {formData.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Beskrivning</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{formData.description}</p>
                  </div>
                )}

                {/* Additional Images */}
                {existingPhotos.length > 1 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4">Fler bilder</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {existingPhotos.slice(1, 4).map((photo, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={photo}
                            alt={`${formData.name} ${index + 2}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center text-sm text-muted-foreground mt-8">
                  Genererad {new Date().toLocaleDateString('sv-SE')}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowPdfView(false)}
              >
                Stäng
              </Button>
              <Button
                onClick={handlePdfSave}
                className="bg-primary hover:bg-primary/90"
              >
                Spara som PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
