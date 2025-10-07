'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ArrowLeft, Eye, EyeOff, ChevronDown, FileText, Settings, ExternalLink, Star } from 'lucide-react';
import Link from 'next/link';
import { addItem, updateItem, AddItemRequest } from '@/lib/actions';
import { ConditionDropdown } from '@/components/ui/condition-dropdown';
import { ItemImage } from '@/components/item-image';
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

  // Fetch existing item data when editing
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

            // Populate form with existing data
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
        break;
      case 'pdf':
        // TODO: Implement PDF generation
        console.log('Skapa PDF');
        break;
      case 'settings':
        // TODO: Implement settings
        console.log('Inställningar');
        break;
    }
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

      // Send data to server action
      const addData = {
        name: formData.name,
        lagerplats: formData.lagerplats,
        description: formData.description || undefined,
        value: formData.value ? parseFloat(formData.value) : undefined,
        category: formData.category,
        subcategory: formData.subcategory,
        condition: formData.condition,
        photoUrls: visiblePhotos.length > 0 ? visiblePhotos : undefined
      };

      let result;
      if (isNewItem) {
        console.log('Calling addItem with:', addData);
        result = await addItem(addData);
      } else {
        console.log('Calling updateItem with:', addData);
        result = await updateItem(itemId, addData);
      }
      console.log('Result:', result);

      if (result.success && result.item) {
        console.log('Success! Redirecting to:', `/item/${result.item.id}`);
        // Redirect to item detail page
        window.location.href = `/item/${result.item.id}`;
      } else {
        console.error('Operation failed:', result.error);
        setError(result.error || 'Något gick fel');
      }

    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('Något gick fel när produkten sparades');
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
              Skapa annons
            </h1>
            <p className="text-muted-foreground">
              Redigera annonsinnehåll
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
                    Klicka på bilden för att dölja/visa i annonsen. Klicka på stjärnan för att välja huvudbild.
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
                <Button type="button" size="lg" variant="outline" className="flex-1" disabled={isLoading}>
                  {isLoading ? 'Sparar...' : (isNewItem ? 'Publicera annons' : 'Spara annons')}
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
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="text-primary-foreground">Publicera annons</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-10">
                    <button
                      type="button"
                      onClick={() => handleDropdownAction('blocket')}
                      className="w-full px-4 py-3 text-left hover:bg-muted flex items-center gap-3 first:rounded-t-md"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Skicka till Blocket</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDropdownAction('pdf')}
                      className="w-full px-4 py-3 text-left hover:bg-muted flex items-center gap-3"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Skapa PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDropdownAction('settings')}
                      className="w-full px-4 py-3 text-left hover:bg-muted flex items-center gap-3 last:rounded-b-md"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Inställningar</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Cancel Button */}
              <Link href="/dashboard">
                <Button type="button" variant="outline" size="lg" className="w-full">
                  Avbryt
                </Button>
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <p className="text-primary text-sm">Sparar produkt...</p>
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
    </div>
  );
}
