'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ArrowLeft, Upload, Camera } from 'lucide-react';
import Link from 'next/link';
import { FileUpload } from '@/components/file-upload';
import { addItem, AddItemRequest } from '@/lib/actions';

interface SellFormProps {
  itemId: string;
}

export function SellForm({ itemId }: SellFormProps) {
  const isNewItem = itemId === 'new';
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    location: '',
    category: 'electronics',
    subcategory: '',
    condition: 'good',
    negotiable: false
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submitted');
    console.log('Form data:', formData);
    console.log('Files:', files);

    // Validation
    if (!formData.name.trim() || !formData.location.trim()) {
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
      let uploadedPhotoUrls = [];

      // Upload files to Supabase Storage first (client-side)
      if (files.length > 0) {
        console.log(`Uploading ${files.length} files to Supabase Storage...`);

        // Import Supabase client dynamically
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            console.log(`Uploading file ${i + 1}: ${file.name}`);

            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${i}.${fileExt}`;

            // Upload file to Supabase Storage
            const { error: uploadError } = await supabase.storage
              .from('item-photos')
              .upload(fileName, file, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
              });

            if (uploadError) {
              throw new Error(`Upload failed: ${uploadError.message}`);
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('item-photos')
              .getPublicUrl(fileName);

            uploadedPhotoUrls.push(publicUrl);
            console.log(`Uploaded ${file.name} -> ${publicUrl}`);

          } catch (fileError) {
            console.error(`Error uploading ${file.name}:`, fileError);
            throw new Error(`Fel vid uppladdning av ${file.name}: ${fileError}`);
          }
        }
      }

      // Send only URLs to server action (much smaller payload)
      const addData = {
        name: formData.name,
        location: formData.location,
        description: formData.description || undefined,
        value: formData.value ? parseFloat(formData.value) : undefined,
        photoUrls: uploadedPhotoUrls.length > 0 ? uploadedPhotoUrls : undefined
      };

      console.log('Calling addItem with:', addData);
      const result = await addItem(addData);
      console.log('addItem result:', result);

      if (result.success && result.item) {
        console.log('Success! Redirecting to:', `/item/${result.item.id}`);
        // Redirect to item detail page
        window.location.href = `/item/${result.item.id}`;
      } else {
        console.error('addItem failed:', result.error);
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

  const conditions = [
    { value: 'new', label: 'Som ny' },
    { value: 'excellent', label: 'Utmärkt' },
    { value: 'good', label: 'Bra' },
    { value: 'fair', label: 'Skälig' },
    { value: 'poor', label: 'Dålig' }
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
            <h1 className="text-3xl font-bold text-stone-900">
              {isNewItem ? 'Sälj ny produkt' : 'Redigera produkt'}
            </h1>
            <p className="text-muted-foreground">
              {isNewItem ? 'Skapa en annons för din produkt' : 'Uppdatera produktdetaljer'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <FileUpload
              onFilesChange={setFiles}
              className="space-y-4"
            />

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
                  <select
                    id="condition"
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {conditions.map((cond) => (
                      <option key={cond.value} value={cond.value}>
                        {cond.label}
                      </option>
                    ))}
                  </select>
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
                  <label htmlFor="location" className="block text-sm font-medium mb-2">
                    Plats *
                  </label>
                  <Input
                    id="location"
                    placeholder="Stockholm, Sverige"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
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
                    Värde (kr)
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
                      className="rounded border-stone-300"
                    />
                    <span className="text-sm text-muted-foreground">Pris är förhandlingsbart</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button type="submit" size="lg" className="w-full bg-lime-500 hover:bg-lime-600" disabled={isLoading}>
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="bg-lime-50 border border-lime-200 rounded-lg p-3">
                <p className="text-lime-800 text-sm">Sparar produkt...</p>
              </div>
            )}

            {/* Tips */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Tips för att sälja:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
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
