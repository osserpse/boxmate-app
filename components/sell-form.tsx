'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ArrowLeft, Eye, EyeOff } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      const visiblePhotos = existingPhotos.filter((_, index) => !hiddenPhotos.has(index));

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
                        <Image
                          src={photoUrl}
                          alt={`Produktbild ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 25vw, 200px"
                          className={`object-cover transition-opacity ${
                            hiddenPhotos.has(index) ? 'opacity-50' : 'opacity-100'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => togglePhotoVisibility(index)}
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                        >
                          {hiddenPhotos.has(index) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        {hiddenPhotos.has(index) && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">Dold</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Klicka på ögat för att dölja/visa bilder i annonsen
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
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="value"
                      type="number"
                      placeholder="0"
                      value={formData.value}
                      onChange={(e) => handleInputChange('value', e.target.value)}
                      className="h-11 pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Betrakta liknande produkter vid prissättning
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.negotiable}
                      onChange={(e) => handleInputChange('negotiable', e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-muted-foreground">Pris är förhandlingsbart</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? 'Sparar...' : (isNewItem ? 'Publicera annons' : 'Uppdatera annons')}
              </Button>

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
